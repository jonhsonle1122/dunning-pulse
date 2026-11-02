# Project Brief — DunningPulse (IDEA-01)

## Executive Summary
- **Product Name**: DunningPulse
- **Idea ID**: IDEA-01
- **Category**: B2B Micro-SaaS (Stripe Ecosystem)
- **Tagline**: Lightweight involuntary churn recovery & in-app payment alert banner for bootstrapped SaaS.
- **Target Audience**: Micro-SaaS founders, solo bootstrappers, and indie hackers using Stripe Billing ($1,000–$50,000 MRR).
- **Core Value Proposition**: Recover 30%–60% of failed subscription renewals for a flat $19/month without paying $150–$250+/month enterprise fees or losing revenue to spam-filtered default Stripe emails.

## Customer Problem & Urgent Buying Trigger
1. **The Involuntary Churn Bleed**: 20%–40% of total SaaS churn is caused by payment failures (expired credit cards, temporary bank fraud blocks, insufficient funds). For a $10,000 MRR SaaS, this represents $500–$900 in lost revenue every single month.
2. **The Flaws of Default Stripe Dunning**:
   - Sends emails from generic `@stripe.com` domains which frequently land in Gmail's "Promotions" or "Spam" tabs.
   - Lacks in-app visibility: active users who are using the app daily never see that their payment failed until their account is suddenly locked.
   - Forcing users to login or navigate complex account billing settings introduces high friction.
3. **The Urgent Trigger**: A founder notices several high-paying annual or monthly subscribers canceled due to failed card retries without ever knowing their card failed.

## Positioning & Unique Wedge
- **Positioning**: "The anti-bloat payment recovery tool for solo founders and micro-SaaS."
- **Wedge**:
  - Flat $19/month pricing (no revenue cut, no per-seat pricing).
  - Custom domain emails via Resend/Postmark API with deep-linked tokenized Stripe payment update portal sessions (`flow_data: { type: 'payment_method_update' }`).
  - 1-line copy-paste embeddable in-app banner snippet (`<script>`) that alerts active users in real-time inside the web app.

