import {env} from '@/env';
import {createAuthClient} from 'better-auth/client';

export const useAuthClient = () => {
	const auth = createAuthClient({
		baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
	});
	return auth;
};
