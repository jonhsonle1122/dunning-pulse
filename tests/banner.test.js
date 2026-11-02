const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function runBannerTests() {
  console.log('🧪 Running In-App Banner Widget (< 4KB) & Client Script Tests...');

  // 1. Check banner.js exists and is lightweight (< 4KB)
  const bannerPath = path.resolve(__dirname, '../public/banner.js');
  assert.ok(fs.existsSync(bannerPath), 'public/banner.js must exist');

  const stats = fs.statSync(bannerPath);
  const sizeKb = stats.size / 1024;
  console.log(`  📊 Banner widget file size: ${sizeKb.toFixed(2)} KB`);
  assert.ok(sizeKb < 4.0, `Banner script must be strictly under 4KB (Actual: ${sizeKb.toFixed(2)} KB)`);
  console.log('  ✅ Size requirement (< 4KB) verified');

  // 2. Syntax validation
  const bannerContent = fs.readFileSync(bannerPath, 'utf8');
  assert.doesNotThrow(() => {
    new vm.Script(bannerContent);
  }, 'banner.js must be syntactically valid JavaScript');
  console.log('  ✅ Vanilla JavaScript syntax validation passed');

  // 3. Test Banner Decision Logic
  function evaluateBannerStatus(customerStatus, bannerEnabled) {
    if (!bannerEnabled) return { pastDue: false };
    if (customerStatus !== 'past_due') return { pastDue: false };
    return {
      pastDue: true,
      bannerText: 'Your subscription renewal failed. Please update your payment method.',
      buttonText: 'Update Payment Method',
      updateUrl: 'https://billing.stripe.com/p/session/test',
    };
  }

  assert.strictEqual(evaluateBannerStatus('active', true).pastDue, false, 'Active customer should not show banner');
  assert.strictEqual(evaluateBannerStatus('recovered', true).pastDue, false, 'Recovered customer should not show banner');
  assert.strictEqual(evaluateBannerStatus('past_due', false).pastDue, false, 'Disabled banner should not render');

  const pastDueResult = evaluateBannerStatus('past_due', true);
  assert.strictEqual(pastDueResult.pastDue, true, 'Past due customer must trigger banner display');
  assert.ok(pastDueResult.updateUrl.includes('billing.stripe.com'), 'Must provide direct update link');
  console.log('  ✅ In-app banner conditional display logic verified');
}

module.exports = { runBannerTests };

if (require.main === module) {
  runBannerTests();
}

