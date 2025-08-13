# Karya Real-time Sync & Audit System

## Migration yang Sudah Dijalankan

File: `migrations/0011_karya_audit_indexes.sql`

### Perubahan Database:
1. **Kolom Baru:**
   - `last_status_changed_at` - Tracking kapan status karya terakhir berubah
   - `deleted_at` - Soft delete timestamp (sudah ada sebelumnya)

2. **Index untuk Performance:**
   - `idx_karya_status_deleted_author` - Query cepat filter status + author
   - `idx_karya_slug` - Lookup karya by slug
   - `idx_karya_events_created_at` - Sorting events by time
   - `idx_karya_events_karya_id` - Filter events by karya

3. **Tabel Events:**
   - `karya_events` - Audit log semua perubahan karya

### Cara Menjalankan Migrasi:
```bash
npx wrangler d1 execute inti-santri --local --file=migrations/0011_karya_audit_indexes.sql
```

## Fitur Real-time Sync

### 1. Dashboard Karya (/dashboard/karyaku)
- **Tong Sampah**: Filter `?status=trash` untuk melihat karya yang dihapus
- **Restore**: Tombol "Pulihkan" untuk karya yang soft-deleted
- **Hard Delete**: Tombol "Hapus Permanen" untuk delete sepenuhnya
- **Auto Events**: Semua aksi (create/update/delete/restore) tercatat di audit log

### 2. Marketplace (/marketplace)
- **Auto Refresh**: Polling setiap 15 detik untuk karya baru
- **Real-time Updates**: Menggunakan Remix useRevalidator()
- **Filter Aktif**: Hanya tampil karya published & tidak dihapus

### 3. Biolink Profile (/:username)
- **Sync Karya**: Polling setiap 20 detik untuk update karya user
- **Auto Refresh**: Karya baru/update langsung muncul tanpa reload

### 4. Admin Audit Log (/admin/karya-audit)
- **Event Tracking**: Semua perubahan karya tercatat dengan timestamp
- **Admin Only**: Hanya user dengan role 'admin' yang bisa akses
- **JSON Payload**: Detail perubahan dalam format JSON

## API Endpoints

### /api/karya-events
Polling endpoint untuk real-time sync:
```
GET /api/karya-events?since=1691234567890&karyaId=optional
```

Response:
```json
{
  "events": [
    {
      "id": "evt_123",
      "karyaId": "karya_456", 
      "type": "status_changed",
      "payloadJson": "{\"from\":\"draft\",\"to\":\"published\"}",
      "createdAt": "2025-08-09T10:30:00Z"
    }
  ]
}
```

## Event Types:
- `created` - Karya baru dibuat
- `updated` - Konten karya diupdate  
- `status_changed` - Status berubah (draft → published, dll)
- `deleted` - Soft delete (pindah ke tong sampah)
- `restored` - Dipulihkan dari tong sampah
- `hard_deleted` - Dihapus permanen

## Testing

1. **Create Karya**: Buat karya baru → cek muncul di marketplace otomatis
2. **Update Status**: Ubah draft → published → cek sync real-time
3. **Soft Delete**: Hapus karya → cek hilang dari marketplace & biolink
4. **Restore**: Pulihkan dari tong sampah → cek muncul kembali
5. **Admin Audit**: Cek /admin/karya-audit untuk log semua perubahan

## Troubleshooting

- Jika sync lambat, cek network tab browser untuk request /api/karya-events
- Jika audit log kosong, cek role user = 'admin' di database
- Jika migrasi gagal, jalankan manual query SQL satu per satu
