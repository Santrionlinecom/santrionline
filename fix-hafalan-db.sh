#!/bin/bash

echo "🔧 Memperbaiki Database Hafalan Quran..."

# Function to run local D1 commands
run_local_migration() {
    echo "📊 Menjalankan migrasi lokal..."
    npx wrangler d1 migrations apply santri-db --local
    npx wrangler d1 execute santri-db --local --file=./migrations/0003_quran_surahs_seed.sql
    echo "✅ Migrasi lokal selesai"
}

# Function to run production D1 commands
run_production_migration() {
    echo "🌐 Menjalankan migrasi production..."
    read -p "Apakah Anda yakin ingin menjalankan migrasi di production? (y/N): " confirm
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        npx wrangler d1 migrations apply santri-db
        npx wrangler d1 execute santri-db --file=./migrations/0003_quran_surahs_seed.sql
        echo "✅ Migrasi production selesai"
    else
        echo "❌ Migrasi production dibatalkan"
    fi
}

# Main menu
echo "Pilih opsi migrasi:"
echo "1. Local development"
echo "2. Production (Cloudflare D1)"
echo "3. Skip - Aplikasi akan auto-seed saat dijalankan"

read -p "Masukkan pilihan (1-3): " choice

case $choice in
    1)
        run_local_migration
        ;;
    2)
        run_production_migration
        ;;
    3)
        echo "⚡ Auto-seed akan berjalan saat aplikasi dimuat"
        echo "   Cukup jalankan: npm run dev"
        ;;
    *)
        echo "❌ Pilihan tidak valid"
        ;;
esac

echo ""
echo "🚀 Sekarang Anda dapat menjalankan:"
echo "   npm run dev"
echo ""
echo "   Kemudian akses: http://localhost:5174/dashboard/hafalan"
