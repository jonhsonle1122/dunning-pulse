# MVP Plan & PRD — DunningPulse (IDEA-01)

## 1. PRD / Core User Story & Acceptance Criteria

### Problem Statement
When a SaaS customer's payment fails in Stripe, the customer often churns unintentionally because default dunning emails lack urgency, go to spam, or lack an in-app visual trigger.

### Target Personas
- **Alex (Bootstrapped Micro-SaaS Founder)**: Runs a $6k MRR B2B web app on Stripe. Loses ~$300/mo to expired cards. Cannot justify paying Churnkey $250/mo. Wants a set-and-forget tool.

### Core User Stories & Acceptance Criteria

#### Story 1: Fast Onboarding & Stripe Webhook Ingestion
- **As a founder**, I want to connect my Stripe account in under 5 minutes by adding a webhook URL and a Restricted API Key.
- **Acceptance Criteria**:
  - System verifies the Stripe Restricted Key has required permissions (`read_billing_portal_sessions`, `read_invoices`, `read_customers`).
  - Webhook listener safely signs and processes incoming Stripe webhook events (`invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`).
  - Idempotency check prevents duplicate email alerts for repeated webhook delivery retries.

#### Story 2: Automated Dunning Email Sequences
- **As a founder**, I want automated recovery emails sent from my custom domain whenever a payment fails.
- **Acceptance Criteria**:
  - Generates a dynamic 1-click Stripe Billing Portal payment update link using `stripe.billingPortal.sessions.create` with `flow_data: { type: 'payment_method_update' }`.
  - Sends immediate email on failure via Resend API, followed by gentle follow-up reminders at Day 3 and Day 5 if unpaid.
  - Automatically cancels remaining email sequence immediately when `invoice.payment_succeeded` is received.

#### Story 3: Embeddable In-App Past-Due Banner
- **As a founder**, I want an embeddable 1-line script to show an in-app alert banner to past-due users who are logged into my app.
- **Acceptance Criteria**:
  - 1-line snippet: `<script src="https://cdn.dunningpulse.com/banner.js" data-project-id="dp_xxx" data-customer-id="{{stripe_customer_id}}"></script>`.
  - When the customer is in past-due status, an un-intrusive floating top banner appears: *"Your last payment failed. [Update Payment Method] to keep your account active."*
  - Clicking the button opens the Stripe Customer Portal directly in a modal/tab.
  - Banner vanishes immediately once payment is resolved.

#### Story 4: Recovery Dashboard
- **As a founder**, I want to see real-time recovery metrics.
- **Acceptance Criteria**:
  - Displays Total Involuntary Churn Value, Total Recovered MRR, Recovery Rate (%), and Active Past-Due Customers list.

---

## 2. In Scope vs. Out of Scope

### In Scope (MVP — 2 to 4 Weeks)
- [x] Stripe Webhook listener & event queue (handling payment failed & paid events).
- [x] Stripe Billing Portal 1-click update link generator (`flow_data: { type: 'payment_method_update' }`).
- [x] Resend integration for custom domain transactional emails (Day 0, Day 3, Day 5 schedule).
- [x] Lightweight (<4KB) vanilla JavaScript in-app banner widget.
- [x] Web dashboard for founders (Next.js, Tailwind, shadcn/ui, Supabase Auth).
- [x] Recovery metrics reporting (Recovered MRR, active recovery campaigns).

### Explicitly Out of Scope (Later Milestones)
- [ ] SMS / WhatsApp dunning notifications (high cost and complex regional phone carrier compliance like A2P 10DLC).
- [ ] Multi-payment provider support (Paddle, Lemon Squeezy, Braintree) — deferred to Post-MVP.
- [ ] Voluntary churn cancellation flows / exit surveys (focusing 100% on payment recovery painkiller first).
- [ ] Complex multi-tenant team permission roles (single founder admin per project in MVP).

---

## 3. Technology Stack & Rationale

| Layer | Technology | Rationale | Cost (MVP) |
| :--- | :--- | :--- | :---: |
| **Frontend & Dashboard** | **Next.js 15 (App Router) + Tailwind CSS + shadcn/ui** | Rapid UI development, server components for security, high-performance static pages. | $0 (Vercel Hobby Tier) |
| **Backend & API** | **Next.js Route Handlers + TypeScript** | Unified codebase, type-safe API, instant edge deployment. | $0 (Vercel) |
| **Database** | **Neon Postgres (or Supabase Postgres)** | Serverless Postgres, instant branching, connection pooling, generous free tier (0.5GB). | $0 (Free tier) |
| **ORM** | **Drizzle ORM** | Lightweight, zero-overhead SQL-like TypeScript query builder, fast cold-starts. | $0 |
| **Transactional Email** | **Resend** | Developer-first transactional email API, clean DKIM/SPF setup, 3,000 free emails/mo. | $0 (Free tier) |
| **Payments / Billing** | **Stripe Node SDK** | Direct integration for Customer Portal generation and billing. | Standard Stripe transaction fee |
| **Banner CDN** | **Cloudflare Workers / Pages** | Global edge distribution (<20ms latency) for the `<4KB` banner JavaScript script. | $0 (Cloudflare Free) |
| **Total Hosting & Infra Cost** | | | **$0 / month** |

---

## 4. Data Model & Integrations

### Database Schema (Postgres / Drizzle ORM)

```sql
-- Accounts / Founders
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  stripe_restricted_key_encrypted TEXT NOT NULL,
  stripe_webhook_secret_encrypted TEXT NOT NULL,
  sender_email TEXT,
  sender_name TEXT,
  resend_api_key_encrypted TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers being tracked for recovery
CREATE TABLE dunning_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'past_due', 'recovered', 'canceled'
  past_due_amount_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  first_failed_at TIMESTAMPTZ,
  recovered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (account_id, stripe_customer_id)
);

-- Dunning Events / Audit Log
CREATE TABLE recovery_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  dunning_customer_id UUID REFERENCES dunning_customers(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'payment_failed', 'email_sent', 'portal_viewed', 'payment_succeeded'
  stripe_invoice_id TEXT,
  payload_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- In-App Banner Settings
CREATE TABLE banner_settings (
  account_id UUID PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
  banner_text TEXT DEFAULT 'Your last subscription payment failed. Please update your payment method to keep access active.',
  button_text TEXT DEFAULT 'Update Payment Method',
  primary_color TEXT DEFAULT '#dc2626',
  enabled BOOLEAN DEFAULT TRUE
);
```

---

## 5. Security, Privacy, and Legal Checklist

- [x] **Zero PCI Scope (SAQ-A)**: DunningPulse **never** receives, handles, or stores raw card data. All card collection is executed inside Stripe's PCI-DSS Level 1 certified Billing Portal.
- [x] **API Key Encryption**: Stripe Restricted API Keys and Webhook secrets are encrypted at rest using AES-256-GCM before saving to Postgres.
- [x] **Least Privilege Principle**: Setup instructions require the founder to generate a *Restricted API Key* with read-only permissions on Invoices/Subscriptions and write permission only on `billing_portal/sessions`.
- [x] **Webhook Signature Verification**: Every incoming webhook is verified against Stripe's cryptographic signature header (`stripe-signature`) to prevent spoofing.
- [x] **GDPR & Privacy Compliance**: Customer data stored is limited to `stripe_customer_id`, email, and invoice amount. Automated data purge options available upon account deletion.

---

## 6. Milestones & Effort Estimate (2 to 4 Weeks)

```
Timeline: 3 Weeks Target MVP
Week 1: Core Engine & Stripe Integration
├── Day 1-2: Project setup (Next.js 15, Drizzle ORM, Supabase/Neon DB, Auth).
├── Day 3-4: Stripe webhook ingestion endpoint with signature verification & event queue.
└── Day 5: Stripe Billing Portal session generator (`payment_method_update` deep links).

Week 2: Dunning Automation & In-App Banner
├── Day 6-7: Resend email engine (templates, DKIM setup, automated Day 0, Day 3, Day 5 triggers).
├── Day 8-9: Lightweight Vanilla JS banner widget (<4KB) + status query API endpoint.
└── Day 10: Event idempotency, automated campaign resolution upon `invoice.payment_succeeded`.

Week 3: Dashboard, Testing & Private Alpha
├── Day 11-12: Founder Dashboard (Recovered MRR metrics, event logs, banner customizer).
├── Day 13-14: End-to-end sandbox testing with Stripe CLI (simulating failures, retries, successes).
└── Day 15: Deploy production build to Vercel, setup custom domain, prepare GATE_3 checklist.
```

---

## 7. Infrastructure Budget & Spend Cap

- **Domain Registration** (`dunningpulse.com` / `.io` / `.dev`): ~$10–$14 (One-time).
- **Vercel Hobby Tier**: $0 / month (Sufficient for MVP volume).
- **Neon / Supabase Serverless Postgres**: $0 / month (Within 0.5GB free limit).
- **Resend Free Tier**: $0 / month (3,000 emails/mo, 100/day).
- **Cloudflare (DNS & Banner CDN)**: $0 / month.
- **Total Direct Spend Ceiling**: **< $20 USD** (Well under the $50 budget limit).

---

## 8. Tests, Release Checklist & Rollback Strategy

### Verification & Testing Plan
1. **Stripe CLI Automated Suite**:
   - `stripe trigger invoice.payment_failed` $\rightarrow$ verifies DB records past_due status, trigger email fires via Resend.
   - `stripe trigger invoice.payment_succeeded` $\rightarrow$ verifies DB records recovered status, cancels remaining email drip, hides in-app banner.
2. **In-App Banner Test Harness**:
   - Embed snippet in a test HTML page $\rightarrow$ verify banner renders dynamically when status is past-due and hides when active.
3. **Rollback Strategy**:
   - Git branch tagging per milestone (`v0.1.0-alpha`). Instant 1-click rollback via Vercel deployment history if API issues arise.

