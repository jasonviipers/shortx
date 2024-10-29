import {type NextRequest, NextResponse} from 'next/server';
import OpenAI from 'openai';

import {openai} from '@/app/api/generate-content/route';
import {rateLimit} from '@/lib/redis';
import {useAuthServer} from '@/server/auth/auth-server';
import {db} from '@/server/db';
import {audio} from '@/server/db/schema';
import {Voice} from '@/types';

interface GenerateSpeechRequest {
	text: string;
	voice: Voice;
}

export async function POST(request: NextRequest) {
	try {
		const {user} = await useAuthServer();
		if (!user) {
			return NextResponse.json({error: 'Unauthorized'}, {status: 401});
		}

		const identifier = user.id;
		const {success} = await rateLimit(identifier);

		if (!success) {
			return NextResponse.json({error: 'Rate limit exceeded'}, {status: 429});
		}

		const {text, voice} = (await request.json()) as GenerateSpeechRequest;
		if (!text || !voice) {
			return NextResponse.json({error: 'Missing required parameters'}, {status: 400});
		}

		if (text.length > 4096) {
			return NextResponse.json(
				{error: 'Text exceeds maximum length of 4096 characters'},
				{status: 400},
			);
		}

		const response = await openai.audio.speech.create({
			model: 'tts-1',
			voice: voice,
			input: text,
		});

		if (response.status !== 200) {
			return NextResponse.json({error: 'Failed to generate speech'}, {status: 500});
		}

		const audioBuffer = await response.arrayBuffer();
		const audioBlob = new Blob([audioBuffer], {type: 'audio/mpeg'});
		const audioUrl = URL.createObjectURL(audioBlob);

		//Save into the database
		if (!user.id) {
			await db.insert(audio).values({
				userId: user.id,
				text: text,
				voice: voice,
				audioUrl: audioUrl,
			});
		}

		return NextResponse.json({audioUrl}, {status: 200});
	} catch (error) {
		console.error('Error generating speech', error);
		if (error instanceof OpenAI.APIError) {
			return NextResponse.json({error: error.message}, {status: error.status || 500});
		}
		return NextResponse.json({error: 'Failed to generate speech'}, {status: 500});
	}
}
