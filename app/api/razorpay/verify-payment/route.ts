import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { trackServerPurchase } from "@/lib/facebook-capi";

export async function POST(request: NextRequest) {
  try {
    // Check if Razorpay secret is configured
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Payment gateway not configured. Please contact support." },
        { status: 503 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userDetails,
      amount,
      fbp,
      fbc,
      eventId,
    } = await request.json();

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment details" },
        { status: 400 }
      );
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is successful and verified
      // Here you can:
      // 1. Save to database
      // 2. Send confirmation email
      // 3. Grant access to webinar

      console.log("Payment verified successfully:", {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        userDetails,
      });

      // TODO: Add your database logic here
      // Example: await saveRegistration({ userDetails, paymentId: razorpay_payment_id });

      // Track purchase with Facebook Conversion API (server-side)
      if (amount && userDetails) {
        const referer = request.headers.get("referer") || "https://aryaflow.com";

        // Get client information from request headers
        const clientIpAddress =
          request.headers.get("x-forwarded-for")?.split(",")[0] ||
          request.headers.get("x-real-ip") ||
          undefined;

        const clientUserAgent = request.headers.get("user-agent") || undefined;

        // Parse name into first and last name
        const nameParts = (userDetails.name || "").split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");

        await trackServerPurchase(
          {
            email: userDetails.email,
            phone: userDetails.phone,
            firstName: firstName,
            lastName: lastName,
            country: "in", // India
            clientIpAddress: clientIpAddress,
            clientUserAgent: clientUserAgent,
            fbp: fbp, // Facebook browser ID from cookie
            fbc: fbc, // Facebook click ID from URL
            externalId: razorpay_payment_id, // Use payment ID as external ID
          },
          amount / 100, // Convert paise to rupees
          "INR",
          razorpay_order_id,
          referer,
          eventId // Use same event ID for deduplication with client-side pixel
        );
      }

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
