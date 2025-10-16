import crypto from "crypto";

interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  externalId?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbc?: string; // Facebook click ID
  fbp?: string; // Facebook browser ID
}

interface CustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  contents?: Array<{ id: string; quantity: number }>;
  num_items?: number;
  order_id?: string;
  predicted_ltv?: number;
  status?: string;
}

interface EventData {
  event_name: string;
  event_time: number;
  event_source_url: string;
  action_source: "website" | "email" | "app" | "phone_call" | "chat" | "physical_store" | "system_generated" | "other";
  user_data: UserData;
  custom_data?: CustomData;
  event_id?: string;
}

// Hash user data for privacy
function hashData(data: string | undefined): string | undefined {
  if (!data) return undefined;

  // Normalize data
  const normalized = data.toLowerCase().trim();

  // Hash using SHA-256
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

// Prepare user data with hashing
function prepareUserData(userData: Partial<UserData>): any {
  const prepared: any = {};

  if (userData.email) {
    prepared.em = hashData(userData.email);
  }

  if (userData.phone) {
    // Remove all non-numeric characters
    const phoneDigits = userData.phone.replace(/\D/g, "");
    prepared.ph = hashData(phoneDigits);
  }

  if (userData.firstName) {
    prepared.fn = hashData(userData.firstName);
  }

  if (userData.lastName) {
    prepared.ln = hashData(userData.lastName);
  }

  if (userData.city) {
    prepared.ct = hashData(userData.city);
  }

  if (userData.state) {
    prepared.st = hashData(userData.state);
  }

  if (userData.country) {
    prepared.country = hashData(userData.country);
  }

  if (userData.zipCode) {
    prepared.zp = hashData(userData.zipCode);
  }

  if (userData.externalId) {
    prepared.external_id = hashData(userData.externalId);
  }

  // These should NOT be hashed
  if (userData.clientIpAddress) {
    prepared.client_ip_address = userData.clientIpAddress;
  }

  if (userData.clientUserAgent) {
    prepared.client_user_agent = userData.clientUserAgent;
  }

  if (userData.fbc) {
    prepared.fbc = userData.fbc;
  }

  if (userData.fbp) {
    prepared.fbp = userData.fbp;
  }

  return prepared;
}

export async function sendFacebookConversionEvent(eventData: EventData): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const accessToken = process.env.FB_CONVERSION_API_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn("Facebook Conversion API not configured. Skipping server-side event tracking.");
    return false;
  }

  try {
    const url = `https://graph.facebook.com/v18.0/${pixelId}/events`;

    // Prepare the event data
    const event = {
      event_name: eventData.event_name,
      event_time: eventData.event_time,
      event_source_url: eventData.event_source_url,
      action_source: eventData.action_source,
      user_data: prepareUserData(eventData.user_data),
      custom_data: eventData.custom_data,
      event_id: eventData.event_id, // Important for deduplication with Pixel
    };

    const requestBody = {
      data: [event],
      access_token: accessToken,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Facebook Conversion API error:", result);
      return false;
    }

    console.log("Facebook Conversion API event sent successfully:", {
      event_name: eventData.event_name,
      events_received: result.events_received,
      messages: result.messages,
    });

    return true;
  } catch (error) {
    console.error("Error sending Facebook Conversion API event:", error);
    return false;
  }
}

// Helper function to generate event ID for deduplication
export function generateEventId(): string {
  return `${Date.now()}_${crypto.randomBytes(8).toString("hex")}`;
}

// Standard event helpers
export async function trackServerPurchase(
  userData: UserData,
  orderValue: number,
  currency: string = "INR",
  orderId: string,
  eventSourceUrl: string,
  eventId?: string
): Promise<boolean> {
  return sendFacebookConversionEvent({
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: eventSourceUrl,
    action_source: "website",
    user_data: userData,
    custom_data: {
      value: orderValue,
      currency: currency,
      order_id: orderId,
      content_name: "Wellness Webinar Registration",
      content_category: "Webinar",
    },
    event_id: eventId || generateEventId(),
  });
}

export async function trackServerLead(
  userData: UserData,
  value: number,
  currency: string = "INR",
  eventSourceUrl: string,
  eventId?: string
): Promise<boolean> {
  return sendFacebookConversionEvent({
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: eventSourceUrl,
    action_source: "website",
    user_data: userData,
    custom_data: {
      value: value,
      currency: currency,
      content_name: "Wellness Webinar Registration",
      content_category: "Webinar",
    },
    event_id: eventId || generateEventId(),
  });
}

export async function trackServerInitiateCheckout(
  userData: UserData,
  value: number,
  currency: string = "INR",
  eventSourceUrl: string,
  eventId?: string
): Promise<boolean> {
  return sendFacebookConversionEvent({
    event_name: "InitiateCheckout",
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: eventSourceUrl,
    action_source: "website",
    user_data: userData,
    custom_data: {
      value: value,
      currency: currency,
      content_name: "Wellness Webinar Registration",
      content_category: "Webinar",
    },
    event_id: eventId || generateEventId(),
  });
}
