const assert = require('node:assert');
const crypto = require('node:crypto');

function verifyStripeWebhookSignature(rawBody, signatureHeader, webhookSecret, toleranceSeconds = 300) {
  if (!signatureHeader || !webhookSecret) {
    return { valid: false, error: 'Missing signature header or webhook secret' };
  }

  const items = signatureHeader.split(',');
  let timestamp = -1;
  const signatures = [];

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

function runStripeTests() {
  console.log('🧪 Running Stripe Webhook & Signature Verification Tests...');

  const webhookSecret = 'whsec_test_secret_key_12345';
  const rawBody = JSON.stringify({
    id: 'evt_test_123',
    type: 'invoice.payment_failed',
    data: {
      object: {
        id: 'in_test_failed_01',
        customer: 'cus_test_user_01',
        amount_due: 4900,
        currency: 'usd',
      },
    },
  });

  const now = Math.floor(Date.now() / 1000);
  const payloadToSign = `${now}.${rawBody}`;
  const validSignature = crypto.createHmac('sha256', webhookSecret).update(payloadToSign).digest('hex');
  const validHeader = `t=${now},v1=${validSignature}`;

  // Test 1: Valid signature passes
  const resultValid = verifyStripeWebhookSignature(rawBody, validHeader, webhookSecret);
  assert.strictEqual(resultValid.valid, true, 'Valid signature should verify successfully');
  console.log('  ✅ Valid Stripe webhook signature passes verification');

  // Test 2: Invalid signature rejected
  const invalidHeader = `t=${now},v1=bad_hex_signature_deadbeef1234567890`;
  const resultInvalid = verifyStripeWebhookSignature(rawBody, invalidHeader, webhookSecret);
  assert.strictEqual(resultInvalid.valid, false, 'Invalid signature must fail');
  console.log('  ✅ Spoofed/invalid signature correctly rejected');

  // Test 3: Expired timestamp rejected
  const expiredTime = now - 600; // 10 minutes ago (outside 300s window)
  const expiredPayload = `${expiredTime}.${rawBody}`;
  const expiredSig = crypto.createHmac('sha256', webhookSecret).update(expiredPayload).digest('hex');
  const expiredHeader = `t=${expiredTime},v1=${expiredSig}`;
  const resultExpired = verifyStripeWebhookSignature(rawBody, expiredHeader, webhookSecret, 300);
  assert.strictEqual(resultExpired.valid, false);
  assert.strictEqual(resultExpired.error, 'Webhook timestamp outside tolerance window');
  console.log('  ✅ Replay attacks with stale timestamps rejected');
}

module.exports = { runStripeTests };

if (require.main === module) {
  runStripeTests();
}

