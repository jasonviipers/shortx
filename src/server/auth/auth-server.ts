import {cookies} from 'next/headers';
import {auth} from '.';

export async function useAuthServer() {
	try {
		// Get cookie store
		const cookieStore = await cookies();
		const cookieHeader = cookieStore
			.getAll()
			.map((cookie) => `${cookie.name}=${cookie.value}`)
			.join('; ');

		// Create headers object with cookie
		const headersList = new Headers({
			cookie: cookieHeader,
		});

		const session = await auth.api.getSession({
			headers: headersList,
		});

		return {
			session,
			user: session?.user,
			error: null,
		};
	} catch (error) {
		console.error('Auth server error:', error);
		return {
			session: null,
			user: null,
			error: error instanceof Error ? error.message : 'Authentication error occurred',
		};
	}
}
