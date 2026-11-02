const assert = require('node:assert');

// Mock data structures and logic for pure unit testing
class MockDunningEngine {
  constructor() {
    this.customers = new Map();
    this.events = [];
  }

  processPaymentFailed(input) {
    const { accountId, stripeCustomerId, customerEmail, invoiceId, amountCents, currency } = input;
    let customer = this.customers.get(stripeCustomerId);

    if (!customer) {
      customer = {
        id: `dc_${Date.now()}`,
        accountId,
        stripeCustomerId,
        customerEmail,
        status: 'past_due',
        pastDueAmountCents: amountCents,
        currency,
        currentDunningStep: 1,
        firstFailedAt: new Date().toISOString(),
      };
    } else {
      customer.status = 'past_due';
      customer.pastDueAmountCents = amountCents;
      customer.currentDunningStep = (customer.currentDunningStep || 0) + 1;
    }

    this.customers.set(stripeCustomerId, customer);
    this.events.push({
      type: 'payment_failed',
      stripeCustomerId,
      invoiceId,
      amountCents,
    });

    const updateUrl = `https://billing.stripe.com/p/session/test_${stripeCustomerId}?flow=payment_method_update`;
    return { customer, updateUrl, emailSent: true };
  }

  processPaymentSucceeded(input) {
    const { stripeCustomerId, invoiceId } = input;
    const customer = this.customers.get(stripeCustomerId);
    if (!customer) return { customer: null, recovered: false };

    const wasPastDue = customer.status === 'past_due';
    customer.status = 'recovered';
    customer.recoveredAt = new Date().toISOString();
    this.customers.set(stripeCustomerId, customer);

    this.events.push({
      type: 'payment_succeeded',
      stripeCustomerId,
      invoiceId,
      amountCents: customer.pastDueAmountCents,
    });

    return { customer, recovered: wasPastDue };
  }

  getMetrics() {
    const all = Array.from(this.customers.values());
    const pastDue = all.filter((c) => c.status === 'past_due');
    const recovered = all.filter((c) => c.status === 'recovered');

    const totalPastDueCents = pastDue.reduce((sum, c) => sum + c.pastDueAmountCents, 0);
    const totalRecoveredCents = recovered.reduce((sum, c) => sum + c.pastDueAmountCents, 0);
    const recoveryRate = all.length > 0 ? Math.round((recovered.length / all.length) * 100) : 0;

    return {
      totalPastDueCount: pastDue.length,
      totalPastDueCents,
      totalRecoveredCount: recovered.length,
      totalRecoveredCents,
      recoveryRatePercent: recoveryRate,
      activeCampaignsCount: pastDue.length,
    };
  }
}

function runDunningServiceTests() {
  console.log('🧪 Running Dunning Service & Recovery Logic Tests...');
  const engine = new MockDunningEngine();

  // Test 1: Payment failure registers customer as past-due and generates 1-click update link
  const failResult = engine.processPaymentFailed({
    accountId: 'acc_01',
    stripeCustomerId: 'cus_test_user_99',
    customerEmail: 'user99@saas.com',
    invoiceId: 'in_fail_01',
    amountCents: 4900,
    currency: 'usd',
  });

  assert.strictEqual(failResult.customer.status, 'past_due', 'Customer status must be past_due');
  assert.strictEqual(failResult.customer.pastDueAmountCents, 4900, 'Amount must be recorded correctly');
  assert.ok(failResult.updateUrl.includes('flow=payment_method_update'), 'URL must deep link to payment_method_update');
  console.log('  ✅ Payment failure properly transitions customer to past_due');

  // Test 2: Metrics reflect delinquent subscriber
  let metrics = engine.getMetrics();
  assert.strictEqual(metrics.totalPastDueCount, 1);
  assert.strictEqual(metrics.totalPastDueCents, 4900);
  assert.strictEqual(metrics.totalRecoveredCount, 0);
  console.log('  ✅ Metrics accurately reflect at-risk delinquent subscription');

  // Test 3: Successful payment recovers the customer
  const recoverResult = engine.processPaymentSucceeded({
    stripeCustomerId: 'cus_test_user_99',
    invoiceId: 'in_success_01',
  });

  assert.strictEqual(recoverResult.recovered, true, 'Recovery flag must be true');
  assert.strictEqual(recoverResult.customer.status, 'recovered', 'Status must transition to recovered');

  // Test 4: Metrics updated after recovery
  metrics = engine.getMetrics();
  assert.strictEqual(metrics.totalPastDueCount, 0, 'Past due count should drop to 0');
  assert.strictEqual(metrics.totalRecoveredCount, 1, 'Recovered count should be 1');
  assert.strictEqual(metrics.totalRecoveredCents, 4900, 'Recovered cents must match');
  assert.strictEqual(metrics.recoveryRatePercent, 100, 'Recovery rate should be 100%');
  console.log('  ✅ Payment success transitions subscriber to recovered and updates metrics');
}

module.exports = { runDunningServiceTests };

if (require.main === module) {
  runDunningServiceTests();
}

