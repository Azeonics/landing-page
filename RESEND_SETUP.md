# Email Setup Issue - RESEND_API_KEY Not Configured on Vercel

## Current Problem
✗ Contact form **does NOT** send emails in production (https://www.azeonics.com)
✓ Contact form **would** send emails locally (if you ran `npm run dev`)

## Root Cause
- `.env.local` is **not deployed** to Vercel
- `RESEND_API_KEY` environment variable is missing from Vercel project settings
- The form submission works (no JS errors), but the API call fails silently because the key isn't available

## Fix (Choose ONE method)

### Method A: Via Vercel Dashboard (Recommended for UI lovers)
1. Go to **vercel.com** → Project **azeonics-landing**
2. Click **Settings** → **Environment Variables**
3. Click **Add** and enter:
   - **Name:** `RESEND_API_KEY`
   - **Value:** `re_RLmXbT9B_J44xRApEXjtcunRroWgveYcppush` (from `.env.local`)
   - **Environments:** Select `Production` and `Preview`
4. Click **Save**
5. Click **Deployments** and redeploy (or trigger a new deploy)

### Method B: Via Vercel CLI (Faster)
```bash
# In project root
vercel env add RESEND_API_KEY

# When prompted:
# ✓ Enter value: re_RLmXbT9B_J44xRApEXjtcunRroWgveYcppush
# ✓ Select environment: Choose "Production" and "Preview"
```

Then redeploy:
```bash
vercel redeploy
```

### Method C: Via `vercel.json` (For Teams)
Create/update `.vercel/vercel.json` (if it exists) or add to a config file:
```json
{
  "env": {
    "RESEND_API_KEY": "@resend-api-key"
  }
}
```
Then set the secret via CLI:
```bash
vercel secrets add resend-api-key re_RLmXbT9B_J44xRApEXjtcunRroWgveYcppush
```

---

## Step-by-Step Test

### After Setting Environment Variable:

1. **Deploy** the latest code
2. **Go to** https://www.azeonics.com/contact
3. **Fill the form:**
   - Name: Test User
   - Email: your-test@email.com
   - Interest: Manufacturing as a Service
   - Message: Test message
4. **Click** "Send enquiry"
5. **Expected result:**
   - ✓ Alert: "Thanks — we will be in touch within one working day."
   - ✓ Email received at `bnraao@azeonics.com`
   - ✓ Confirmation email sent to `your-test@email.com`

---

## Also Fixed

### 1. Image Slots 404 Error
- **Issue:** Browser console showed 404 for `.image-slots.state.json`
- **Fix:** Created `/public/.image-slots.state.json` (empty state file)
- **Result:** No more 404 errors

---

## Production Email Flow (Once Fixed)

```
User fills form on https://www.azeonics.com/contact
         ↓
POST /api/contact (with sanitized data + security checks)
         ↓
RESEND_API_KEY validates with Resend API
         ↓
Email #1 → Team (bnraao@azeonics.com) with full inquiry details
Email #2 → User with confirmation message
         ↓
Form resets, success message shown
```

---

## Sensitive Information Note
⚠️ **RESEND_API_KEY** is confidential. Don't commit it to Git.
- It's in `.env.local` (which is in `.gitignore`)  ✓ Safe
- Set via Vercel UI / CLI  ✓ Safe
- Uses HTTPS for all transmissions  ✓ Safe

---

## Contact Form Security (Already Implemented)
20+ security checkpoints prevent spam/abuse:
- Rate limiting (IP & email-based)
- Injection attack detection
- Disposable email blocking
- Duplicate submission detection
- XSS/spam detection
- User-Agent verification
- Domain validation

All inbound and outbound emails are logged and sanitized.
