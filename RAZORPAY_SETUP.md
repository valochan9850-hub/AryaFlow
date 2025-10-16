# Razorpay Payment Gateway Integration Guide

## Overview
This guide explains how to set up and configure Razorpay payment gateway for the AryaFlow landing page.

## Prerequisites
- A Razorpay account (create one at https://razorpay.com/)
- Node.js and npm installed
- Next.js application running

## Setup Instructions

### 1. Get Your Razorpay API Keys

1. Log in to your Razorpay Dashboard: https://dashboard.razorpay.com/
2. Navigate to **Settings** → **API Keys**
3. Click on **Generate Key** (or use existing keys)
4. You'll receive:
   - **Key ID** (starts with `rzp_test_` for test mode or `rzp_live_` for live mode)
   - **Key Secret** (keep this secret and never expose it publicly)

### 2. Configure Environment Variables

1. Open the `.env.local` file in the root directory
2. Replace the placeholder values with your actual Razorpay keys:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
```

**Important:**
- Use **Test Mode** keys for development/testing
- Use **Live Mode** keys only for production
- Never commit `.env.local` to version control (it's already in `.gitignore`)

### 3. Test the Payment Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3001 in your browser

3. Click any "Join Webinar" or "Reserve My Spot" button

4. Fill in the registration form:
   - Full Name
   - Email
   - Phone Number (10 digits)

5. Click "Pay ₹99" to open Razorpay checkout

6. Use Razorpay test cards for testing:
   - **Success:** Card Number: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date
   - More test cards: https://razorpay.com/docs/payments/payments/test-card-upi-details/

### 4. Verify Payment

After successful payment:
- You'll see a success message
- Check your browser console for payment details
- Check your Razorpay Dashboard → Payments for the transaction

## File Structure

```
aryaflow-landing/
├── .env.local                                    # Environment variables
├── app/
│   └── api/
│       └── razorpay/
│           ├── create-order/
│           │   └── route.ts                      # Order creation API
│           └── verify-payment/
│               └── route.ts                      # Payment verification API
├── components/
│   └── RazorpayPayment.tsx                       # Payment component
└── app/page.tsx                                  # Main landing page (integrated)
```

## Features Implemented

✅ **Razorpay Integration**
- Order creation via API
- Payment verification with signature validation
- Secure server-side handling

✅ **User Registration Form**
- Name, Email, Phone validation
- Form validation before payment
- User-friendly error messages

✅ **Payment Flow**
- Modal-based registration form
- Razorpay checkout integration
- Success/failure handling
- Loading states

✅ **Security**
- Server-side signature verification
- Environment variable protection
- HTTPS required for production

## Next Steps (Optional Enhancements)

### 1. Database Integration
Add database logic in `app/api/razorpay/verify-payment/route.ts` to save registration data:

```typescript
// Example: Save to database after verification
if (isAuthentic) {
  await db.registrations.create({
    data: {
      name: userDetails.name,
      email: userDetails.email,
      phone: userDetails.phone,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: 99,
      status: 'paid',
    }
  });
}
```

### 2. Email Notifications
Send confirmation emails using services like:
- Resend
- SendGrid
- AWS SES

### 3. Webinar Access
- Generate unique access links
- Send webinar details via email
- Create a dashboard for registered users

### 4. Analytics
- Track conversion rates
- Monitor failed payments
- Add Google Analytics events

## Troubleshooting

### Payment Not Working
1. Check if Razorpay keys are correctly set in `.env.local`
2. Ensure you're using test keys in development
3. Check browser console for errors
4. Verify internet connection

### Signature Verification Failed
1. Ensure `RAZORPAY_KEY_SECRET` matches the one from dashboard
2. Check that the order ID and payment ID are correct
3. Don't modify the verification logic

### Form Validation Errors
- Name: Must not be empty
- Email: Must be a valid email format
- Phone: Must be 10 digits starting with 6-9

## Going Live

When ready for production:

1. Get your **Live Mode** API keys from Razorpay
2. Update `.env.local` (or `.env.production` on Vercel):
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
   RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
   ```
3. Complete KYC verification on Razorpay
4. Test with a small real transaction
5. Monitor the Razorpay dashboard regularly

## Support

- **Razorpay Docs:** https://razorpay.com/docs/
- **Razorpay Support:** https://razorpay.com/support/
- **Test Cards:** https://razorpay.com/docs/payments/payments/test-card-upi-details/

## Security Notes

⚠️ **Important:**
- Never expose `RAZORPAY_KEY_SECRET` in client-side code
- Always verify payment signature on the server
- Use HTTPS in production
- Keep your API keys secure
- Regularly rotate your API keys
- Monitor for suspicious transactions

---

**Integration Complete!** 🎉

Your Razorpay payment gateway is now integrated and ready to accept payments for the AryaFlow wellness webinar.
