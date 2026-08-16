# AdFex — Influencer Signup Funnel

Ad-landing page → 2-step signup form → Resend email with every submission.
Built with Next.js 14 (App Router) + Tailwind. No database — leads land
straight in your inbox.

## Flow

1. `/` — agency landing page (stats, "Get started")
2. `/apply` — step 1: full name, gender, WhatsApp, email
3. `/apply` — step 2: Instagram handle, follower range, niche (+ "Other")
4. On submit → `/api/submit-influencer` emails you the full submission,
   then the visitor sees a thank-you screen.

## 1. Set up Resend

1. Create a free account at resend.com and grab an API key.
2. (Recommended) Verify your own sending domain in Resend so `FROM_EMAIL`
   can be `hello@yourdomain.com` instead of the shared test address.
3. Copy `.env.example` to `.env.local` and fill in `RESEND_API_KEY` and
   `TO_EMAIL` (the inbox you want leads sent to).

## 2. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 3. Push from Termux

```bash
git init
git add .
git commit -m "AdFex influencer signup"
git branch -M main
git remote add origin https://github.com/<your-username>/adfex.git
git push -u origin main
```

## 4. Deploy on Vercel

1. Import the GitHub repo at vercel.com/new.
2. Framework preset: Next.js (auto-detected).
3. Add environment variables in Vercel project settings:
   - `RESEND_API_KEY`
   - `TO_EMAIL`
   - `FROM_EMAIL` (optional, only if you verified a domain)
4. Deploy. Every push to `main` redeploys automatically.

## Editing niches / follower ranges

All the dropdown/chip options live in one place: `lib/constants.ts`.
Edit the arrays there and both form steps update automatically.

## Notes

- Form validation runs both client-side (instant feedback) and
  server-side in the API route (never trust the client).
- The "Other" niche chip reveals a free-text field that's required only
  when selected.
- No analytics/pixel wired in yet — if you want Meta Pixel tracking on
  form completion (like your other funnels), drop the pixel snippet in
  `app/layout.tsx` and fire a `Lead` event in `handleSubmit` in
  `app/apply/page.tsx` right after a successful response.
