const { runCryptoTests } = require('./crypto.test');
const { runStripeTests } = require('./stripe.test');
const { runDunningServiceTests } = require('./dunning-service.test');
const { runBannerTests } = require('./banner.test');

console.log('====================================================');
console.log('🚀 DUNNINGPULSE (IDEA-01) — AUTOMATED VERIFICATION SUITE');
console.log('====================================================\n');

let failed = false;

try {
  runCryptoTests();
  console.log('');
  runStripeTests();
  console.log('');
  runDunningServiceTests();
  console.log('');
  runBannerTests();
  console.log('');
  console.log('====================================================');
  console.log('🎉 ALL TESTS PASSED! (100% SUCCESS)');
  console.log('====================================================');
} catch (err) {
  failed = true;
  console.error('\n❌ TEST FAILURE:', err);
}

process.exit(failed ? 1 : 0);

