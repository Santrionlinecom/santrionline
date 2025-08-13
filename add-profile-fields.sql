-- Migration: Add profile fields to user table
-- Date: 2025-08-04

ALTER TABLE user ADD COLUMN phone TEXT;
ALTER TABLE user ADD COLUMN address TEXT;
ALTER TABLE user ADD COLUMN date_of_birth TEXT;
ALTER TABLE user ADD COLUMN education TEXT;
ALTER TABLE user ADD COLUMN institution TEXT;
ALTER TABLE user ADD COLUMN updated_at INTEGER;
