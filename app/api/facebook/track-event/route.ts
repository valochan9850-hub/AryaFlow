import { NextRequest, NextResponse } from "next/server";
import { sendFacebookConversionEvent } from "@/lib/facebook-capi";

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();

    // Validate required fields
    if (!eventData.event_name || !eventData.user_data) {
      return NextResponse.json(
        { error: "Missing required event data" },
        { status: 400 }
      );
    }

    // Get client information from request headers
    const clientIpAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const clientUserAgent = request.headers.get("user-agent") || "unknown";

    // Enhance event data with client info
    const enhancedEventData = {
      ...eventData,
      event_time: eventData.event_time || Math.floor(Date.now() / 1000),
      action_source: eventData.action_source || "website",
      user_data: {
        ...eventData.user_data,
        clientIpAddress,
        clientUserAgent,
      },
    };

    const success = await sendFacebookConversionEvent(enhancedEventData);

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Event tracked successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to track event" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in track-event API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to track event" },
      { status: 500 }
    );
  }
}
