# Launch Readiness Checklist — DunningPulse (IDEA-01)

## 1. Readiness Audit

- [x] **Core user journey tested**:
  - Webhook ingestion verified with cryptographic signature checks (`invoice.payment_failed` and `invoice.payment_succeeded`).
  - 1-click tokenized payment update link generated via Stripe Billing Portal (`flow_data: { type: 'payment_method_update' }`).
  - In-app banner widget (< 3KB) verified in browser test harness.
  - Test Suite: 100% passing (`tests/run-all.js`).
- [x] **Security & Zero-PCI Compliance**:
  - Zero raw card handling (SAQ-A compliant; hosted entirely on Stripe).
  - Stripe Restricted API Keys and Webhook secrets encrypted at rest using AES-256-GCM.
  - Webhook replay attack protection with 300-second timestamp tolerance window.
- [x] **Error monitoring & logging**:
  - Structured event audit logging in `recovery_events` table.
  - Idempotent event processing prevents duplicate dunning alerts.
- [x] **Pricing and payment model**:
  - Target: Flat $19/month (Starter) and $39/month (Growth).
  - Zero percentage revenue take-rate.
- [x] **Landing page and interactive calculator**:
  - Completed in `src/app/page.tsx` with dynamic Churn Loss Calculator.
  - Live Dashboard and Sandbox Simulator in `src/app/dashboard/page.tsx`.
- [x] **Deployment and Rollback procedure**:
  - Single-click deployment to Vercel connected to Git repository.
  - Zero-downtime rollback supported via Vercel deployment history and tagged releases (`v0.1.0-alpha`).
- [ ] **Publication & Spending Approval**:
  - **PENDING USER APPROVAL AT GATE_3** (No public DNS pointing, paid domain registration, or live production Stripe account connection will take place without explicit permission).

---

## 2. Deployment Instructions (Vercel + Neon / Supabase)

### Step 1: Environment Variables Setup
Populate the following in Vercel Project Settings:
```env
NEXT_PUBLIC_APP_URL="https://dunningpulse.com"
ENCRYPTION_MASTER_KEY="<32-byte-hex-key>"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
RESEND_API_KEY="re_..."
DEFAULT_FROM_EMAIL="DunningPulse <billing@dunningpulse.com>"
```

### Step 2: Deploy to Vercel
```bash
npx vercel --prod
```

### Step 3: Register Stripe Webhook
In your Stripe Dashboard:
- Add Endpoint: `https://dunningpulse.com/api/webhooks/stripe?projectId=dp_live_xxxx`
- Select Events to Listen:
  - `invoice.payment_failed`
  - `invoice.payment_succeeded`
  - `invoice.paid`
  - `customer.subscription.deleted`

---

## 3. Operational Costs Summary

| Component | Provider / Tier | Monthly Cost (MVP) |
| :--- | :--- | :---: |
| **Hosting & API** | Vercel (Hobby Tier) | $0.00 |
| **Database** | Neon / Supabase Serverless Postgres (Free Tier) | $0.00 |
| **Email Delivery** | Resend (Free Tier - 3,000 emails/mo) | $0.00 |
| **CDN & DNS** | Cloudflare Free Tier | $0.00 |
| **Domain Registration** | Porkbun / Namecheap (Annual) | ~$10.00–$14.00 (One-time) |
| **Total Monthly Burn Rate** | | **$0.00 / month** |
| **Total Initial Spend Cap** | | **< $20.00 (Cap: $50.00)** |

---

## 4. GATE_3 Launch Authorization Request
Before proceeding to `LAUNCH IDEA-01`:
- Exact release destination: Vercel Production + Custom Domain.
- Exact publication scope: Landing page, live webhook listener, in-app banner CDN, founder dashboard.
- Any direct spending: Up to $14 for domain registration (if authorized).
- Status: **PAUSED AT GATE_3 FOR HUMAN APPROVAL**.

