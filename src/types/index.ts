export type Voice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export type Language =
	| 'English'
	| 'Spanish'
	| 'French'
	| 'German'
	| 'Italian'
	| 'Japanese'
	| 'Korean'
	| 'Portuguese'
	| 'Russian'
	| 'Chinese';

export type aspectRatioType = {
	[key: string]: string[];
};
export const aspectRatio = {
	tiktok: ['9:16'],
	instagram: ['9:16', '4:5', '1:1'],
	youtube: ['16:9', '9:16'],
};
