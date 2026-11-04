import { db } from '../lib/db';
import { createPaymentMethodUpdateSession } from '../lib/stripe';
import { sendDunningEmail } from '../lib/email';
import { decryptSecret } from '../lib/crypto';
import { DunningCustomer, RecoveryMetrics } from '../types';

export interface PaymentFailedInput {
  accountId: string;
  stripeCustomerId: string;
  customerEmail: string;
  customerName?: string;
  invoiceId: string;
  amountCents: number;
  currency: string;
}

export interface PaymentSucceededInput {
  accountId: string;
  stripeCustomerId: string;
  invoiceId: string;
  amountCents?: number;
}

export class DunningService {
  /**
   * Handles a failed payment attempt (invoice.payment_failed).
   */
  async processPaymentFailed(input: PaymentFailedInput): Promise<{ customer: DunningCustomer; updateUrl: string; emailSent: boolean }> {
    const { accountId, stripeCustomerId, customerEmail, customerName, invoiceId, amountCents, currency } = input;
    const account = db.getAccountById(accountId);
    if (!account) {
      throw new Error(`Account not found for id: ${accountId}`);
    }

    let customer = db.getCustomer(accountId, stripeCustomerId);
    const now = new Date().toISOString();

    if (!customer) {
      customer = {
        id: `dc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        accountId,
        stripeCustomerId,
        customerEmail,
        customerName,
        status: 'past_due',
        pastDueAmountCents: amountCents,
        currency,
        firstFailedAt: now,
        currentDunningStep: 1,
        lastEmailSentAt: now,
        createdAt: now,
        updatedAt: now,
      };
    } else {
      customer.status = 'past_due';
      customer.pastDueAmountCents = amountCents;
      customer.currency = currency;
      if (!customer.firstFailedAt) customer.firstFailedAt = now;
      customer.currentDunningStep = Math.min((customer.currentDunningStep || 0) + 1, 3);
      customer.lastEmailSentAt = now;
    }

    db.saveCustomer(customer);

    // Log the failed payment event
    db.logEvent({
      accountId,
      dunningCustomerId: customer.id,
      eventType: 'payment_failed',
      stripeInvoiceId: invoiceId,
      amountCents,
    });

    // Generate Stripe 1-Click Payment Method Update URL
    let stripeKey = 'sk_test_mock_default_key';
    if (account.stripeRestrictedKeyEncrypted) {
      try {
        stripeKey = decryptSecret(account.stripeRestrictedKeyEncrypted);
      } catch {}
    }

    const returnUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dunning-pulse-theta.vercel.app';
    const portalSession = await createPaymentMethodUpdateSession({
      stripeSecretKey: stripeKey,
      customerId: stripeCustomerId,
      returnUrl,
    });

    db.logEvent({
      accountId,
      dunningCustomerId: customer.id,
      eventType: 'portal_session_created',
      stripeInvoiceId: invoiceId,
      metadata: { portalSessionId: portalSession.id },
    });

    // Send Day 0 Dunning Notification Email
    const amountFormatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amountCents / 100);

    let resendKey: string | undefined;
    if (account.resendApiKeyEncrypted) {
      try {
        resendKey = decryptSecret(account.resendApiKeyEncrypted);
      } catch {}
    }

    const emailResult = await sendDunningEmail({
      toEmail: customerEmail,
      customerName,
      senderName: account.senderName || 'Billing Team',
      appName: 'Subscription',
      amountFormatted,
      updateUrl: portalSession.url,
      step: 1,
      fromEmail: account.senderEmail,
      resendApiKey: resendKey,
    });

    if (emailResult.success) {
      db.logEvent({
        accountId,
        dunningCustomerId: customer.id,
        eventType: 'email_sent',
        stripeInvoiceId: invoiceId,
        metadata: { emailId: emailResult.id, step: 1 },
      });
    }

    return {
      customer,
      updateUrl: portalSession.url,
      emailSent: emailResult.success,
    };
  }

  /**
   * Handles a successful recovery payment (invoice.payment_succeeded).
   */
  async processPaymentSucceeded(input: PaymentSucceededInput): Promise<{ customer: DunningCustomer | null; recovered: boolean }> {
    const { accountId, stripeCustomerId, invoiceId } = input;
    const customer = db.getCustomer(accountId, stripeCustomerId);

    if (!customer) {
      return { customer: null, recovered: false };
    }

    const wasPastDue = customer.status === 'past_due';
    customer.status = 'recovered';
    customer.recoveredAt = new Date().toISOString();
    db.saveCustomer(customer);

    db.logEvent({
      accountId,
      dunningCustomerId: customer.id,
      eventType: 'payment_succeeded',
      stripeInvoiceId: invoiceId,
      amountCents: customer.pastDueAmountCents,
    });

    return { customer, recovered: wasPastDue };
  }

  /**
   * Handles subscription cancellation (customer.subscription.deleted).
   */
  async processSubscriptionCanceled(accountId: string, stripeCustomerId: string): Promise<DunningCustomer | null> {
    const customer = db.getCustomer(accountId, stripeCustomerId);
    if (!customer) return null;

    customer.status = 'canceled';
    db.saveCustomer(customer);

    db.logEvent({
      accountId,
      dunningCustomerId: customer.id,
      eventType: 'subscription_canceled',
    });

    return customer;
  }

  /**
   * Retrieves dashboard recovery metrics.
   */
  getMetrics(accountId: string): RecoveryMetrics {
    return db.getMetrics(accountId);
  }
}

export const dunningService = new DunningService();

