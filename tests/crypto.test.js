const assert = require('node:assert');
const crypto = require('node:crypto');

// Inline crypto implementation mirror for standalone testing
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

function getMasterKey() {
  const masterKey = process.env.ENCRYPTION_MASTER_KEY || 'default-antigravity-dev-key-32b!';
  return crypto.createHash('sha256').update(masterKey).digest();
}

function encryptSecret(plainText) {
  if (!plainText) return '';
  const key = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

function decryptSecret(armoredText) {
  if (!armoredText) return '';
  const parts = armoredText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid format');
  }
  const [ivHex, authTagHex, cipherTextHex] = parts;
  const key = getMasterKey();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(cipherTextHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function runCryptoTests() {
  console.log('🧪 Running Crypto Security Tests (AES-256-GCM)...');

  // Test 1: Roundtrip encryption and decryption
  const secretKey = 'sample_api_secret_key_mock_1234567890';
  const encrypted = encryptSecret(secretKey);
  assert.ok(encrypted.includes(':'), 'Encrypted output should contain iv:authTag:ciphertext format');
  const decrypted = decryptSecret(encrypted);
  assert.strictEqual(decrypted, secretKey, 'Decrypted secret must match original plaintext');
  console.log('  ✅ Roundtrip encryption/decryption passed');

  // Test 2: Tamper detection (Auth Tag verification)
  const parts = encrypted.split(':');
  const tamperedCipher = parts[2].slice(0, -2) + (parts[2].endsWith('ff') ? '00' : 'ff');
  const tamperedArmored = `${parts[0]}:${parts[1]}:${tamperedCipher}`;
  assert.throws(
    () => decryptSecret(tamperedArmored),
    /Unsupported state or unable to authenticate data/,
    'Tampered ciphertext must fail authentication'
  );
  console.log('  ✅ Tamper detection and authentication tag verification passed');

  // Test 3: Empty inputs
  assert.strictEqual(encryptSecret(''), '', 'Empty string should return empty string');
  assert.strictEqual(decryptSecret(''), '', 'Empty string should return empty string');
  console.log('  ✅ Edge cases and empty strings handled');
}

module.exports = { runCryptoTests };

if (require.main === module) {
  runCryptoTests();
}
