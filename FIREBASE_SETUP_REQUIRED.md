# Firebase Phone Authentication Setup - REQUIRED STEPS

## The error `auth/invalid-app-credential` means Phone Authentication is NOT enabled in Firebase.

### Follow these steps EXACTLY:

## Step 1: Enable Phone Authentication
1. Go to: https://console.firebase.google.com
2. Select project: **melodyf-51d21**
3. Click **Authentication** (left sidebar)
4. Click **Sign-in method** tab
5. Find **Phone** in the list
6. Click **Phone**
7. Toggle **Enable** switch to ON
8. Click **Save**

## Step 2: Enable Identity Toolkit API
1. Go to: https://console.cloud.google.com
2. Select project: **melodyf-51d21**
3. Click **APIs & Services** → **Library**
4. Search: **Identity Toolkit API**
5. Click on it
6. Click **ENABLE**

## Step 3: Configure API Key
1. In Google Cloud Console
2. Go to **APIs & Services** → **Credentials**
3. Find your API key: `AIzaSyAAbeY0PZnsad5VcGI_wMw_aKCDmv_76Ns`
4. Click **Edit** (pencil icon)
5. Under **Application restrictions**:
   - Select **HTTP referrers**
   - Add: `localhost:3000/*`
   - Add: `http://localhost:3000/*`
6. Under **API restrictions**:
   - Select **Restrict key**
   - Check: **Identity Toolkit API**
7. Click **Save**

## Step 4: Add Authorized Domain
1. Back in Firebase Console
2. **Authentication** → **Settings** tab
3. Scroll to **Authorized domains**
4. Click **Add domain**
5. Add: `localhost`
6. Click **Add**

## Step 5: Restart Your App
```bash
npm run dev
```

## Test Phone Authentication
1. Enter any real phone number
2. Complete reCAPTCHA
3. Receive SMS with OTP
4. Enter OTP to verify

## If Still Not Working:
- Wait 5-10 minutes for Google Cloud changes to propagate
- Clear browser cache
- Try incognito/private window
- Check Firebase Console → Authentication → Users (should show phone numbers after successful auth)
