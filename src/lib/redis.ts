import {env} from '@/env';
import {Redis} from '@upstash/redis';

const redis = new Redis({
	url: env.UPSTASH_REDIS_REST_URL,
	token: env.UPSTASH_REDIS_REST_TOKEN,
});

export async function rateLimit(identifier: string, limit: number = 10, window: number = 60 * 60) {
	const key = `rate-limit:${identifier}`;
	try {
		const req = await redis.incr(key);
		if (req === 1) {
			await redis.expire(key, window);
		}

		if (req > limit) {
			return {success: false, remaining: 0};
		}

		const remaining = Math.max(0, limit - req);
		return {success: true, remaining};
	} catch (error) {
		console.error('Rate limiting error:', error);
		return {success: true, remaining: 1};
	}
}
