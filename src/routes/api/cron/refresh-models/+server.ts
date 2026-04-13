/**
 * Vercel Cron Job Handler
 * Called daily to refresh model data from OpenRouter and HuggingFace
 * Endpoint: GET /api/cron/refresh-models
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { refreshModelData } from '$lib/server/data/refresh';

export const GET: RequestHandler = async ({ request }) => {
	// Verify Vercel cron authorization
	const authHeader = request.headers.get('authorization');
	const vercelCronSecret = process.env.VERCEL_CRON_SECRET;

	if (!vercelCronSecret || authHeader !== `Bearer ${vercelCronSecret}`) {
		return json(
			{ error: 'Unauthorized' },
			{
				status: 401
			}
		);
	}

	try {
		const result = await refreshModelData();

		return json(result, {
			status: result.success ? 200 : 500
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return json(
			{ error: errorMessage },
			{
				status: 500
			}
		);
	}
};
