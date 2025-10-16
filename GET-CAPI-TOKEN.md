# Get Your Facebook Conversion API Access Token

Your Pixel ID is already configured: **852943724085168**

Now you need to generate the Conversion API Access Token to enable server-side tracking.

## Step-by-Step Instructions

### 1. Go to Events Manager
Visit: https://business.facebook.com/events_manager

### 2. Select Your Pixel
- Look for Pixel ID: **852943724085168**
- Click on it to open settings

### 3. Navigate to Conversions API Settings
- In the left sidebar, click **Settings**
- Click on **Conversions API** tab

### 4. Generate Access Token
- Scroll down to the "Set up manually" section
- Click **Generate Access Token**
- Copy the token (starts with `EAA...` or similar)

### 5. Update Environment Variables

#### Local Development (.env.local)
Replace `your_capi_access_token_here` with your actual token:
```bash
FB_CONVERSION_API_ACCESS_TOKEN=EAAxxxxxxxxxxxxx
```

#### Production (Netlify)
1. Go to your Netlify dashboard
2. Navigate to: **Site Settings** → **Environment Variables**
3. Add a new variable:
   - **Key**: `FB_CONVERSION_API_ACCESS_TOKEN`
   - **Value**: Your access token (paste the token)
4. Also add (if not already there):
   - **Key**: `NEXT_PUBLIC_FB_PIXEL_ID`
   - **Value**: `852943724085168`
5. **Redeploy** your site for changes to take effect

### 6. Verify Setup

After deploying, test your implementation:

1. Go to **Events Manager** → **Test Events** tab
2. Visit your website and complete a test purchase
3. Check that you see:
   - ✅ PageView events (from Pixel)
   - ✅ InitiateCheckout (from Pixel)
   - ✅ Lead (from Pixel)
   - ✅ Purchase from **browser** (Pixel)
   - ✅ Purchase from **server** (CAPI)
   - 🔄 "Deduplicated" label on the two Purchase events

## What You Get with CAPI

✅ **More Reliable Tracking**: Works even with ad blockers
✅ **Better iOS 14+ Tracking**: Bypasses browser tracking limitations
✅ **Higher Data Quality**: Direct server-to-Facebook communication
✅ **Better Ad Performance**: More accurate attribution = better ROAS
✅ **Future-Proof**: Less affected by browser privacy changes

## Troubleshooting

### Can't Find Conversions API Settings?
- Make sure you have admin access to the Facebook Business account
- Some older Pixels may need to be upgraded first

### Access Token Expired?
- Tokens can expire, simply regenerate a new one
- Update both `.env.local` and Netlify with the new token

### Events Not Showing Up?
1. Check browser console for Pixel errors
2. Check server logs (Netlify Functions logs) for CAPI errors
3. Verify token is correct and not expired
4. Make sure you redeployed after adding environment variables

## Need Help?

- [Facebook Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Events Manager](https://business.facebook.com/events_manager)
- [Troubleshooting Guide](./docs/facebook-tracking-setup.md)
