# Tasks & Milestones — DunningPulse (dunning-pulse)

## Phase 1: DISCOVER
- [x] Initialized workspace and registered projects [DONE]
- [x] Researched 10 digital product opportunities and produced shortlist [DONE]
- [x] GATE_1 approval: User approved IDEA-01 [DONE]

## Phase 2: VALIDATE
- [x] Completed desk research and competitor teardown [DONE]
- [x] Validated zero-PCI Stripe Billing Portal architecture [DONE]
- [x] Prepared PRD, MVP specification, and 3-week milestone plan [DONE]
- [x] GATE_2 approval: User approved BUILD IDEA-01 [DONE]

## Phase 3: BUILD
- [x] Scaffold repository: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.js`, `.env.example`, `LICENSE`, `README.md` [DONE]
- [x] Implement crypto security module (AES-256-GCM encryption for stored API keys) [DONE]
- [x] Build Stripe Webhook signature verification and billing portal deep link generator [DONE]
- [x] Implement Dunning Service (state machine for failed/recovered payments, metrics calculation) [DONE]
- [x] Implement Resend transactional email templates (Day 0, Day 3, Day 5 schedule) [DONE]
- [x] Build in-app banner widget (`public/banner.js`, verified at 2.87 KB < 4KB) [DONE]
- [x] Build Edge status API (`/api/v1/customer-status`) and webhook endpoint (`/api/webhooks/stripe`) [DONE]
- [x] Build Interactive Landing Page with Churn Loss Calculator (`src/app/page.tsx`) [DONE]
- [x] Build Founder Dashboard & Sandbox Simulator (`src/app/dashboard/page.tsx`) [DONE]
- [x] Build Banner Customizer with live visual preview (`src/app/dashboard/settings/page.tsx`) [DONE]
- [x] Build automated test suite (`tests/run-all.js`) and verify 100% pass rate [DONE]
- [x] Create launch readiness checklist (`launch-checklist.md`) [DONE]
- [x] GATE_3 approval: User approved LAUNCH IDEA-01 [DONE]

## Phase 4: LAUNCH
- [x] Verify launch readiness and zero-cost infrastructure limits [DONE]
- [x] Produce 30-day Go-to-Market distribution plan (`marketing-plan.md`) [DONE]
- [x] Generate channel-specific marketing asset pack (Product Hunt, Show HN, Twitter thread, 1-on-1 outreach) [DONE]
- [x] Draft legal compliance assets (`PRIVACY.md`, `TERMS.md`) [DONE]
- [x] Compile detailed launch report with verified URLs (`output/launch-report.md`) [DONE]
- [x] Package deployment instructions and rollback strategy for production [DONE]
- [x] Push clean MVP repository to GitHub (`https://github.com/jonhsonle1122/dunning-pulse.git`) [DONE]
- [x] Deploy live production web application to Vercel (`https://dunning-pulse-theta.vercel.app`) [DONE]

## Phase 5: GROW (Next Mode)
- [ ] Connect custom production domain (`dunningpulse.com`) [PENDING USER AUTH]
- [ ] Execute Week 1 distribution calendar (Show HN & free Churn Calculator launch) [PENDING]
- [ ] Track visits $\rightarrow$ calculations $\rightarrow$ signups $\rightarrow$ activations $\rightarrow$ paid conversions [PENDING]
- [ ] Optimize conversion funnel and double down on highest ROI channel [PENDING]
