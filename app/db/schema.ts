import { sqliteTable, text, integer, primaryKey, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Tabel Pengguna dan Peran
export const user = sqliteTable('pengguna', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  googleId: text('google_id').unique(),
  avatarUrl: text('avatar_url'), // Menambahkan kolom avatarUrl
  role: text('role', { enum: ['santri', 'admin'] })
    .notNull()
    .default('santri'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  // Profile fields
  phone: text('phone'),
  address: text('address'),
  dateOfBirth: text('date_of_birth'),
  education: text('education'),
  institution: text('institution'),
  // Biolink fields
  username: text('username').unique(), // Username untuk biolink
  bio: text('bio'), // Bio description
  isPublic: integer('is_public', { mode: 'boolean' }).default(true), // Apakah biolink publik
  theme: text('theme', { enum: ['light', 'dark', 'colorful'] }).default('light'),
  customDomain: text('custom_domain'), // Custom domain jika ada
});

// Tabel Biolink dan Social Media
export const user_social_links = sqliteTable('user_social_links', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  platform: text('platform', {
    enum: [
      'tiktok',
      'facebook',
      'instagram',
      'youtube',
      'twitter',
      'tokopedia',
      'shopee',
      'whatsapp',
      'telegram',
      'linkedin',
      'github',
      'website',
    ],
  }).notNull(),
  url: text('url').notNull(),
  isVisible: integer('is_visible', { mode: 'boolean' }).default(true),
  displayOrder: integer('display_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const biolink_analytics = sqliteTable('biolink_analytics', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  visitorCount: integer('visitor_count').default(0),
  clickCount: integer('click_count').default(0),
  date: text('date').notNull(), // Format: YYYY-MM-DD
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Tabel Dompet dan Transaksi
export const dompet_santri = sqliteTable('dompet_santri', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  dincoinBalance: integer('dincoin_balance').notNull().default(0),
  dircoinBalance: integer('dircoin_balance').notNull().default(0),
});

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  dompetId: text('dompet_id')
    .notNull()
    .references(() => dompet_santri.id),
  amount: integer('amount').notNull(),
  type: text('type', { enum: ['credit', 'debit'] }).notNull(),
  currency: text('currency', { enum: ['dincoin', 'dircoin'] }).notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Tabel Topup Requests
export const topup_requests = sqliteTable('topup_requests', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  amount: integer('amount').notNull(),
  currency: text('currency', { enum: ['dincoin', 'dircoin'] }).notNull(),
  paymentMethod: text('payment_method').notNull(),
  paymentProof: text('payment_proof'), // URL to payment proof image
  bankAccount: text('bank_account'), // Bank account details
  transferAmount: integer('transfer_amount'), // Amount transferred in IDR
  whatsappNumber: text('whatsapp_number'),
  notes: text('notes'),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] })
    .notNull()
    .default('pending'),
  adminNotes: text('admin_notes'),
  processedAt: integer('processed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Tabel Purchases
export const purchases = sqliteTable('purchases', {
  id: text('id').primaryKey(),
  buyerId: text('buyer_id')
    .notNull()
    .references(() => user.id),
  sellerId: text('seller_id')
    .notNull()
    .references(() => user.id),
  karyaId: text('karya_id')
    .notNull()
    .references(() => karya.id),
  amount: integer('amount').notNull(),
  currency: text('currency', { enum: ['dincoin', 'dircoin'] }).notNull(),
  platform_fee: integer('platform_fee').notNull().default(0),
  status: text('status', { enum: ['pending', 'completed', 'cancelled'] })
    .notNull()
    .default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Tabel Marketplace: Karya dan Order
export const karya = sqliteTable(
  'karya',
  {
    id: text('id').primaryKey(),
    authorId: text('author_id')
      .notNull()
      .references(() => user.id),
    title: text('title').notNull(),
    description: text('description'),
    price: integer('price').notNull(),
    fileUrl: text('file_url'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    // Enhanced content management fields
    contentType: text('content_type', { enum: ['text', 'html'] }).default('text'),
    content: text('content'),
    excerpt: text('excerpt'),
    status: text('status', { enum: ['draft', 'published', 'archived'] }).default('draft'),
    slug: text('slug'),
    featuredImage: text('featured_image'),
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    seoKeywords: text('seo_keywords'),
    tags: text('tags'), // JSON array of tags
    category: text('category'),
    publishedAt: integer('published_at', { mode: 'timestamp' }),
    updatedAt: integer('updated_at', { mode: 'timestamp' }),
    viewCount: integer('view_count').default(0),
    downloadCount: integer('download_count').default(0),
    isFree: integer('is_free', { mode: 'boolean' }).default(false),
    readingTime: integer('reading_time'), // estimated reading time in minutes
    deletedAt: integer('deleted_at', { mode: 'timestamp' }), // soft delete marker
    lastStatusChangedAt: integer('last_status_changed_at', { mode: 'timestamp' }), // audit status transitions
  },
  (table) => ({
    idxKaryaStatusDeletedAuthor: index('idx_karya_status_deleted_author').on(
      table.status,
      table.deletedAt,
      table.authorId,
    ),
    idxKaryaSlug: index('idx_karya_slug').on(table.slug),
  }),
);

// Event sourcing table for real-time sync (SSE polling)
export const karya_events = sqliteTable(
  'karya_events',
  {
    id: text('id').primaryKey(),
    karyaId: text('karya_id').notNull(),
    type: text('type', {
      enum: ['created', 'updated', 'status_changed', 'deleted', 'restored', 'hard_deleted'],
    }).notNull(),
    payloadJson: text('payload_json'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    idxKaryaEventsCreatedAt: index('idx_karya_events_created_at').on(table.createdAt),
    idxKaryaEventsKaryaId: index('idx_karya_events_karya_id').on(table.karyaId),
  }),
);

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  buyerId: text('buyer_id')
    .notNull()
    .references(() => user.id),
  karyaId: text('karya_id')
    .notNull()
    .references(() => karya.id),
  totalAmount: integer('total_amount').notNull(),
  status: text('status', { enum: ['pending', 'completed', 'cancelled'] })
    .notNull()
    .default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Tabel Komunitas
export const community_post = sqliteTable('community_post', {
  id: text('id').primaryKey(),
  authorId: text('author_id')
    .notNull()
    .references(() => user.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category', {
    enum: ['hafalan', 'kajian', 'pengalaman', 'tanya-jawab', 'event', 'teknologi', 'umum'],
  })
    .notNull()
    .default('umum'),
  likesCount: integer('likes_count').notNull().default(0),
  commentsCount: integer('comments_count').notNull().default(0),
  viewsCount: integer('views_count').notNull().default(0),
  isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const post_comment = sqliteTable('post_comment', {
  id: text('id').primaryKey(),
  postId: text('post_id')
    .notNull()
    .references(() => community_post.id),
  authorId: text('author_id')
    .notNull()
    .references(() => user.id),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const post_like = sqliteTable(
  'post_like',
  {
    id: text('id').primaryKey(),
    postId: text('post_id')
      .notNull()
      .references(() => community_post.id),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    // Ensure one like per user per post
    uniqueLike: primaryKey({ columns: [table.postId, table.userId] }),
  }),
);

// Tabel Akademik: Hafalan Quran
export const quran_surah = sqliteTable('quran_surah', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  totalAyah: integer('total_ayah').notNull(),
});

export const user_hafalan_quran = sqliteTable(
  'user_hafalan_quran',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    surahId: integer('surah_id')
      .notNull()
      .references(() => quran_surah.id),
    completedAyah: integer('completed_ayah').notNull().default(0),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.surahId] }),
  }),
);

// Tabel Akademik: Progres Diniyah
export const diniyah_kitab = sqliteTable('diniyah_kitab', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  description: text('description'),
});

export const diniyah_pelajaran = sqliteTable('diniyah_pelajaran', {
  id: integer('id').primaryKey(),
  kitabId: integer('kitab_id')
    .notNull()
    .references(() => diniyah_kitab.id),
  title: text('title').notNull(),
  points: integer('points').notNull().default(0),
});

// Tabel untuk konten detail setiap pelajaran diniyah
export const diniyah_pelajaran_content = sqliteTable('diniyah_pelajaran_content', {
  id: integer('id').primaryKey(),
  pelajaranId: integer('pelajaran_id')
    .notNull()
    .references(() => diniyah_pelajaran.id),
  sectionOrder: integer('section_order').notNull().default(1),
  sectionTitle: text('section_title'),
  contentType: text('content_type', {
    enum: ['text', 'arabic', 'translation', 'explanation', 'dalil'],
  })
    .notNull()
    .default('text'),
  content: text('content').notNull(),
  audioUrl: text('audio_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const user_progres_diniyah = sqliteTable(
  'user_progres_diniyah',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    pelajaranId: integer('pelajaran_id')
      .notNull()
      .references(() => diniyah_pelajaran.id),
    status: text('status', { enum: ['not_started', 'in_progress', 'completed'] })
      .notNull()
      .default('not_started'),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.pelajaranId] }),
  }),
);

// Tabel Akademik: Ijazah dan Raport
export const ijazah = sqliteTable('ijazah', {
  id: text('id').primaryKey(),
  studentId: text('student_id')
    .notNull()
    .references(() => user.id),
  type: text('type', { enum: ['raport', 'ijazah'] }).notNull(),
  fileUrl: text('file_url').notNull(),
  issuedAt: integer('issued_at', { mode: 'timestamp' }).notNull(),
  issuedBy: text('issued_by')
    .notNull()
    .references(() => user.id), // Admin ID
});

// =========================
// Sertifikat & Raport Snapshot
// =========================
export const certificate = sqliteTable('certificate', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  certificateCode: text('certificate_code').notNull().unique(), // kode publik (misal STO-2024-001)
  totalJuz: integer('total_juz').notNull().default(0),
  totalScore: integer('total_score').notNull().default(0),
  achievementsJson: text('achievements_json'), // snapshot JSON pencapaian saat pengajuan
  completedBooksJson: text('completed_books_json'),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] })
    .notNull()
    .default('pending'),
  approvedBy: text('approved_by'),
  approvedAt: integer('approved_at', { mode: 'timestamp' }),
  rejectReason: text('reject_reason'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

// Evaluasi Hafalan (skor per surah / segmen) untuk perhitungan nilai akurat
export const hafalan_evaluasi = sqliteTable('hafalan_evaluasi', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  surahId: integer('surah_id')
    .notNull()
    .references(() => quran_surah.id),
  score: integer('score').notNull(), // 0-100
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// =========================
// Ulama & Biografi (Dinamis)
// =========================
export const ulama_category = sqliteTable('ulama_category', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const ulama = sqliteTable('ulama', {
  id: text('id').primaryKey(),
  categoryId: text('category_id')
    .notNull()
    .references(() => ulama_category.id),
  authorId: text('author_id').references(() => user.id),
  name: text('name').notNull(),
  fullName: text('full_name'),
  slug: text('slug').unique(),
  birth: text('birth'), // e.g. "150 H" atau tahun Masehi
  death: text('death'),
  birthPlace: text('birth_place'),
  biography: text('biography'),
  contribution: text('contribution'),
  quote: text('quote'),
  imageUrl: text('image_url'),
  referencesJson: text('references_json'), // JSON array sumber rujukan
  periodCentury: text('period_century'), // contoh: "2H", "20M"
  searchIndex: text('search_index'), // gabungan field untuk pencarian LIKE
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const ulama_work = sqliteTable('ulama_work', {
  id: text('id').primaryKey(),
  ulamaId: text('ulama_id')
    .notNull()
    .references(() => ulama.id),
  title: text('title').notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const certificateRelations = relations(certificate, ({ one }) => ({
  user: one(user, { fields: [certificate.userId], references: [user.id] }),
}));

// Ulama Relations
export const ulamaCategoryRelations = relations(ulama_category, ({ many }) => ({
  ulama: many(ulama),
}));

export const ulamaRelations = relations(ulama, ({ one, many }) => ({
  category: one(ulama_category, {
    fields: [ulama.categoryId],
    references: [ulama_category.id],
  }),
  author: one(user, {
    fields: [ulama.authorId],
    references: [user.id],
  }),
  works: many(ulama_work),
}));

export const ulamaWorkRelations = relations(ulama_work, ({ one }) => ({
  ulama: one(ulama, {
    fields: [ulama_work.ulamaId],
    references: [ulama.id],
  }),
}));

// Definisi Relasi (Opsional tapi sangat direkomendasikan)
export const userRelations = relations(user, ({ one, many }) => ({
  dompet: one(dompet_santri, {
    fields: [user.id],
    references: [dompet_santri.userId],
  }),
  karya: many(karya),
  orders: many(orders),
  posts: many(community_post),
  comments: many(post_comment),
  likes: many(post_like),
  hafalanQuran: many(user_hafalan_quran),
  progresDiniyah: many(user_progres_diniyah),
  ijazahDiterbitkan: many(ijazah, { relationName: 'penerbit' }),
  ijazahDiterima: many(ijazah, { relationName: 'penerima' }),
  socialLinks: many(user_social_links),
  biolinkAnalytics: many(biolink_analytics),
  topupRequests: many(topup_requests),
  purchasesAsBuyer: many(purchases, { relationName: 'buyer' }),
  purchasesAsSeller: many(purchases, { relationName: 'seller' }),
}));

export const topupRequestsRelations = relations(topup_requests, ({ one }) => ({
  user: one(user, {
    fields: [topup_requests.userId],
    references: [user.id],
  }),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  buyer: one(user, {
    fields: [purchases.buyerId],
    references: [user.id],
    relationName: 'buyer',
  }),
  seller: one(user, {
    fields: [purchases.sellerId],
    references: [user.id],
    relationName: 'seller',
  }),
  karya: one(karya, {
    fields: [purchases.karyaId],
    references: [karya.id],
  }),
}));

export const socialLinksRelations = relations(user_social_links, ({ one }) => ({
  user: one(user, {
    fields: [user_social_links.userId],
    references: [user.id],
  }),
}));

export const biolinkAnalyticsRelations = relations(biolink_analytics, ({ one }) => ({
  user: one(user, {
    fields: [biolink_analytics.userId],
    references: [user.id],
  }),
}));

export const diniyahKitabRelations = relations(diniyah_kitab, ({ many }) => ({
  pelajaran: many(diniyah_pelajaran),
}));

export const diniyahPelajaranRelations = relations(diniyah_pelajaran, ({ one, many }) => ({
  kitab: one(diniyah_kitab, {
    fields: [diniyah_pelajaran.kitabId],
    references: [diniyah_kitab.id],
  }),
  userProgress: many(user_progres_diniyah),
  content: many(diniyah_pelajaran_content),
}));

export const diniyahPelajaranContentRelations = relations(diniyah_pelajaran_content, ({ one }) => ({
  pelajaran: one(diniyah_pelajaran, {
    fields: [diniyah_pelajaran_content.pelajaranId],
    references: [diniyah_pelajaran.id],
  }),
}));

export const userProgresDiniyahRelations = relations(user_progres_diniyah, ({ one }) => ({
  user: one(user, {
    fields: [user_progres_diniyah.userId],
    references: [user.id],
  }),
  pelajaran: one(diniyah_pelajaran, {
    fields: [user_progres_diniyah.pelajaranId],
    references: [diniyah_pelajaran.id],
  }),
}));

// Community Relations
export const communityPostRelations = relations(community_post, ({ one, many }) => ({
  author: one(user, {
    fields: [community_post.authorId],
    references: [user.id],
  }),
  comments: many(post_comment),
  likes: many(post_like),
}));

export const postCommentRelations = relations(post_comment, ({ one }) => ({
  post: one(community_post, {
    fields: [post_comment.postId],
    references: [community_post.id],
  }),
  author: one(user, {
    fields: [post_comment.authorId],
    references: [user.id],
  }),
}));

export const postLikeRelations = relations(post_like, ({ one }) => ({
  post: one(community_post, {
    fields: [post_like.postId],
    references: [community_post.id],
  }),
  user: one(user, {
    fields: [post_like.userId],
    references: [user.id],
  }),
}));
