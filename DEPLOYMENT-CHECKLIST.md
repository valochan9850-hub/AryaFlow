# 🚀 Facebook Pixel + CAPI Deployment Checklist

## ✅ Local Setup Complete

Your local development environment is fully configured:
- ✅ Facebook Pixel ID: `852943724085168`
- ✅ CAPI Access Token: Configured
- ✅ All tracking code implemented
- ✅ Event deduplication enabled

## 📦 Before You Deploy to Production

### Step 1: Add Environment Variables to Netlify

Go to your Netlify dashboard and add these environment variables:

#### Navigate to Settings
1. Go to https://app.netlify.com
2. Select your site
3. Go to **Site settings** → **Environment variables**

#### Add Variables
Click "Add a variable" and add these **two** variables:

**Variable 1:**
```
Key: NEXT_PUBLIC_FB_PIXEL_ID
Value: 852943724085168
```

**Variable 2:**
```
Key: FB_CONVERSION_API_ACCESS_TOKEN
Value: EAALPkt7SAwsBPt6G5hmo9sBtJJUXY6bbhrLoFBneG5zYZCTlZClMOR7iGzODeXxF7JLL5Q55LycHr8LZCg03n6oPeThj7ZBX6ADMfgIbrJJZC1nbOZCWeXzFykJgCXLuwuvvki8MP5XgZCN9yU3Nkf2wiZC10t530lZCq0WX3jZBLOIC9VlKi9ONXelYJx9LSW2QZDZD
```

### Step 2: Deploy Your Changes

#### Option A: Git Push (Recommended)
```bash
git add .
git commit -m "Add Facebook Pixel and Conversion API tracking"
git push origin main
```
Netlify will automatically deploy.

#### Option B: Manual Deploy
Trigger a deploy from Netlify dashboard.

### Step 3: Verify Deployment

After deployment completes:

1. Visit your live site
2. Open browser DevTools (F12)
3. Go to Console tab
4. Look for: `Facebook Pixel initialized with ID: 852943724085168`

## 🧪 Testing Your Implementation

### Test 1: Facebook Events Manager

1. **Open Test Events**
   - Go to: https://business.facebook.com/events_manager
   - Select Pixel: 852943724085168
   - Click **Test Events** tab

2. **Test PageView**
   - Visit your website
   - You should see: ✅ PageView event appear

3. **Test Checkout Flow**
   - Click on a payment button
   - You should see: ✅ InitiateCheckout event
   - You should see: ✅ Lead event

4. **Test Purchase (Most Important!)**
   - Complete a test payment
   - You should see TWO Purchase events:
     - 🌐 Purchase (Browser) - from Pixel
     - 🖥️ Purchase (Server) - from CAPI
   - Look for **"Deduplicated"** label = Success! ✅

### Test 2: Browser Console

Open your site with DevTools (F12):

```javascript
// Check if Pixel is loaded
console.log(window.fbq);  // Should not be undefined

// Check Pixel ID
fbq('getState');  // Should show pixel ID 852943724085168
```

### Test 3: Network Tab

1. Open DevTools → Network tab
2. Filter by "facebook"
3. Perform actions on your site
4. You should see requests to:
   - `facebook.com/tr?id=852943724085168&ev=PageView`
   - `facebook.com/tr?id=852943724085168&ev=InitiateCheckout`
   - etc.

## 🔍 Event Quality Check

After a few real purchases (within 24-48 hours):

1. Go to Events Manager → Data Sources → Your Pixel
2. Check **Event Match Quality** score
3. Aim for 8.0+ (CAPI should significantly improve this!)

Look for:
- ✅ High event match quality (8.0+)
- ✅ Low event deduplication percentage (<5%)
- ✅ Server events showing up alongside browser events

## 🚨 Troubleshooting

### Pixel Not Loading?
- Check: `NEXT_PUBLIC_FB_PIXEL_ID` is set in Netlify
- Check: No ad blockers on test browser
- Check: Browser console for errors

### CAPI Events Not Showing?
- Check: `FB_CONVERSION_API_ACCESS_TOKEN` is set in Netlify (no `NEXT_PUBLIC_` prefix!)
- Check: Netlify function logs for errors
- Check: Token hasn't expired (regenerate if needed)

### Events Not Deduplicating?
- Check: Both events have the same Event ID
- Check: Events sent within 48 hours of each other
- Wait: Deduplication can take a few minutes

### Server Logs (Netlify)
To check CAPI errors:
1. Netlify Dashboard → Functions
2. Look for function logs
3. Search for "Facebook Conversion API" messages

## 📊 What Success Looks Like

After deployment and testing, you should see:

**In Events Manager (Test Events tab):**
```
✅ PageView          (Browser)
✅ InitiateCheckout  (Browser)
✅ Lead              (Browser)
✅ Purchase          (Browser) ─┐
✅ Purchase          (Server)  ─┴─ Deduplicated ✓
```

**In Production (after real purchases):**
- Event Match Quality: 8.0+ (improved from CAPI)
- Purchase events showing both sources (Browser + Server)
- Lower "estimated event loss" percentage

## 🎯 Expected Improvements

With CAPI enabled, you should see:

| Metric | Before | After |
|--------|--------|-------|
| Event Match Quality | 5-7 | 8-10 |
| Tracking Accuracy | 70-80% | 90-95% |
| iOS 14+ Tracking | Limited | Improved |
| Ad Blocker Impact | High | Low |

## 📞 Need Help?

- Facebook issue? Check [Events Manager](https://business.facebook.com/events_manager)
- Implementation details? See [docs/facebook-tracking-setup.md](./docs/facebook-tracking-setup.md)
- CAPI setup? See [GET-CAPI-TOKEN.md](./GET-CAPI-TOKEN.md)

## ✅ Final Checklist

Before considering this complete:

- [ ] Environment variables added to Netlify
- [ ] Site deployed successfully
- [ ] Test Events showing PageView
- [ ] Test purchase shows BOTH browser + server Purchase events
- [ ] Events are marked as "Deduplicated"
- [ ] No errors in browser console
- [ ] No errors in Netlify function logs

Once all checked ✅, you're done! 🎉
