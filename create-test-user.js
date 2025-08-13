const { nanoid } = require('nanoid');
const crypto = require('crypto');

/**
 * Membuat hash password (fungsi sederhana untuk demo)
 */
async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    // Menggunakan pbkdf2 untuk hash password
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

/**
 * Script untuk membuat test user di D1 database
 */
async function main() {
  // Informasi user test
  const testUser = {
    id: nanoid(),
    name: 'Test User',
    email: 'test@santrionline.com',
    username: 'testuser',
    password: 'password123', // Akan di-hash
    role: 'santri'
  };

  // Hash password
  const passwordHash = await hashPassword(testUser.password);

  // SQL untuk menyisipkan user test
  const sql = `
  INSERT INTO user (
    id, 
    name, 
    email, 
    username,
    password_hash, 
    role, 
    created_at, 
    is_public, 
    theme
  ) 
  VALUES (
    '${testUser.id}', 
    '${testUser.name}', 
    '${testUser.email}', 
    '${testUser.username}', 
    '${passwordHash}', 
    '${testUser.role}', 
    ${Date.now()}, 
    1, 
    'light'
  )
  ON CONFLICT(email) DO NOTHING;
  `;

  console.log('\n============================================================');
  console.log('               CREATING TEST USER IN D1 DATABASE');
  console.log('============================================================\n');
  
  console.log('SQL Command to run:');
  console.log(sql);
  
  console.log('\n============================================================');
  console.log('To execute this SQL in D1 database:');
  console.log('1. Login to Cloudflare Dashboard (https://dash.cloudflare.com)');
  console.log('2. Navigate to Workers & Pages > D1 > santri-db');
  console.log('3. Click on "Query"');
  console.log('4. Paste the SQL command above');
  console.log('5. Click "Run Query"');
  console.log('============================================================\n');
  
  console.log('Test User Credentials:');
  console.log(`Email: ${testUser.email}`);
  console.log(`Password: ${testUser.password}`);
  console.log('============================================================\n');
}

main().catch(console.error);
