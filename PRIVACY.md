# Privacy Policy — DunningPulse

Last Updated: November 2, 2026

DunningPulse ("we", "us", or "our") operates the DunningPulse website and recovery platform. This policy outlines our data collection, processing, and protection practices.

## 1. Zero PCI Scope (Payment Cards)
DunningPulse **never** collects, processes, transmits, or stores credit card numbers, CVVs, or bank account credentials. All payment method updates and billing interactions are handled directly within Stripe's PCI-DSS Level 1 certified Billing Portal.

## 2. Information We Process
To provide subscription recovery services, we process:
- Account information: Founder email, project identifier, encrypted webhook secrets, and encrypted Stripe Restricted API keys (encrypted at rest using AES-256-GCM).
- Webhook metadata: `stripe_customer_id`, customer email, invoice amount, currency, and payment status timestamp.

## 3. Data Retention and Security
- All sensitive API credentials are encrypted with authenticated AES-256-GCM before database storage.
- Customers may request complete data deletion at any time by contacting `privacy@dunningpulse.com`.

## 4. Sub-processors
We use trusted infrastructure sub-processors:
- **Stripe**: Billing infrastructure and Customer Portal.
- **Resend**: Transactional email dispatch.
- **Vercel / Cloudflare**: Web application hosting and global edge CDN.
- **Neon / Supabase**: Encrypted serverless database hosting.

