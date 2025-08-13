// Extended schema untuk Community Feed
// app/db/community-schema.ts

import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { user } from './schema';

// ===== COMMUNITY FEED TABLES =====

// Posts table untuk feed komunitas
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  authorId: text('author_id')
    .notNull()
    .references(() => user.id),
  content: text('content'), // max 5000 karakter
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  shareParentId: text('share_parent_id'), // untuk share/repost, akan di-reference nanti
});

// Post images table untuk upload gambar
export const postImages = sqliteTable('post_images', {
  id: text('id').primaryKey(),
  postId: text('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  url: text('url').notNull(), // R2 public URL
  width: integer('width'),
  height: integer('height'),
  idx: integer('idx').default(0), // urutan gambar 0-3
});

// Likes table
export const likes = sqliteTable(
  'likes',
  {
    id: text('id').primaryKey(),
    postId: text('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    uniqueLike: primaryKey({ columns: [table.postId, table.userId] }), // satu like per user per post
  }),
);

// Comments table
export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  postId: text('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  parentId: text('parent_id'),
});

// ===== RELATIONS =====

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(user, {
    fields: [posts.authorId],
    references: [user.id],
  }),
  shareParent: one(posts, {
    fields: [posts.shareParentId],
    references: [posts.id],
    relationName: 'shareParent',
  }),
  shares: many(posts, {
    relationName: 'shareParent',
  }),
  images: many(postImages),
  likes: many(likes),
  comments: many(comments),
}));

export const postImagesRelations = relations(postImages, ({ one }) => ({
  post: one(posts, {
    fields: [postImages.postId],
    references: [posts.id],
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
  user: one(user, {
    fields: [likes.userId],
    references: [user.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  user: one(user, {
    fields: [comments.userId],
    references: [user.id],
  }),
  parentComment: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'parentComment',
  }),
  replies: many(comments, {
    relationName: 'parentComment',
  }),
}));

// ===== TYPES =====
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type PostWithAuthor = Post & {
  author: { id: string; name: string; avatarUrl: string | null };
  images: Array<{
    id: string;
    url: string;
    width: number | null;
    height: number | null;
    idx: number | null;
  }>;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  shareParent?: (Post & { author: { name: string } }) | null;
};

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type CommentWithAuthor = Comment & {
  author: { id: string; name: string; avatarUrl: string | null };
};

export type PostImage = typeof postImages.$inferSelect;
export type NewPostImage = typeof postImages.$inferInsert;
