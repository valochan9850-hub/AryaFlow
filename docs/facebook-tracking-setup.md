# Facebook Pixel & Conversion API Setup Guide

This guide explains how to set up and use Facebook Pixel with Conversion API (CAPI) for tracking events on your AryaFlow landing page.

## Overview

Your site now has **dual tracking** implemented:
- **Client-side**: Facebook Pixel (browser-based tracking)
- **Server-side**: Facebook Conversion API (server-based tracking)

This dual approach provides:
- More reliable tracking (immune to ad blockers)
- Better data quality for iOS 14+ users
- Automatic deduplication to avoid double-counting events
- Enhanced privacy compliance with hashed user data

## Setup Instructions

### 1. Get Your Facebook Pixel ID

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Select your Pixel or create a new one
3. Copy your Pixel ID (15-16 digit number)

### 2. Generate Conversion API Access Token

1. In Events Manager, select your Pixel
2. Go to **Settings** > **Conversions API**
3. Click **Generate Access Token**
4. Copy the access token (starts with "EAA...")

### 3. Configure Environment Variables

Add these to your `.env.local` (development) and Netlify environment variables (production):

```bash
# Facebook Pixel ID (client-side - public)
NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id_here

# Facebook Conversion API Access Token (server-side - secret)
FB_CONVERSION_API_ACCESS_TOKEN=your_access_token_here
```

**Important**:
- `NEXT_PUBLIC_FB_PIXEL_ID` - Can be public (used in browser)
- `FB_CONVERSION_API_ACCESS_TOKEN` - Must be kept secret (server-only)

### 4. Deploy to Netlify

In your Netlify dashboard:
1. Go to **Site Settings** > **Environment Variables**
2. Add both variables:
   - `NEXT_PUBLIC_FB_PIXEL_ID`
   - `FB_CONVERSION_API_ACCESS_TOKEN`
3. Redeploy your site

## Events Being Tracked

### Client-Side (Pixel) Events

| Event | Trigger | Data Sent |
|-------|---------|-----------|
| PageView | Every page load | Automatic |
| InitiateCheckout | User clicks "Pay" button | Value, Currency, Content |
| Lead | User submits contact form | Value, Currency, Content |
| Purchase | Payment successful (client-side) | Value, Currency, Event ID |

### Server-Side (CAPI) Events

| Event | Trigger | Data Sent |
|-------|---------|-----------|
| Purchase | Payment verified on server | Hashed PII, Order details, Event ID |

## Event Deduplication

To prevent double-counting purchases (since both client and server track the same event), we use:

1. **Event ID**: Same unique ID sent with both Pixel and CAPI events
2. **Automatic Deduplication**: Facebook automatically deduplicates events with the same Event ID

Implementation in code:
```typescript
// Generate unique event ID
const purchaseEventId = generateEventId();

// Client-side tracking (with event ID)
window.fbq('track', 'Purchase', { value, currency }, { eventID: purchaseEventId });

// Server-side tracking (with same event ID)
trackServerPurchase(..., eventId: purchaseEventId);
```

## Data Privacy & Hashing

All Personally Identifiable Information (PII) sent via CAPI is automatically hashed using SHA-256:

**Hashed Fields**:
- Email addresses
- Phone numbers
- First and last names
- City, state, country, zip code

**Not Hashed**:
- IP address
- User agent
- Facebook browser ID (fbp)
- Facebook click ID (fbc)

This ensures GDPR and privacy compliance while still enabling effective ad targeting.

## Testing Your Setup

### 1. Test Events Manager

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Select your Pixel
3. Click **Test Events** tab
4. Open your website in a new tab
5. Perform actions (view page, start checkout, complete payment)
6. Verify events appear in Test Events with:
   - ✅ Green checkmark for successful events
   - "Deduplication" label for matched Pixel + CAPI events

### 2. Check Browser Console

Enable debug mode by running in browser console:
```javascript
// Enable Facebook Pixel debug mode
fbq('track', 'PageView', {}, { debug_mode: true });
```

### 3. Test Purchase Flow

1. Complete a test purchase on your site
2. Check Events Manager for:
   - **Purchase** event from Pixel (browser icon)
   - **Purchase** event from CAPI (server icon)
   - Both should have same Event ID (deduplicated)

## Architecture

### File Structure

```
├── app/
│   ├── layout.tsx                          # FacebookPixel component included
│   └── api/
│       ├── facebook/
│       │   └── track-event/
│       │       └── route.ts                # Generic CAPI tracking endpoint
│       └── razorpay/
│           └── verify-payment/
│               └── route.ts                # Purchase tracking integrated here
├── components/
│   ├── FacebookPixel.tsx                   # Client-side Pixel component
│   └── RazorpayPayment.tsx                 # Payment with tracking
└── lib/
    └── facebook-capi.ts                    # CAPI utility functions
```

### Event Flow

```
User Action
    ↓
Client-Side Tracking (Pixel)
    ├─→ PageView
    ├─→ InitiateCheckout
    └─→ Lead
    ↓
Payment Process
    ↓
Server Verification
    ↓
Server-Side Tracking (CAPI)
    └─→ Purchase (with hashed PII)
```

## Troubleshooting

### Events not showing in Events Manager

1. **Check Pixel ID**: Verify `NEXT_PUBLIC_FB_PIXEL_ID` is correct
2. **Check Access Token**: Verify `FB_CONVERSION_API_ACCESS_TOKEN` is valid
3. **Check Browser Console**: Look for Facebook Pixel initialization errors
4. **Check Server Logs**: Look for CAPI errors in deployment logs

### Duplicate Purchase Events

If you see duplicate purchases without deduplication:
1. Verify both events use the same `eventID`
2. Check that events are sent within 48 hours of each other
3. Ensure Pixel and CAPI use same Pixel ID

### CAPI Events Failing

Common issues:
- **Invalid Access Token**: Regenerate in Events Manager
- **Expired Token**: Tokens may expire, regenerate if needed
- **Rate Limiting**: Too many events too quickly
- **Invalid User Data**: Check data format (phone numbers, emails)

Check server logs for specific error messages.

## API Reference

### Facebook CAPI Utility Functions

```typescript
// lib/facebook-capi.ts

// Track a purchase
await trackServerPurchase(
  userData: {
    email: string,
    phone: string,
    firstName: string,
    lastName: string,
    country: string,
    clientIpAddress: string,
    clientUserAgent: string,
    fbp?: string,
    fbc?: string,
  },
  orderValue: number,
  currency: string,
  orderId: string,
  eventSourceUrl: string,
  eventId?: string
);

// Track a lead
await trackServerLead(
  userData: UserData,
  value: number,
  currency: string,
  eventSourceUrl: string,
  eventId?: string
);

// Generate event ID for deduplication
const eventId = generateEventId();
```

## Best Practices

1. **Always Use Event IDs**: Prevents double-counting between Pixel and CAPI
2. **Send Rich User Data**: More data = better ad targeting and attribution
3. **Hash PII on Server**: Never send unhashed PII (the library does this automatically)
4. **Monitor Event Quality**: Check Events Manager regularly for event quality scores
5. **Test Thoroughly**: Use Test Events feature before going live

## Resources

- [Facebook Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Facebook Pixel Documentation](https://developers.facebook.com/docs/facebook-pixel)
- [Event Deduplication Guide](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events)
- [Facebook Events Manager](https://business.facebook.com/events_manager)

## Support

For issues or questions:
1. Check Facebook Events Manager for event quality scores
2. Review server logs for CAPI errors
3. Test with Facebook's Test Events feature
4. Consult Facebook's developer documentation
