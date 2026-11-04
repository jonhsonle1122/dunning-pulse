import crypto from 'node:crypto';

/**
 * Verifies a Stripe Webhook signature header against the raw body payload.
 * Follows Stripe's official HMAC-SHA256 signature scheme:
 * header format: t=timestamp,v1=signature
 */
export function verifyStripeWebhookSignature(
  rawBody: string | Buffer,
  signatureHeader: string,
  webhookSecret: string,
  toleranceSeconds: number = 300
): { valid: boolean; error?: string } {
  if (!signatureHeader || !webhookSecret) {
    return { valid: false, error: 'Missing signature header or webhook secret' };
  }

  const items = signatureHeader.split(',');
  let timestamp = -1;
  const signatures: string[] = [];

  for (const item of items) {
    const [key, value] = item.trim().split('=');
    if (key === 't') {
      timestamp = parseInt(value, 10);
    } else if (key === 'v1') {
      signatures.push(value);
    }
  }

  if (timestamp === -1 || signatures.length === 0) {
    return { valid: false, error: 'Malformed stripe-signature header' };
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (toleranceSeconds > 0 && Math.abs(nowSeconds - timestamp) > toleranceSeconds) {
    return { valid: false, error: 'Webhook timestamp outside tolerance window' };
  }

  const payload = `${timestamp}.${typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8')}`;
  const computedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');

  const valid = signatures.some((sig) => {
    try {
      return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(computedSignature, 'hex'));
    } catch {
      return false;
    }
  });

  return valid ? { valid: true } : { valid: false, error: 'Signature mismatch' };
}

/**
 * Creates a Stripe Billing Portal Session deep-linked directly to payment method update.
 */
export async function createPaymentMethodUpdateSession(params: {
  stripeSecretKey: string;
  customerId: string;
  returnUrl: string;
}): Promise<{ url: string; id: string }> {
  const { stripeSecretKey, customerId, returnUrl } = params;

  // In test mode or when using mock keys:
  if (!stripeSecretKey || stripeSecretKey.startsWith('sk_test_mock') || stripeSecretKey === 'default' || stripeSecretKey === 'rk_test_sample_restricted_key') {
    const host = process.env.NEXT_PUBLIC_APP_URL || 'https://dunning-pulse-theta.vercel.app';
    return {
      id: `bps_mock_${Date.now()}`,
      url: `${host}/demo/stripe-portal?customerId=${encodeURIComponent(customerId)}&returnUrl=${encodeURIComponent(returnUrl)}`,
    };
  }

  // Real Stripe API call via standard fetch
  const formParams = new URLSearchParams();
  formParams.append('customer', customerId);
  formParams.append('return_url', returnUrl);
  formParams.append('flow_data[type]', 'payment_method_update');

  const response = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formParams.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Stripe API error: ${response.status} - ${(errorData as any)?.error?.message || response.statusText}`);
  }

  const session = (await response.json()) as { url: string; id: string };
  return { url: session.url, id: session.id };
}

