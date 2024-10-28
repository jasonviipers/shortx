import {env} from '@/env';
import {db} from '@/server/db';
import * as schema from '@/server/db/schema';
import {betterAuth} from 'better-auth';
import {drizzleAdapter} from 'better-auth/adapters/drizzle';
import {cookies} from 'next/headers';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg', // or "pg" or "mysql"
		schema,
	}),
	socialProviders: {
		github: {
			clientId: env.AUTH_GITHUB_ID,
			clientSecret: env.AUTH_GITHUB_SECRET,
			callbackUrl: '/api/auth/callback/github',
		},
		google: {
			clientId: env.AUTH_GOOGLE_CLIENT_ID,
			clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
			callbackUrl: '/api/auth/callback/google',
		},
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
	},
	cookies: {
		get: async () => {
			const cookieStore = await cookies();
			return cookieStore.getAll();
		},
	},
});
