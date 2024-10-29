import {
	boolean,
	jsonb,
	pgTableCreator,
	real,
	serial,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';

export const pgTable = pgTableCreator((name) => `${'short'}_${name}`);

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('emailVerified').notNull(),
	image: text('image'),
	createdAt: timestamp('createdAt').notNull(),
	updatedAt: timestamp('updatedAt').notNull(),
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expiresAt').notNull(),
	ipAddress: text('ipAddress'),
	userAgent: text('userAgent'),
	userId: text('userId')
		.notNull()
		.references(() => user.id),
});

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('accountId').notNull(),
	providerId: text('providerId').notNull(),
	userId: text('userId')
		.notNull()
		.references(() => user.id),
	accessToken: text('accessToken'),
	refreshToken: text('refreshToken'),
	idToken: text('idToken'),
	expiresAt: timestamp('expiresAt'),
	password: text('password'),
});

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expiresAt').notNull(),
});

export const content = pgTable('content', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID())
		.notNull(),
	userId: text('userId')
		.notNull()
		.references(() => user.id),
	prompt: text('prompt').notNull(),
	content: text('content').notNull(),
	platform: text('platform').default('tiktok').notNull(),
	style: text('style').default('default').notNull(),
	duration: real('duration').notNull().default(30),
	language: text('language').default('English').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at', {mode: 'date'}).$onUpdate(() => new Date()),
});

export const audio = pgTable('audio', {
	id: serial('id').primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => user.id),
	audioUrl: jsonb('audioUrl').notNull(),
	voice: text('voice').notNull(),
	text: text('text').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Schema for inserting - can be used to validate API requests
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
