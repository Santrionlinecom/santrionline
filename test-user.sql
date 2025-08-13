
-- =================================================================
--  Membuat user test untuk sistem SantriOnline
--  Email: test@santrionline.com
--  Password: password123
-- =================================================================

-- Insert test user
INSERT OR REPLACE INTO user (id, name, email, password_hash, avatar_url, role, created_at, username, bio, is_public, theme, custom_domain) 
VALUES ('user_1754303124926_jn7rl3ya3', 'Santri Test', 'test@santrionline.com', '6121efe3ad2fd78bf8c16e55302c90d528fa87a1fa77b1bde0b3fb1ced7d1b03', null, 'santri', 1754303124, 'santritest', 'Akun test untuk SantriOnline', 1, 'light', null);

-- Insert test wallet
INSERT OR REPLACE INTO dompet_santri (id, user_id, dincoin_balance, dircoin_balance) 
VALUES ('user_1754303124955_fom8dmvx8', 'user_1754303124926_jn7rl3ya3', 150, 75);

-- Display test user info
SELECT 'Test user created successfully!' as message;
SELECT 'Email: test@santrionline.com' as login_info;
SELECT 'Password: password123' as password_info;
