# Netlify Deployment Guide

## Current Status
✅ Code has been pushed to GitHub
✅ Build configuration updated to handle missing environment variables
⏳ Waiting for Razorpay API keys to be added to Netlify

## Add Environment Variables to Netlify

Your build should now succeed, but the payment functionality won't work until you add the Razorpay API keys.

### Step-by-Step Instructions:

1. **Login to Netlify:**
   - Go to https://app.netlify.com/
   - Login with your account

2. **Select Your Site:**
   - Find and click on your "AryaFlow" site

3. **Navigate to Environment Variables:**
   - Click on **"Site settings"** (in the top navigation)
   - In the left sidebar, click **"Environment variables"** (under "Build & deploy")
   - OR go directly to: Site settings → Build & deploy → Environment variables

4. **Add the First Variable:**
   - Click the **"Add a variable"** or **"Add environment variable"** button
   - **Key:** `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - **Value:** Your Razorpay Key ID (e.g., `rzp_test_xxxxxxxxxxxxx`)
   - **Scopes:** Select all scopes (Production, Deploy previews, Branch deploys)
   - Click **"Create variable"** or **"Save"**

5. **Add the Second Variable:**
   - Click **"Add a variable"** again
   - **Key:** `RAZORPAY_KEY_SECRET`
   - **Value:** Your Razorpay Key Secret
   - **Scopes:** Select all scopes
   - Click **"Create variable"** or **"Save"**

6. **Trigger a Redeploy:**
   - Go to **"Deploys"** tab (top navigation)
   - Click **"Trigger deploy"** → **"Clear cache and deploy site"**
   - Wait for the build to complete

## Getting Your Razorpay API Keys

If you haven't already:

1. Go to https://dashboard.razorpay.com/
2. Sign up or login to your account
3. Navigate to **Settings** → **API Keys**
4. Click **"Generate Test Keys"** (for testing)
5. Copy both:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret**

## Verification

After adding the environment variables and redeploying:

1. Visit your live site
2. Click any payment button (e.g., "Reserve My Spot - ₹99")
3. Fill in the registration form
4. Click "Pay ₹99"
5. You should see the Razorpay checkout modal open

## Test Payment

Use these test card details:
- **Card Number:** `4111 1111 1111 1111`
- **CVV:** Any 3 digits (e.g., `123`)
- **Expiry:** Any future date (e.g., `12/25`)
- **Cardholder Name:** Any name

## Important Notes

- **Test Mode:** Always use test keys (`rzp_test_`) for development
- **Live Mode:** Only use live keys (`rzp_live_`) when you're ready to accept real payments
- **Security:** These keys are stored securely by Netlify and not exposed in your code
- **KYC:** Complete KYC verification on Razorpay before going live

## Troubleshooting

### Build Still Failing?
- Check that the environment variable names are exactly as shown (case-sensitive)
- Make sure you triggered a new deploy after adding variables
- Check the build logs for specific error messages

### Payment Not Working?
- Verify both environment variables are set correctly
- Check browser console for errors
- Ensure you're using test keys in test mode
- Try clearing cache and hard refresh (Ctrl+Shift+R)

### Environment Variable Not Found?
- Go back to Site settings → Environment variables
- Verify both variables are listed
- Check the scopes include "Production"
- Redeploy the site

## Next Steps

After successful deployment:
1. Test the complete payment flow
2. Consider adding database integration to save registrations
3. Set up email notifications for successful payments
4. Add analytics to track conversions
5. Complete Razorpay KYC for going live

---

**Questions?** Check the [RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md) for more details.
