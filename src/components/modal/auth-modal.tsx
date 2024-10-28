'use client';

import {useToast} from '@/hooks/use-toast';
import {useAuthClient} from '@/server/auth/auth-client';
import {useState} from 'react';
import {Icons} from '../icons';
import {Button} from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';

export const providers = [
	{
		name: 'Google',
		icon: <Icons.google />,
		provider: 'google',
	},
	{
		name: 'GitHub',
		icon: <Icons.github />,
		provider: 'github',
	},
] as const;

export function AuthModal() {
	const [isOpen, setIsOpen] = useState(false);
	const {signIn} = useAuthClient();
	const {toast} = useToast();

	const isValidProvider = (provider: string): provider is 'google' | 'github' =>
		['google', 'github'].includes(provider);

	const handleSignIn = async (provider: (typeof providers)[number]) => {
		if (isValidProvider(provider.provider)) {
			try {
				await signIn.social({
					provider: provider.provider,
					callbackURL: '/',
				});
				toast({
					title: 'Success',
					description: 'Sign-in successful!',
					variant: 'default',
				});
				setIsOpen(false);
			} catch (error) {
				console.error('Sign-in failed:', error);
				toast({
					title: 'Error',
					description: 'Sign-in failed. Please try again.',
					variant: 'destructive',
				});
			} finally {
				setIsOpen(false);
			}
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Sign In</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Sign In</DialogTitle>
					<DialogDescription>Choose a method to sign in to your account.</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-4">
					{providers.map((provider) => (
						<Button
							variant="outline"
							key={provider.name}
							onClick={() => handleSignIn(provider)}
							className="w-full"
						>
							<span className="mr-2">{provider.icon}</span>
							Sign in with {provider.name}
						</Button>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}
