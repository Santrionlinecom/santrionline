// Script untuk membuat user test untuk menguji sistem login/dashboard
// PENTING: Script ini menggunakan hashing sederhana untuk demo.
// Pada production, gunakan crypto.server.ts untuk hash password yang aman.

console.log('📝 Creating test user...');

// Function sederhana untuk hash password (hanya untuk testing)
// Pada production gunakan hashPassword dari crypto.server.ts
function simpleHash(password) {
  const crypto = require('crypto');
  
  // Buat salt sederhana
  const salt = 'test_salt_for_demo';
  
  // Gabungkan password dengan salt
  const combined = password + salt;
  
  // Hash menggunakan SHA-256 beberapa kali
  let hash = combined;
  for (let i = 0; i < 1000; i++) {
    hash = crypto.createHash('sha256').update(hash).digest('hex');
  }
  
  return hash;
}

// Generate ID unik
function generateId() {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

const testUser = {
  id: 'user_test_123',
  name: 'Santri Test',
  email: 'test@santrionline.com',
  password_hash: simpleHash('password123'), // Hash sederhana untuk testing
  avatar_url: null,
  role: 'santri',
  created_at: Math.floor(Date.now() / 1000), // Unix timestamp
  username: 'santritest',
  bio: 'Akun test untuk SantriOnline',
  is_public: 1,
  theme: 'light',
  custom_domain: null
};

const walletId = 'wallet_test_123';

const userWallet = {
  id: walletId,
  user_id: testUser.id,
  dincoin_balance: 150,
  dircoin_balance: 75
};

const sqlScript = `
-- =================================================================
--  Membuat user test untuk sistem SantriOnline
--  Email: test@santrionline.com
--  Password: password123
-- =================================================================

-- Insert test user
INSERT OR REPLACE INTO user (id, name, email, password_hash, avatar_url, role, created_at, username, bio, is_public, theme, custom_domain) 
VALUES ('${testUser.id}', '${testUser.name}', '${testUser.email}', '${testUser.password_hash}', ${testUser.avatar_url}, '${testUser.role}', ${testUser.created_at}, '${testUser.username}', '${testUser.bio}', ${testUser.is_public}, '${testUser.theme}', ${testUser.custom_domain});

-- Insert test wallet
INSERT OR REPLACE INTO dompet_santri (id, user_id, dincoin_balance, dircoin_balance) 
VALUES ('${userWallet.id}', '${testUser.id}', ${userWallet.dincoin_balance}, ${userWallet.dircoin_balance});

-- Display test user info
SELECT 'Test user created successfully!' as message;
SELECT 'Email: test@santrionline.com' as login_info;
SELECT 'Password: password123' as password_info;
`;

require('fs').writeFileSync('test-user.sql', sqlScript);

console.log('✅ Test user SQL script created: test-user.sql');
console.log('📧 Email: test@santrionline.com');
console.log('🔐 Password: password123');
console.log('💰 Wallet: 150 Dincoin, 75 Dircoin');
console.log('\n📋 To create the test user, run:');
console.log('   node create-test-user.cjs');
console.log('   wrangler d1 execute santri-db --local --file=test-user.sql');
console.log('\n⚠️  CATATAN: Script ini menggunakan hashing sederhana untuk demo.');
console.log('   Pada production, gunakan crypto.server.ts untuk keamanan yang proper.');
