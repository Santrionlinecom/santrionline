-- Additional tables for topup and purchase system

-- Table for manual topup requests
CREATE TABLE IF NOT EXISTS topup_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('dincoin', 'dircoin')),
  transfer_amount INTEGER NOT NULL, -- amount in rupiah
  payment_method TEXT NOT NULL DEFAULT 'bank_transfer',
  bank_account TEXT NOT NULL, -- bank code (BCA, BNI, etc.)
  whatsapp_number TEXT NOT NULL,
  payment_proof TEXT, -- URL to payment proof image
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  processed_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
);

-- Table for purchase transactions
CREATE TABLE IF NOT EXISTS purchases (
  id TEXT PRIMARY KEY,
  buyer_id TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  karya_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('dincoin', 'dircoin')),
  platform_fee INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded')),
  download_url TEXT, -- for digital products
  expires_at DATETIME, -- download link expiry
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES user (id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES user (id) ON DELETE CASCADE,
  FOREIGN KEY (karya_id) REFERENCES karya (id) ON DELETE CASCADE
);

-- Table for user reviews and ratings
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  reviewer_id TEXT NOT NULL,
  karya_id TEXT NOT NULL,
  purchase_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reviewer_id) REFERENCES user (id) ON DELETE CASCADE,
  FOREIGN KEY (karya_id) REFERENCES karya (id) ON DELETE CASCADE,
  FOREIGN KEY (purchase_id) REFERENCES purchases (id) ON DELETE CASCADE,
  UNIQUE(reviewer_id, karya_id, purchase_id)
);

-- Table for payment gateway transactions (for future multipayment)
CREATE TABLE IF NOT EXISTS payment_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  topup_request_id TEXT,
  external_id TEXT, -- from payment gateway
  provider TEXT NOT NULL, -- midtrans, xendit, etc.
  method TEXT NOT NULL, -- bank_transfer, e_wallet, va, etc.
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'IDR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'expired')),
  payment_url TEXT,
  va_number TEXT,
  qr_code TEXT,
  expires_at DATETIME,
  paid_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE,
  FOREIGN KEY (topup_request_id) REFERENCES topup_requests (id) ON DELETE SET NULL
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_topup_requests_user_id ON topup_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_topup_requests_status ON topup_requests(status);
CREATE INDEX IF NOT EXISTS idx_purchases_buyer_id ON purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_seller_id ON purchases(seller_id);
CREATE INDEX IF NOT EXISTS idx_purchases_karya_id ON purchases(karya_id);
CREATE INDEX IF NOT EXISTS idx_reviews_karya_id ON reviews(karya_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);

-- Add some sample data for testing
INSERT OR IGNORE INTO topup_requests (id, user_id, amount, currency, transfer_amount, payment_method, bank_account, whatsapp_number, status, created_at) VALUES
('topup_1', 'user_1', 5, 'dincoin', 50000, 'bank_transfer', 'BCA', '+6281234567890', 'pending', datetime('now')),
('topup_2', 'user_2', 10, 'dincoin', 100000, 'bank_transfer', 'BNI', '+6281234567891', 'approved', datetime('now', '-1 day')),
('topup_3', 'user_3', 1, 'dincoin', 10000, 'bank_transfer', 'MANDIRI', '+6281234567892', 'rejected', datetime('now', '-2 days'));

-- Sample purchase data
INSERT OR IGNORE INTO purchases (id, buyer_id, seller_id, karya_id, amount, currency, platform_fee, status, created_at) VALUES
('purchase_1', 'user_1', 'user_2', 'karya_1', 100, 'dircoin', 10, 'completed', datetime('now')),
('purchase_2', 'user_3', 'user_1', 'karya_2', 1, 'dincoin', 1, 'completed', datetime('now', '-1 hour'));
