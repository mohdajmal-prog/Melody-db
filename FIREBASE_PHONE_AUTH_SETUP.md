# Firebase Phone Authentication Setup Guide

## Steps to Enable Real-time OTP for All Phone Numbers

### 1. Enable Phone Authentication in Firebase Console
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: `melodyf-51d21`
3. Navigate to: **Authentication** → **Sign-in method**
4. Click on **Phone** provider
5. Click **Enable** toggle
6. Click **Save**

### 2. Add Your Domain to Authorized Domains
1. In the same **Sign-in method** tab
2. Scroll down to **Authorized domains**
3. Add your domains:
   - `localhost` (for development)
   - Your production domain (e.g., `yourdomain.com`)
4. Click **Add domain**

### 3. Configure App Verification (Important for Production)
Firebase requires reCAPTCHA verification for phone authentication.

#### Option A: Use reCAPTCHA (Recommended for Production)
1. Go to Google Cloud Console: https://console.cloud.google.com
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Create reCAPTCHA v2 credentials
5. Add your domain to authorized domains
6. Copy the Site Key
7. Add to `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY=your_site_key_here
   ```

#### Option B: Disable App Verification (Development Only)
⚠️ **WARNING: Only for development/testing**

1. Go to Firebase Console → **Authentication** → **Settings**
2. Scroll to **App verification**
3. Add test phone numbers with test codes
4. Or disable app verification (not recommended)

### 4. Enable Firebase Authentication API
1. Go to Google Cloud Console
2. Navigate to **APIs & Services** → **Library**
3. Search for "Identity Toolkit API"
4. Click **Enable**

### 5. Check API Key Restrictions
1. Go to Google Cloud Console → **APIs & Services** → **Credentials**
2. Find your API key (starts with `AIzaSy...`)
3. Click **Edit**
4. Under **API restrictions**, ensure these are enabled:
   - Identity Toolkit API
   - Token Service API
5. Under **Application restrictions**:
   - For development: Select **None**
   - For production: Add your domain to **HTTP referrers**

### 6. Restart Your Development Server
```bash
npm run dev
```

## Testing Phone Authentication

### Test with Real Phone Numbers
1. Enter a real phone number (with country code +91)
2. Complete the reCAPTCHA challenge
3. Receive OTP via SMS
4. Enter OTP to verify

### Common Issues

#### "Invalid API Key" Error
- Check if API key is correct in `.env.local`
- Verify API key restrictions in Google Cloud Console
- Ensure Identity Toolkit API is enabled

#### "Too Many Requests" Error
- Firebase has rate limits for phone authentication
- Wait a few minutes before trying again
- Consider implementing rate limiting on your end

#### "reCAPTCHA Error"
- Ensure domain is added to authorized domains
- Check if reCAPTCHA is properly configured
- Try using visible reCAPTCHA instead of invisible

## Production Checklist
- [ ] Enable Phone authentication in Firebase
- [ ] Add production domain to authorized domains
- [ ] Configure reCAPTCHA with production domain
- [ ] Set up API key restrictions
- [ ] Enable Identity Toolkit API
- [ ] Test with real phone numbers
- [ ] Implement rate limiting
- [ ] Add error handling and user feedback
