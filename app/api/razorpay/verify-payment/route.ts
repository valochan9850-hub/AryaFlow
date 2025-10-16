import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userDetails,
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
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
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
