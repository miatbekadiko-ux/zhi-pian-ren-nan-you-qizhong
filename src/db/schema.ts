import { pgTable, text, uuid, serial, integer, timestamp, date } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  nickname: text('nickname'),
  birthday: date('birthday'),
  language: text('language').notNull().default('zh'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const characters = pgTable('characters', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  occupation: text('occupation').notNull(),
  personality: text('personality').notNull(),
  talkStyle: text('talk_style').notNull(),
  emojiStyle: text('emoji_style').notNull(),
});

export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  characterId: text('character_id').notNull().references(() => characters.id),
  lastMessagePreview: text('last_message_preview'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // 'user' | 'assistant'
  type: text('type').notNull().default('text'), // 'text' | 'audio' | 'image'
  content: text('content').notNull(),
  audioUrl: text('audio_url'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const affection = pgTable('affection', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  characterId: text('character_id').notNull().references(() => characters.id),
  score: integer('score').notNull().default(0),
  stage: text('stage').notNull().default('陌生人'), // '陌生人'|'朋友'|'暧昧'|'恋人'
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
