import {NextRequest, NextResponse} from 'next/server';
import OpenAI from 'openai';

import {PROMPT_TEMPLATE} from '@/constant/prompts';
import {env} from '@/env';
import {rateLimit} from '@/lib/redis';
import {useAuthServer} from '@/server/auth/auth-server';
import {db} from '@/server/db';
import {content} from '@/server/db/schema';

export const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY,
});

interface GenerateContentRequest {
	prompt: string;
	platform: string;
	style: string;
	duration: number;
	language?: string;
	useAI?: boolean;
}

export async function POST(req: NextRequest) {
	try {
		const {user} = await useAuthServer();
		if (!user) {
			return NextResponse.json({error: 'Unauthorized'}, {status: 401});
		}

		const identifier = user.id;
		const {success} = await rateLimit(identifier);
		if (!success) {
			return NextResponse.json(
				{error: 'Rate limit exceeded. Please try again later.'},
				{status: 429},
			);
		}

		const {
			prompt,
			platform,
			style,
			duration,
			language = 'English',
		} = (await req.json()) as GenerateContentRequest;

		if (!prompt || !platform || !style || !duration) {
			return NextResponse.json({error: 'Missing required fields'}, {status: 400});
		}

		const formattedPrompt = PROMPT_TEMPLATE.replace('{topic}', prompt)
			.replace('{platform}', platform)
			.replace('{style}', style)
			.replace('{duration}', duration.toString())
			.replace('{language}', language);

		const completion = await openai.chat.completions.create({
			model: 'gpt-4',
			messages: [
				{
					role: 'system',
					content:
						'You are a professional video script writer specializing in creating engaging social media content.',
				},
				{
					role: 'user',
					content: formattedPrompt,
				},
			],
			temperature: 0.7,
			max_tokens: 1000,
		});

		const generatedContent = completion.choices[0].message.content;
		if (!generatedContent) {
			return NextResponse.json({error: 'Failed to generate content'});
		}

		//Save into the database
		if (!user.id) {
			await db.insert(content).values({
				userId: user.id,
				prompt: prompt,
				platform: platform,
				style: style,
				duration: duration,
				language: language,
				content: generatedContent,
			});
		}
		return NextResponse.json({content: generatedContent, usage: completion.usage}, {status: 200});
	} catch (error) {
		console.error('Error generating content', error);
		if (error instanceof OpenAI.APIError) {
			return NextResponse.json({error: error.message}, {status: error.status || 500});
		}
		return NextResponse.json({error: 'Failed to generate content'}, {status: 500});
	}
}
