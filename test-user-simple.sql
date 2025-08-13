-- Insert test user
INSERT OR REPLACE INTO user (id, name, email, password_hash, avatar_url, role, created_at, username, bio, is_public, theme, custom_domain) 
VALUES ('user_1754301501106_vvphuxzpl', 'Santri Test', 'test@santrionline.com', '6121efe3ad2fd78bf8c16e55302c90d528fa87a1fa77b1bde0b3fb1ced7d1b03', null, 'santri', 1754301501, 'santritest', 'Akun test untuk SantriOnline', 1, 'light', null);

-- Insert test wallet
INSERT OR REPLACE INTO dompet_santri (id, user_id, dincoin_balance, dircoin_balance) 
VALUES ('user_1754301501138_38vldelb9', 'user_1754301501106_vvphuxzpl', 150, 75);
