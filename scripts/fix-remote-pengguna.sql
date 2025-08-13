-- Fix remote pengguna table to include missing updated_at column
-- This aligns the remote table with the local schema

-- Add missing columns to existing pengguna table
ALTER TABLE pengguna ADD COLUMN updated_at INTEGER;
ALTER TABLE pengguna ADD COLUMN phone TEXT;
ALTER TABLE pengguna ADD COLUMN address TEXT;
ALTER TABLE pengguna ADD COLUMN date_of_birth TEXT;
ALTER TABLE pengguna ADD COLUMN education TEXT;
ALTER TABLE pengguna ADD COLUMN institution TEXT;
