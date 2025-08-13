-- Create topup_requests table if not exists
CREATE TABLE IF NOT EXISTS topup_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('dincoin', 'dircoin')),
  transfer_amount INTEGER,
  payment_method TEXT NOT NULL,
  bank_account TEXT,
  whatsapp_number TEXT,
  payment_proof TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  processed_at INTEGER,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user (id)
);

-- Verify table was created
SELECT name FROM sqlite_master WHERE type='table' AND name='topup_requests';
