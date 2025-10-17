"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { trackInitiateCheckout, trackLead } from "@/components/FacebookPixel";

declare global {
  interface Window {
    Razorpay: any;
    fbq: any;
  }
}

// Helper to get Facebook browser ID (fbp) from cookie
function getFbp(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/_fbp=([^;]+)/);
  return match ? match[1] : undefined;
}

// Helper to get Facebook click ID (fbc) from cookie
function getFbc(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/_fbc=([^;]+)/);
  return match ? match[1] : undefined;
}

// Generate event ID for deduplication between Pixel and CAPI
function generateEventId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

interface RazorpayPaymentProps {
  amount: number;
  buttonText?: string;
  buttonClassName?: string;
  children?: React.ReactNode;
}

export default function RazorpayPayment({
  amount,
  buttonText = "Pay Now",
  buttonClassName = "",
  children,
}: RazorpayPaymentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!userDetails.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!userDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!userDetails.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(userDetails.phone)) {
      newErrors.phone = "Invalid phone number (10 digits starting with 6-9)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Generate event ID for deduplication between client-side Pixel and server-side CAPI
    const purchaseEventId = generateEventId();

    // Track that user initiated checkout
    trackInitiateCheckout({
      value: amount / 100, // Convert paise to rupees
      currency: "INR",
      content_name: "Wellness Webinar Registration",
      content_category: "Webinar",
    });

    // Track lead (user provided contact information)
    trackLead({
      content_name: "Wellness Webinar Registration",
      value: amount / 100,
      currency: "INR",
    });

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay. Please check your internet connection.");
        setIsProcessing(false);
        return;
      }

      // Create order
      const orderResponse = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          notes: {
            name: userDetails.name,
            email: userDetails.email,
            phone: userDetails.phone,
          },
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AryaFlow",
        description: "Wellness Webinar Registration",
        order_id: orderData.orderId,
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: {
          color: "#16a34a", // Green color matching your theme
        },
        handler: async function (response: any) {
          try {
            // Get Facebook identifiers for server-side tracking
            const fbp = getFbp();
            const fbc = getFbc();

            // Verify payment
            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userDetails: userDetails,
                amount: orderData.amount, // Send amount for CAPI tracking
                fbp: fbp, // Facebook browser ID
                fbc: fbc, // Facebook click ID
                eventId: purchaseEventId, // For deduplication
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              // Track successful purchase (client-side with same event ID)
              if (window.fbq) {
                window.fbq('track', 'Purchase', {
                  value: 99,
                  currency: 'INR',
                  contents: [
                    {
                      id: 'Webinar99',
                      quantity: 1
                    }
                  ],
                  content_ids: 'Product',
                }, { eventID: purchaseEventId });
              }

              alert("Payment successful! Check your email for webinar details.");
              setIsDialogOpen(false);
              setUserDetails({ name: "", email: "", phone: "" });
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Payment verification failed. Please contact support.");
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error("Error processing payment:", error);
      alert(error.message || "Failed to process payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div onClick={() => setIsDialogOpen(true)}>
        {children || (
          <Button className={buttonClassName} disabled={isProcessing}>
            {buttonText}
          </Button>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Register for Webinar</DialogTitle>
            <div className="mt-3 mb-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-lg font-bold text-green-700 dark:text-green-400 text-center">
                📅 24th October | ⏰ 9 PM
              </div>
            </div>
            <DialogDescription>
              Enter your details to complete registration. Payment: ₹{amount}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={userDetails.name}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, name: e.target.value })
                }
                placeholder="Enter your full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={userDetails.email}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, email: e.target.value })
                }
                placeholder="your.email@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={userDetails.phone}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, phone: e.target.value })
                }
                placeholder="10-digit mobile number"
                maxLength={10}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handlePayment}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${amount}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
