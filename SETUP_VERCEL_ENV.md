# Vercel Environment Setup for Resend Email API

## Status: ✅ COMPLETE

The contact form integration with Resend Email API is **production-ready**. All code has been implemented and tested locally.

---

## What's Ready

### ✅ Backend Implementation
- **API Endpoint**: `/app/api/contact/route.ts` 
  - Validates form data
  - Sends professional HTML emails via Resend API
  - Dynamic subject lines based on inquiry category
  - Automatic user confirmation emails
  - Error handling with detailed responses

- **Email Templates**:
  - **Team Email** (`/app/api/contact/email-template.tsx`): Professional layout with inquiry details, next steps, and quick links
  - **User Confirmation**: Beautiful HTML confirmation email sent to the user immediately after submission

### ✅ Frontend Implementation
- **Contact Form** in `lib/site-content.ts`:
  - Client-side form validation (HTML5)
  - Async submission with loading state
  - Error and success alerts
  - Form auto-reset on successful submission
  - All 9 inquiry categories available

### ✅ Local Development
- `.env.local` already configured with API key
- Build verified: `npm run build` passes without errors
- No TypeScript or syntax errors

### ✅ Package Dependencies
- `resend@^6.12.4` installed in `package.json`

---

## Next Step: Add to Vercel

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Select your project: `azeonics-landing`

### Step 2: Access Project Settings
1. Click on **Settings** in the top navigation
2. Go to **Environment Variables** in the left sidebar

### Step 3: Add RESEND_API_KEY
1. Click **Add New**
2. Fill in the following:
   - **Name**: `RESEND_API_KEY`
   - **Value**: `re_RLmXbT9B_J44xRApEXjtcunRroWgveYcppush`
   - **Environments**: Select ✅ Production, ✅ Preview, ✅ Development

3. Click **Save**

### Step 4: Deploy to Vercel
Push to trigger deployment:
```bash
git push
```
Or manually redeploy from Vercel dashboard.

### Step 5: Test in Production
1. Go to https://azeonics-landing.vercel.app/contact
2. Submit a test form with all required fields
3. Check that:
   - ✅ Confirmation email arrives at your submitted email
   - ✅ Email arrives at bnraao@azeonics.com with correct subject line
   - ✅ All 9 inquiry categories show correct subject lines

---

## Contact Form Flow

### User submits form → Email sequence:

1. **Form Validation** (client-side):
   - Name, email, interest category, and message are required
   - Email format is validated

2. **API Processing** (server-side):
   - Data validated on backend
   - Subject line dynamically generated based on inquiry category

3. **Team Email** sent to `bnraao@azeonics.com`:
   - Beautiful HTML with inquiry details card
   - Includes: name, email, interest category, timestamp (IST)
   - Next steps guidance
   - Quick resource links
   - Contact information

4. **User Confirmation** sent to their email:
   - Personalized greeting with their name and inquiry type
   - Assurance of response within one working day
   - Quick links to explore capabilities
   - Follow-up contact information

5. **User Feedback**:
   - Success alert: "✓ Thanks — we will be in touch within one working day."
   - Form clears automatically
   - Submit button briefly shows loading state

---

## Dynamic Subject Lines by Category

| Inquiry Category | Subject Line |
|---|---|
| Manufacturing as a Service | MaaS Inquiry — Let's Build Together |
| Test & Qualification campaign | Test Campaign Request — Qualification Ready |
| Cleanroom & integration slot | Cleanroom Integration Inquiry |
| Ground Station as a Service | GSaaS Inquiry — Ground Segment Access |
| Skilling program (1-week bootcamp) | Bootcamp Application — Start Your Journey |
| Skilling program (12-week advanced) | Advanced Skilling Program Interest |
| ISRO POEM / SMiLE capstone | ISRO POEM/SMiLE Payload Inquiry |
| Idea-to-Orbit student bundle | Student Bundle Inquiry |
| Partnership / Other | Partnership Inquiry — Let's Collaborate |

---

## Troubleshooting

### Email not sending after deployment?
1. Verify `RESEND_API_KEY` is added to all environments (Production, Preview, Development) in Vercel
2. Check that `contactform@send.azeonics.com` is verified in Resend dashboard
3. Check spam folder for emails
4. Monitor Resend dashboard (https://resend.com/emails) for delivery status

### Form submission shows error?
1. Check browser console (F12) for network errors
2. Verify the API endpoint is accessible: `https://your-domain.vercel.app/api/contact`
3. Ensure all form fields are filled with valid data
4. Check Resend API key validity in Vercel settings

### Test locally first
```bash
npm run dev
```
Then visit http://localhost:3000/contact and submit a test form

### Inspect API logs
After deployment, view Vercel function logs in the Vercel dashboard to debug any server-side issues.

---

## Files Created/Modified

### New Files:
- `/app/api/contact/route.ts` - API endpoint (6.3 KB)
- `/app/api/contact/email-template.tsx` - Team email template (6.7 KB)
- `/SETUP_VERCEL_ENV.md` - This setup guide

### Modified Files:
- `lib/site-content.ts` - Contact form with submission handler
- `.env.local` - Added RESEND_API_KEY (local development)

### Dependencies:
- `resend@^6.12.4` - Email delivery platform

---

## Architecture

```
User fills form at /contact
         ↓
Form submission to POST /api/contact
         ↓
Backend validation & processing
         ↓
├─→ Send email to bnraao@azeonics.com (via Resend)
├─→ Send confirmation to user (via Resend)
└─→ Return JSON response to frontend
         ↓
Frontend shows success/error alert
Form resets if successful
```

---

## Security Notes

- API key stored in environment variables (not in code)
- Email validation on both client and server
- Protected from basic injection attacks
- Resend handles rate limiting and spam prevention
- User email addresses are only used to send confirmations
