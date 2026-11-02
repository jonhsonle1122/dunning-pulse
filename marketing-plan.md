# 30-Day Go-to-Market Plan — DunningPulse (IDEA-01)

## 1. ICP, Positioning & Key Promise
- **Ideal Customer Profile (ICP)**: Technical solo founders, bootstrappers, and small engineering teams running B2B SaaS on Stripe ($1,000–$50,000 MRR) who suffer 20%–40% involuntary churn from failed credit cards.
- **Positioning**: "The anti-bloat payment recovery tool for bootstrapped SaaS — zero revenue cuts, $19/mo flat."
- **Key Promise**: Recover 30%–60% of failed subscription renewals within 48 hours using branded domain emails and a 1-line in-app banner snippet without paying $150–$250+/month enterprise fees.

---

## 2. Channel Strategy (Prioritizing 2 High-ROI Channels)

### Primary Channel: Indie Hacker & SaaS Founder Communities
- **Why**: Bootstrapped founders actively hang out in r/SaaS, Indie Hackers, and Twitter/X #buildinpublic discussing Stripe fee optimizations, churn reduction, and tech stack choices.
- **Approach**: High-utility, evidence-based content sharing ("How we analyzed 10,000 failed Stripe invoices and why default emails go to spam") rather than promotional spam.

### Secondary Channel: Developer-Led "Show HN" & Directory Distribution
- **Why**: Developers trust open architectures, clean Zero-PCI designs (leveraging `stripe.billingPortal`), and ultra-lightweight client scripts (< 3KB).
- **Listing Targets**:
  - Hacker News (Show HN)
  - Product Hunt
  - BetaList
  - AlternativeTo (Listed as low-cost alternative to Churnkey and Baremetrics Recover)
  - Stripe App Marketplace (Direct App submission)

---

## 3. Offer, CTA & Landing Page
- **Offer**: 14-day free trial, no credit card required to start, flat $19/month thereafter.
- **Call-to-Action (CTA)**: "Connect Stripe Sandbox in 5 Minutes" or "Calculate Your Lost MRR".
- **Primary Conversion Event**: Account creation + Stripe Webhook integration test verification.

---

## 4. SEO Keyword Cluster (High Intent, Low-to-Medium Difficulty)

| Target Keyword Cluster | Search Intent | Target Asset |
| :--- | :--- | :--- |
| `stripe involuntary churn recovery` | High Commercial Intent | Landing Page & Pillar Guide |
| `churnkey alternatives for small saas` | High Comparison Intent | Comparison Landing Page |
| `baremetrics recover alternative` | High Comparison Intent | Competitor Teardown Post |
| `how to recover failed stripe payments` | Educational / Problem-Aware | Technical Tutorial |
| `in app payment failed banner stripe` | High Solution Intent | Documentation & Showcase |

---

## 5. 30-Day Distribution Calendar

### Week 1: Launch Instrumentation & Alpha Onboarding
- **Day 1**: Deploy production build to Vercel and attach custom domain (`dunningpulse.com`).
- **Day 2**: Verify live Stripe Webhook listener using Stripe CLI live testing.
- **Day 3**: Share "Interactive Involuntary Churn Calculator" as a free standalone web tool on Twitter/X #buildinpublic and r/SaaS.
- **Day 4–5**: Conduct 5 consent-based 1-on-1 feedback conversations with bootstrapped founders on LinkedIn/Twitter asking how they currently manage failed card retries.
- **Day 6–7**: Refine onboarding UX based on early feedback.

### Week 2: Content Marketing & Directory Submissions
- **Day 8**: Publish teardown article: *"Why Stripe's Default Dunning Emails Go to Spam (And How to Fix It With Custom Domains)"*.
- **Day 9**: Submit DunningPulse to Product Hunt and BetaList.
- **Day 10**: Publish comparison page: *"DunningPulse vs Churnkey vs Baremetrics Recover: The Solo Founder's Guide"*.
- **Day 11–12**: Collect objections from trial signups; add automated email drip reminders.
- **Day 13–14**: Launch on Hacker News as `Show HN: DunningPulse – Lightweight Stripe dunning & in-app banner for $19/mo`.

### Week 3: Niche Community Engagement & Ecosystem Integration
- **Day 15–17**: Engage in relevant Reddit r/SaaS and r/indiehackers threads answering questions on subscription churn.
- **Day 18–19**: Begin submission preparation for the official Stripe App Marketplace.
- **Day 20–21**: Send personalized opt-in outreach to 10 founders who complained about high enterprise dunning costs.

### Week 4: Funnel Optimization & Review
- **Day 22–25**: Analyze funnel conversion: Unique Visits $\rightarrow$ Calculator Usage $\rightarrow$ Signups $\rightarrow$ Stripe Connected $\rightarrow$ Paid Conversions.
- **Day 26–28**: Interview the first 3 active users who recovered at least 1 subscription; write a case study snippet.
- **Day 29–30**: Monthly review: Double down on the highest-converting acquisition channel.

---

## 6. Target KPIs & Measurement Framework

- **Website Visitors**: 1,000 unique targeted visitors in Month 1.
- **Calculator Interactions**: $\ge 250$ calculations completed (25% engagement).
- **Free Trial Signups**: 40 signups (4% visit-to-signup conversion).
- **Stripe Connected (Activated)**: 15 active Stripe webhooks connected (37.5% activation).
- **Paid Subscribers**: 5 paying customers at $19/mo = $95 MRR (Targeting initial traction & positive cash flow).
- **Involuntary Churn Recovered for Users**: $\ge \$1,500$ cumulative recovered MRR across all alpha users (Delivering 15x value over cost).

---

## 7. Anti-Spam & Ethical Safeguards
- **No Unsolicited DMs/Emails**: Never mass scrape emails or send automated unsolicited cold pitches.
- **Value-First Community Engagement**: Only comment on public posts where founders specifically ask for advice on failed payments or churn.
- **Transparent Data Privacy**: Reassure founders that DunningPulse only requires restricted read-only permissions and never accesses customer credit card numbers.

