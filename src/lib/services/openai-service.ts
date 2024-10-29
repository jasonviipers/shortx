interface TTSOptions {
	text: string;
	voice: string;
	userId: string;
}

const tts = async (options: TTSOptions) => {
	try {
		const response = await fetch('/api/generate-tts/openai', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(options),
		});

		if (!response.ok) {
			throw new Error(
				`Something went wrong while generating TTS:{\n${response.status} \n${response.statusText}}`,
			);
		}

		const data = await response.json();
		return data.audioUrl;
	} catch (error) {
		if (error instanceof TypeError && error.message.includes('Network request failed')) {
			console.error('Network error: Please check your internet connection and try again.');
		} else {
			console.error('Error generating TTS:', error);
		}
		return null;
	}
};

interface generateTextOptions {
	prompt: string;
	platform: string;
	style: string;
	duration: number;
	userId: string;
	language: string;
	useAI?: boolean;
}

const generateText = async (options: generateTextOptions) => {
	try {
		const response = await fetch('/api/generate-content', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(options),
		});

		if (!response.ok) {
			throw new Error(
				`Something went wrong while generating text:{\n${response.status} \n${response.statusText}}`,
			);
		}

		const data = await response.json();
		return data.text;
	} catch (error) {
		if (error instanceof TypeError && error.message.includes('Network request failed')) {
			console.error('Network error: Please check your internet connection and try again.');
		} else {
			console.error('Error generating text:', error);
		}
		return null;
	}
};

const getImagePromptFromScript = (_script: string) => {};

export default {
	tts,
	generateText,
	getImagePromptFromScript,
} as const;
