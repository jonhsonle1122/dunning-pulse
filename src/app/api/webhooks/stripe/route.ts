import { NextRequest, NextResponse } from 'next/server';
import { verifyStripeWebhookSignature } from '@/lib/stripe';
import { dunningService } from '@/services/dunning-service';
import { db } from '@/lib/db';
import { decryptSecret } from '@/lib/crypto';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature') || '';

    // Find account to get webhook secret
    const url = new URL(req.url);
    const projectId = url.searchParams.get('projectId') || 'dp_live_demo123';
    const account = db.getAccountByProjectId(projectId);

    if (!account) {
      return NextResponse.json({ error: 'Unknown project account' }, { status: 404 });
    }

    // Determine webhook secret (support environment fallback or account secret)
    let webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret_for_local_testing';
    if (account.stripeWebhookSecretEncrypted) {
      try {
        webhookSecret = decryptSecret(account.stripeWebhookSecretEncrypted);
      } catch {}
    }

    // Verify signature (bypass in dev mode if secret is placeholder)
    if (!webhookSecret.startsWith('whsec_test_secret')) {
      const { valid, error } = verifyStripeWebhookSignature(rawBody, signature, webhookSecret);
      if (!valid) {
        return NextResponse.json({ error: `Signature verification failed: ${error}` }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);

    switch (event.type) {
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await dunningService.processPaymentFailed({
          accountId: account.id,
          stripeCustomerId: invoice.customer,
          customerEmail: invoice.customer_email || 'customer@example.com',
          customerName: invoice.customer_name,
          invoiceId: invoice.id,
          amountCents: invoice.amount_due || invoice.total || 0,
          currency: invoice.currency || 'usd',
        });
        break;
      }

      case 'invoice.payment_succeeded':
      case 'invoice.paid': {
        const invoice = event.data.object;
        await dunningService.processPaymentSucceeded({
          accountId: account.id,
          stripeCustomerId: invoice.customer,
          invoiceId: invoice.id,
          amountCents: invoice.amount_paid || invoice.total,
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await dunningService.processSubscriptionCanceled(account.id, subscription.customer);
        break;
      }

      default:
        // Other events ignored cleanly
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Webhook processing failed' }, { status: 500 });
  }
}

