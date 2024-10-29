import {createEnv} from '@t3-oss/env-nextjs';
import {z} from 'zod';

export const env = createEnv({
	server: {
		NODE_ENV: z.enum(['development', 'test', 'production']),
		DATABASE_URL: z.string(),
		AUTH_GITHUB_ID: z.string(),
		AUTH_GITHUB_SECRET: z.string(),
		AUTH_GOOGLE_CLIENT_ID: z.string(),
		AUTH_GOOGLE_CLIENT_SECRET: z.string(),
		OPENAI_API_KEY: z.string(),
		UPSTASH_REDIS_REST_URL: z.string(),
		UPSTASH_REDIS_REST_TOKEN: z.string(),
		ELEVENLABS_API_KEY: z.string(),
		REPLICATE_API_TOKEN: z.string(),
	},
	client: {
		NEXT_PUBLIC_BETTER_AUTH_URL: z.string(),
	},
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		DATABASE_URL: process.env.DATABASE_URL,
		AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
		AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
		AUTH_GOOGLE_CLIENT_ID: process.env.AUTH_GOOGLE_CLIENT_ID,
		AUTH_GOOGLE_CLIENT_SECRET: process.env.AUTH_GOOGLE_CLIENT_SECRET,
		NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
		UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
		ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
		REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
	},
});
