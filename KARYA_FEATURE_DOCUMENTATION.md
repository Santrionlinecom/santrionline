# Fitur Karya - Dokumentasi

## Overview
Fitur ini memungkinkan pengguna untuk menulis, mengelola, dan mempublikasikan karya tulis mereka di platform Santri Online.

## Struktur Database

### Tabel Karya
```sql
CREATE TABLE karya (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    content_type TEXT DEFAULT 'text', -- 'text' atau 'html'
    excerpt TEXT,
    status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
    slug TEXT,
    featured_image TEXT,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    tags TEXT, -- JSON string array
    category TEXT,
    price INTEGER DEFAULT 0,
    is_free INTEGER DEFAULT 0, -- boolean: 0=false, 1=true
    file_url TEXT,
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    reading_time INTEGER, -- dalam menit
    created_at INTEGER NOT NULL,
    updated_at INTEGER,
    published_at INTEGER,
    FOREIGN KEY (author_id) REFERENCES user(id)
);
```

## Rute dan File

### Rute Utama
- `/dashboard/karyaku` - Halaman daftar karya
- `/dashboard/karyaku/tulis` - Form tulis karya baru
- `/api/karya` - API endpoint untuk CRUD operations

### File Struktur
```
app/routes/
├── dashboard.karyaku.tsx           # Halaman daftar karya
├── dashboard.karyaku.tulis.tsx     # Form tulis karya baru
└── api.karya.tsx                   # API endpoints
```

## Fitur Utama

### 1. Tulis Karya Baru
- **URL**: `/dashboard/karyaku/tulis`
- **Fitur**:
  - Editor text dengan support Markdown dan HTML
  - Auto-resize textarea
  - Word count dan reading time estimation
  - Preview mode
  - Kategori dan tags
  - SEO settings
  - Pricing (gratis atau berbayar)
  - Featured image
  - Auto-generated slug dari title

### 2. Manajemen Karya
- **URL**: `/dashboard/karyaku`
- **Fitur**:
  - Daftar semua karya user
  - Filter berdasarkan status (draft/published)
  - Search functionality
  - Edit dan delete karya
  - Statistics dashboard
  - Preview karya

### 3. API Endpoints
- **POST /api/karya**: Buat karya baru
- **GET /api/karya**: Ambil daftar karya user
- **PUT /api/karya**: Update karya
- **DELETE /api/karya**: Hapus karya

## Setup Database

### 1. Local Development
```bash
# Setup tabel karya enhanced
npx wrangler d1 execute santri-db --local --file=setup-karya-enhanced.sql

# Test koneksi
npx wrangler d1 execute santri-db --local --command="SELECT 1 as test"
```

### 2. Production
```bash
# Deploy ke production
npx wrangler d1 execute santri-db --file=setup-karya-enhanced.sql
```

### 3. Menggunakan Batch Files
```bash
# Setup database
setup-karya-table.bat

# Test koneksi
test-db-connection.bat
```

## Kategori Karya
- Artikel Islami
- Syair & Puisi
- Kajian Kitab
- Pengalaman Spiritual
- Tutorial
- Cerita Inspiratif
- Review Buku
- Opini & Analisis
- Fiqih Sehari-hari
- Sejarah Islam
- Motivasi
- Pendidikan

## Content Types

### 1. Text (Markdown)
- Support untuk Markdown formatting
- Automatickonversi ke HTML saat display
- Cocok untuk artikel dan tulisan umum

### 2. HTML
- Support HTML langsung
- Lebih fleksibel untuk layout khusus
- Validation keamanan untuk mencegah XSS

## Monetisasi

### 1. Karya Gratis
- Dapat diakses semua user
- Membantu building reputation
- Tidak ada biaya

### 2. Karya Berbayar
- Harga dalam Dincoin
- User harus membeli untuk akses
- Revenue sharing dengan platform

## SEO Features
- Custom SEO title
- Meta description
- Keywords
- Open Graph tags
- Structured data

## Security

### 1. Content Validation
- HTML sanitization
- XSS prevention
- Content length limits

### 2. Access Control
- User hanya bisa edit karya sendiri
- Admin dapat moderate content
- Authentication required

## Performance

### 1. Database Optimization
- Indexes pada field yang sering diquery
- Pagination untuk list karya
- Lazy loading untuk content

### 2. Caching Strategy
- Cache static content
- CDN untuk images
- Browser caching headers

## Testing

### 1. Manual Testing
```bash
# Start development server
npm run dev

# Access form
http://localhost:5173/dashboard/karyaku/tulis

# Test database
test-db-connection.bat
```

### 2. Database Testing
```sql
-- Test insert
INSERT INTO karya (id, author_id, title, content, created_at) 
VALUES ('test-1', 'user-1', 'Test Title', 'Test content', 1641024000);

-- Test select
SELECT * FROM karya WHERE author_id = 'user-1';
```

## Deployment Checklist

### 1. Database
- [ ] Run setup-karya-enhanced.sql di production
- [ ] Verify table structure
- [ ] Test basic queries

### 2. Environment
- [ ] Check wrangler.toml configuration
- [ ] Verify D1 database binding
- [ ] Test API endpoints

### 3. Frontend
- [ ] Test form submission
- [ ] Verify routing
- [ ] Check responsive design

## Troubleshooting

### 1. Database Issues
```bash
# Check database list
npx wrangler d1 list

# Verify table exists
npx wrangler d1 execute santri-db --local --command="PRAGMA table_info(karya)"

# Test connection
test-db-connection.bat
```

### 2. Common Errors
- **Database not found**: Check wrangler.toml configuration
- **Table doesn't exist**: Run setup-karya-enhanced.sql
- **Form not submitting**: Check API endpoint and validation

## Future Enhancements

### 1. Features Roadmap
- File upload untuk attachment
- Image editor built-in
- Collaboration features
- Version control
- Advanced analytics

### 2. Performance Improvements
- Full-text search
- Better caching
- Image optimization
- CDN integration

---

## Quick Start

1. **Setup Database**:
   ```bash
   setup-karya-table.bat
   ```

2. **Start Development**:
   ```bash
   npm run dev
   ```

3. **Access**:
   - Daftar karya: http://localhost:5173/dashboard/karyaku
   - Tulis baru: http://localhost:5173/dashboard/karyaku/tulis

4. **Deploy**:
   ```bash
   npm run deploy
   ```
