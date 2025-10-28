# 🕌 KOMUNITAS FEED - SANTRIONLINE

Halaman komunitas profesional seperti Facebook Feed yang dirancang khusus untuk komunitas santri online.

## ✨ Fitur Utama

### 📝 Compose Post

- **Text Post**: Maksimal 5.000 karakter dengan format yang mendukung line breaks
- **Upload Gambar**: 0-4 gambar per post (JPG/PNG/WebP, maksimal 2MB each)
- **Preview & Edit**: Preview gambar sebelum posting dengan opsi hapus
- **Validasi**: Client-side dan server-side validation menggunakan Zod

### 📱 Feed Beranda

- **Infinite Scroll**: Cursor-based pagination untuk performa optimal
- **Real-time Updates**: Optimistic UI untuk like dan comment
- **Responsive Design**: Mobile-first dengan grid gambar yang adaptif
- **Skeleton Loading**: Loading states yang smooth

### 💬 Interaksi Sosial

- **Like/Unlike**: Toggle dengan optimistic UI dan counter real-time
- **Comment System**: Form komentar dengan preview dan pagination
- **Share Feature**: Re-share post ke feed sendiri atau copy link
- **View Counter**: Tracking views per post

### 🛡️ Moderasi & Keamanan

- **Rate Limiting**: Maksimal 5 post/comment per 5 menit
- **Content Sanitization**: Escape HTML untuk keamanan
- **Delete Posts**: Author dan admin bisa menghapus post/comment
- **Report System**: Fitur laporan untuk konten tidak pantas

## 🗄️ Database Schema

### Tabel Utama

#### `posts`

```sql
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  content TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER,
  share_parent_id TEXT,
  FOREIGN KEY(author_id) REFERENCES pengguna(id),
  FOREIGN KEY(share_parent_id) REFERENCES posts(id)
);
```

#### `post_images`

```sql
CREATE TABLE post_images (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  url TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  idx INTEGER DEFAULT 0,
  FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
);
```

#### `likes`

```sql
CREATE TABLE likes (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(post_id, user_id),
  FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY(user_id) REFERENCES pengguna(id) ON DELETE CASCADE
);
```

#### `comments`

```sql
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY(user_id) REFERENCES pengguna(id) ON DELETE CASCADE
);
```

## 🏗️ Tech Stack

- **Frontend**: Remix + React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **File Storage**: Cloudflare R2 (untuk gambar)
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Auth**: Supabase Auth (Google OAuth)

## 📁 Struktur File

```
app/
├── routes/
│   ├── community._index.tsx          # Feed utama
│   ├── community.post.$postId.tsx    # Detail post
│   └── api/
│       ├── upload.signed-url.ts      # Signed URL untuk R2
│       ├── upload.direct.ts          # Direct upload ke R2
│       └── community/
│           ├── like.ts               # API like/unlike
│           ├── comment.ts            # API comment
│           ├── share.ts              # API share
│           └── delete.ts             # API delete
├── components/
│   ├── ComposePost.tsx               # Form create post
│   ├── PostCard.tsx                  # Komponen single post
│   ├── ImageGrid.tsx                 # Grid gambar responsif
│   ├── CommentForm.tsx               # Form komentar
│   ├── CommentList.tsx               # List komentar
│   └── Skeletons.tsx                 # Loading skeletons
├── db/
│   └── community-schema.ts           # Schema database komunitas
└── lib/
    └── community.server.ts           # Server utilities
```

## 🚀 Setup & Deployment

### 1. Database Setup

```bash
# Setup database schema
./setup-community-feed.bat

# Setup dengan dummy data
./setup-community-demo.bat
```

### 2. Environment Variables

```bash
# wrangler.toml
[env.production.vars]
R2_BUCKET = "so-uploads"
R2_ACCESS_KEY_ID = "your-access-key"
R2_SECRET_ACCESS_KEY = "your-secret-key"

[[env.production.r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "so-uploads"
```

### 3. Development

```bash
npm run dev
```

### 4. Deployment

```bash
npm run build
npm run deploy
```

## 🎨 UI Components

### Grid Gambar Responsif

```typescript
// 1 gambar: aspect-[4/3] full width
// 2 gambar: grid-cols-2, aspect-[4/3]
// 3 gambar: 1 besar (col-span-1 row-span-2) + 2 kecil
// 4 gambar: grid-cols-2 grid-rows-2, aspect-square
```

### Infinite Scroll

- Menggunakan `IntersectionObserver`
- Cursor-based pagination
- Loading indicator yang smooth
- Auto-load saat mencapai bottom

### Optimistic UI

- Like button langsung update UI
- Rollback jika request gagal
- Visual feedback untuk user

## 🔧 API Endpoints

### POST `/api/community/like`

```typescript
{
  postId: string,
  action: 'like' | 'unlike'
}
```

### POST `/api/community/comment`

```typescript
{
  postId: string,
  content: string (max 1000 chars)
}
```

### POST `/api/community/share`

```typescript
{
  postId: string;
}
```

### POST `/api/upload/signed-url`

```typescript
{
  postId: string,
  contentType: 'image/jpeg' | 'image/png' | 'image/webp',
  size: number (max 2MB)
}
```

## 📊 Performance

### Optimizations

- **Image Lazy Loading**: Gambar dimuat saat diperlukan
- **Skeleton Loading**: Mengurangi perceived loading time
- **Cursor Pagination**: Efisien untuk dataset besar
- **Optimistic Updates**: UI responsif tanpa menunggu server
- **Component Memoization**: React.memo untuk komponen yang tidak berubah

### Metrics Target

- **LCP < 2.5s**: First Contentful Paint
- **CLS < 0.1**: Cumulative Layout Shift minimal
- **FID < 100ms**: Interaktivitas yang responsif

## 🔒 Security

### Content Security

- **HTML Escaping**: Semua user input di-escape
- **File Validation**: Validasi type dan size file upload
- **Rate Limiting**: Mencegah spam posting
- **CORS**: Ketat untuk upload endpoint

### Authentication

- **Session-based**: Menggunakan session yang sudah ada
- **Role-based**: Admin dan santri memiliki permission berbeda
- **CSRF Protection**: Token untuk form submission

## 🧪 Testing

### Acceptance Criteria

✅ **Post Creation**: Teks + gambar berhasil dipost
✅ **Image Grid**: Responsif untuk 1-4 gambar  
✅ **Like/Comment**: Optimistic UI dengan counter akurat
✅ **Infinite Scroll**: Load 10 item + pagination
✅ **Delete Function**: Author/admin bisa hapus post
✅ **Mobile Responsive**: Layout tidak shift di mobile
✅ **Loading States**: Skeleton active saat loading

### Test Data

```sql
-- Lihat seed-community-data.sql untuk dummy data
-- 4 sample posts dengan content yang realistis
-- Comments dan likes untuk testing interaksi
```

## 🎯 Roadmap

### Phase 2 (Future)

- [ ] **Reply to Comments**: Nested comment system
- [ ] **Hashtags**: Trending topics dan search
- [ ] **Mentions**: @username notifications
- [ ] **Rich Text Editor**: Formatting text
- [ ] **Video Upload**: MP4 support dengan R2
- [ ] **Push Notifications**: Real-time updates
- [ ] **Advanced Moderation**: Auto-filter inappropriate content

### Phase 3 (Advanced)

- [ ] **Groups/Communities**: Sub-komunitas berdasarkan interest
- [ ] **Live Chat**: Real-time messaging
- [ ] **Voice Messages**: Audio posts dan comments
- [ ] **Analytics Dashboard**: Engagement metrics
- [ ] **AI Moderation**: Content filtering dengan AI

## 📞 Support

Untuk pertanyaan atau masalah:

1. Check documentation di file ini
2. Lihat console browser untuk error
3. Check Cloudflare dashboard untuk logs
4. Pastikan database schema up-to-date

---

**Built with ❤️ for the SantriOnline Community**
