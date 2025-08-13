# Contributing

Terima kasih ingin berkontribusi! Workflow ringkas:

1. Fork & branch dari `main` (format: `feat/nama-fitur` atau `fix/deskripsi-singkat`).
2. Jalankan: `npm install` lalu `cp .env.example .env` dan isi variabel.
3. Gunakan: `npm run dev` untuk development.
4. Pastikan sebelum commit: `npm run typecheck && npm test && npm run lint && npm run format:check`.
5. Commit message: gunakan konvensi minimal: `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`, `refactor: ...`.
6. Buka Pull Request: jelaskan perubahan + dampak schema DB (jika ada) + langkah migrasi.
7. Jangan sertakan credential / data sensitif di PR.

## Database Changes
- Gunakan `drizzle-kit generate` untuk membuat migrasi (nanti akan ditambahkan pipeline migrasi standar).
- Simpan file migrasi di `drizzle/` (otomatis) dan hindari patch manual di root; pindahkan patch lama ke `sql/legacy`.

## Testing
- Tambahkan minimal 1 unit test atau update test terkait jika mengubah logic.
- Snapshot / golden file harus dijelaskan alasan perubahan.

## Coding Standards
- TypeScript strict ON.
- Prettier + ESLint enforced via pre-commit hook.

## Issue Reporting
Buat issue dengan template (nanti akan ditambahkan) berisi:
- Deskripsi singkat
- Langkah reproduksi
- Expected vs Actual
- Lingkungan (browser / runtime)

Selamat berkontribusi!
