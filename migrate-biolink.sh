#!/bin/bash

echo "Menjalankan migrasi database untuk fitur biolink..."
echo

echo "1. Backup database terlebih dahulu..."
if [ -f ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite" ]; then
    cp .wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite backup_before_biolink_migration.sqlite 2>/dev/null || echo "Warning: Tidak dapat membuat backup otomatis"
fi

echo
echo "2. Menjalankan migrasi untuk fitur biolink..."
npx wrangler d1 execute santri-online-db --local --file=migrations/0004_biolink_features.sql

if [ $? -ne 0 ]; then
    echo "Error: Migrasi gagal!"
    echo "Silakan periksa file migrasi dan coba lagi."
    exit 1
fi

echo
echo "3. Menjalankan seed data biolink..."
npx wrangler d1 execute santri-online-db --local --file=drizzle/seed-biolink.sql

if [ $? -ne 0 ]; then
    echo "Warning: Seed data gagal, tapi migrasi berhasil"
fi

echo
echo "✅ Migrasi biolink berhasil!"
echo
echo "Fitur yang ditambahkan:"
echo "- Biolink personal untuk setiap santri"
echo "- Social media links (TikTok, Facebook, Instagram, YouTube, dll)"
echo "- Tema biolink (Light, Dark, Colorful)"
echo "- Analytics pengunjung dan klik"
echo "- Showcase karya di biolink"
echo
echo "Jalankan aplikasi dengan: npm run dev"
echo
