import {NextRequest, NextResponse} from 'next/server';
import Replicate from 'replicate';

import {env} from '@/env';
import {useAuthServer} from '@/server/auth/auth-server';
import {aspectRatio} from '@/types';

const replicate = new Replicate({
	auth: env.REPLICATE_API_TOKEN,
});

interface RequestBody {
	prompt: string;
	platform: keyof typeof aspectRatio;
	selectedRatio: string;
	width?: number;
	height?: number;
}

interface AspectRatioConfig {
	width: number;
	height: number;
}

// Helper function to calculate dimensions based on aspect ratio
function calculateDimensions(ratio: string, maxDimension: number = 1024): AspectRatioConfig {
	const [width, height] = ratio.split(':').map(Number);
	const aspectRatio = width / height;

	if (aspectRatio > 1) {
		// Landscape
		return {
			width: maxDimension,
			height: Math.round(maxDimension / aspectRatio),
		};
	} else {
		// Portrait or square
		return {
			width: Math.round(maxDimension * aspectRatio),
			height: maxDimension,
		};
	}
}

// Validate if the selected ratio is valid for the platform
function validateAspectRatio(platform: keyof typeof aspectRatio, selectedRatio: string): boolean {
	return aspectRatio[platform].includes(selectedRatio);
}

export async function POST(req: NextRequest) {
	try {
		const {user} = await useAuthServer();
		if (!user) {
			return NextResponse.json({error: 'Unauthorized'}, {status: 401});
		}
		const {prompt, platform, selectedRatio, width, height} = (await req.json()) as RequestBody;
		if (!prompt || !platform || !selectedRatio) {
			return NextResponse.json(
				{error: 'Please provide prompt, platform, and aspect ratio'},
				{status: 400},
			);
		}

		// Validate if the selected ratio is valid for the platform
		if (!validateAspectRatio(platform, selectedRatio)) {
			return NextResponse.json(
				{error: `Invalid aspect ratio ${selectedRatio} for platform ${platform}`},
				{status: 400},
			);
		}

		// Calculate dimensions
		let dimensions: AspectRatioConfig;
		if (width && height) {
			dimensions = {width, height};
		} else {
			dimensions = calculateDimensions(selectedRatio);
		}

		const input = {
			prompt: prompt,
			width: dimensions.width,
			height: dimensions.height,
			num_outputs: 1,
			scheduler: 'K_EULER',
			num_inference_steps: 4,
			guidance_scale: 0,
			negative_prompt: 'worst quality, low quality',
		};

		const model =
			'bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637';
		const output = await replicate.run(model, {input});

		// Save the generated images to the  cloud Storage or database

		return NextResponse.json({result: output}, {status: 200});
	} catch (error) {
		console.error('Error generating image:', error);
		if (error instanceof Error) {
			return NextResponse.json(
				{error: 'Failed to generate image', details: error.message},
				{status: 500},
			);
		}
		return NextResponse.json(
			{error: 'Failed to generate image', details: 'An unknown error occurred'},
			{status: 500},
		);
	}
}
