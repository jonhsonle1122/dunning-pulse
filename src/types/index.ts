export type CustomerStatus = 'active' | 'past_due' | 'recovered' | 'canceled';

export interface Account {
  id: string;
  email: string;
  projectId: string; // e.g. "dp_live_xxx"
  stripeRestrictedKeyEncrypted?: string;
  stripeWebhookSecretEncrypted?: string;
  senderEmail?: string;
  senderName?: string;
  resendApiKeyEncrypted?: string;
  createdAt: string;
}

export interface DunningCustomer {
  id: string;
  accountId: string;
  stripeCustomerId: string;
  customerEmail: string;
  customerName?: string;
  status: CustomerStatus;
  pastDueAmountCents: number;
  currency: string;
  firstFailedAt?: string;
  recoveredAt?: string;
  currentDunningStep: number; // 0, 1 (Day 0), 2 (Day 3), 3 (Day 5)
  lastEmailSentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type EventType =
  | 'payment_failed'
  | 'email_sent'
  | 'portal_session_created'
  | 'payment_succeeded'
  | 'subscription_canceled';

export interface RecoveryEvent {
  id: string;
  accountId: string;
  dunningCustomerId: string;
  eventType: EventType;
  stripeInvoiceId?: string;
  amountCents?: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface BannerSettings {
  accountId: string;
  bannerText: string;
  buttonText: string;
  primaryColor: string;
  enabled: boolean;
}

export interface RecoveryMetrics {
  totalPastDueCount: number;
  totalPastDueCents: number;
  totalRecoveredCount: number;
  totalRecoveredCents: number;
  recoveryRatePercent: number;
  activeCampaignsCount: number;
}

export interface CustomerStatusResponse {
  pastDue: boolean;
  bannerText?: string;
  buttonText?: string;
  updateUrl?: string;
  primaryColor?: string;
}

