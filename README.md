# DunningPulse ⚡

> Lightweight Stripe Involuntary Churn Recovery & In-App Payment Banner for Bootstrapped SaaS.

DunningPulse solves involuntary SaaS churn caused by failed credit cards (expired, locked, or insufficient funds) by combining **branded domain emails** and an **ultra-lightweight (<3KB) in-app alert banner** with a **zero-login 1-click update link** powered by Stripe's Billing Portal.

---

## Key Features
- **Zero-PCI Compliance**: DunningPulse never touches raw credit card numbers. All card collection is handled directly on Stripe's hosted Billing Portal (`flow_data: { type: 'payment_method_update' }`).
- **Branded Custom Domain Emails**: Greet subscribers from your own domain (`billing@yourapp.com`) via Resend API, keeping emails out of spam tabs.
- **In-App Past-Due Alert Banner**: A 2.8KB Vanilla JS snippet embeds in your dashboard and displays dynamically only when logged-in users are delinquent.
- **Founder Dashboard**: Real-time recovery metrics (Recovered MRR, at-risk churn, recovery rate, active campaigns) and sandbox test simulator.
- **Flat Pricing Model**: $19/month flat with 0% revenue take-rates.

---

## Tech Stack
- **Framework**: Next.js 15 (App Router, Server Components)
- **Styling**: Tailwind CSS & Lucide Icons
- **Database**: Serverless PostgreSQL (Neon / Supabase) with in-memory fallback for local dev
- **Email Service**: Resend API
- **Billing**: Stripe Node SDK & Webhooks
- **Security**: AES-256-GCM encryption for stored API keys

---

## Quick Start (Local Development)

### 1. Install dependencies & configure env:
```bash
cp .env.example .env.local
npm install
```

### 2. Run the automated verification test suite:
```bash
node tests/run-all.js
```

### 3. Start development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the landing page or [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the founder recovery dashboard.

---

## Testing
Run the comprehensive test suite to verify crypto security, Stripe signature verification, dunning recovery transitions, and banner widget size:
```bash
node tests/run-all.js
```

---

## License
MIT License. Created by Antigravity Digital Product Venture Studio v3.

