# Sources & Research Evidence — DunningPulse (IDEA-01)

### 1. Involuntary Churn & Payment Failure Metrics
- **Source**: RecovaMRR Industry Report (`https://recovamrr.com`) & SubRevival Benchmarks (`https://subrevival.com`)
- **Accessed Date**: 2026-11-02
- **Data Point**: Involuntary churn accounts for 20% to 40% of total SaaS subscription cancellations. Between 5% and 9% of total MRR is affected by payment failures each month.
- **Quote/Paraphrase**: "Failing to implement customized dunning flows and relying purely on out-of-the-box Stripe notifications leaves 30% to 60% of otherwise recoverable revenue on the table."

### 2. Enterprise Competitor Pricing & Features
- **Source**: Flowjam SaaS retention guide (`https://flowjam.com`), Dev.to dunning landscape (`https://dev.to`), Baremetrics pricing (`https://baremetrics.com`)
- **Accessed Date**: 2026-11-02
- **Verified Pricing**:
  - **Churnkey**: Starts at $250/month (Starter tier). Requires custom JS SDK and sales-led onboarding.
  - **Baremetrics Recover**: Base analytics plan ($75–$108/mo) + Recover add-on ($58–$129/mo) = total $133 to $237+/month.
  - **Churn Buster**: $99 to $250+/month depending on MRR volume.
  - **Stunning**: $99 to $299/month.
  - **Dunning Lite**: $19 to $49/month (entry competitor, but lacks clean in-app banner snippet).

### 3. Stripe Billing Portal Technical Feasibility
- **Source**: Official Stripe Documentation (`https://docs.stripe.com/customer-management/portal-deep-links`)
- **Accessed Date**: 2026-11-02
- **Key API Feature**:
  ```javascript
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.APP_URL}/dashboard`,
    flow_data: {
      type: 'payment_method_update',
    },
  });
  ```
- **Significance**: Allows creating a zero-login, tokenized, direct payment method update page hosted securely on Stripe's PCI-compliant infrastructure. DunningPulse never touches raw credit card numbers, maintaining SAQ-A compliance with zero regulatory or security liability.

### 4. Transactional Email Deliverability & Cost
- **Source**: Resend Pricing & Documentation (`https://resend.com/pricing`)
- **Accessed Date**: 2026-11-02
- **Data Point**: Free tier provides 3,000 emails/month (100 emails/day), with custom domain DKIM/SPF verification. Paid tier is $20/month for 50,000 emails. For a micro-SaaS with 100–1,000 subscribers experiencing 20–50 failed payments/mo, the free tier covers operating email volume easily.

### 5. Community Pain Points & Founder Sentiment
- **Source**: Reddit r/SaaS discussions (`https://www.reddit.com/r/SaaS`)
- **Accessed Date**: 2026-11-02
- **Data Point**: Founders with $2k–$15k MRR consistently complain that $150–$250/month dunning tools are cost-ineffective for their current stage, while writing custom email cron jobs and webhook listeners wastes valuable product engineering time.

