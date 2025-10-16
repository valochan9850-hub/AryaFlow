"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

function FacebookPixelInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

  useEffect(() => {
    if (!pixelId) {
      console.warn("Facebook Pixel ID not found. Please add NEXT_PUBLIC_FB_PIXEL_ID to your environment variables.");
      return;
    }

    // Initialize Facebook Pixel
    if (!window.fbq) {
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js"
      );

      window.fbq("init", pixelId);
      window.fbq("track", "PageView");
    }
  }, [pixelId]);

  // Track page views on route change
  useEffect(() => {
    if (window.fbq && pixelId) {
      window.fbq("track", "PageView");
    }
  }, [pathname, searchParams, pixelId]);

  if (!pixelId) {
    return null;
  }

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}

export default function FacebookPixel() {
  return (
    <Suspense fallback={null}>
      <FacebookPixelInner />
    </Suspense>
  );
}

// Helper function to track custom events
export const trackEvent = (eventName: string, data?: object) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, data);
  }
};

// Helper function to track standard events
export const trackAddToCart = (data?: object) => {
  trackEvent("AddToCart", data);
};

export const trackInitiateCheckout = (data?: object) => {
  trackEvent("InitiateCheckout", data);
};

export const trackPurchase = (value: number, currency: string = "INR") => {
  trackEvent("Purchase", { value, currency });
};

export const trackLead = (data?: object) => {
  trackEvent("Lead", data);
};

export const trackCompleteRegistration = (data?: object) => {
  trackEvent("CompleteRegistration", data);
};
