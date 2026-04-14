import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getRecommendation } from '$lib/server/engine/recommend';
import { checkRateLimit } from '$lib/utils/rateLimit';

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  // Rate limiting
  const ip = getClientAddress();
  const rateCheck = checkRateLimit(ip);
  if (rateCheck.isLimited) {
    return json(
      { error: 'Rate limit exceeded. Please try again later.', resetAt: rateCheck.resetAt },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateCheck.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rateCheck.resetAt)
        }
      }
    );
  }

  // Parse body
  let body: { task?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const task = body.task;
  if (!task || typeof task !== 'string') {
    return json({ error: 'Missing required field: task (string)' }, { status: 400 });
  }

  // Get recommendation
  try {
    const recommendation = await getRecommendation(task);

    return json(
      {
        success: true,
        recommendation: {
          task: {
            input: recommendation.task.originalInput,
            category: recommendation.task.category,
            subtasks: recommendation.task.subtasks
          },
          melody: {
            modelId: recommendation.melody.modelId,
            modelName: recommendation.melody.modelName,
            provider: recommendation.melody.provider,
            score: recommendation.melody.score,
            benchmarks: recommendation.melody.benchmarkScores,
            pricing: recommendation.melody.pricing,
            contextWindow: recommendation.melody.contextWindow,
            reasoning: recommendation.melody.reasoning
          },
          harmony: recommendation.harmony.map(h => ({
            subtask: h.subtask,
            modelId: h.modelId,
            modelName: h.modelName,
            provider: h.provider,
            score: h.score,
            reasoning: h.reasoning
          })),
          costEstimates: {
            per10: recommendation.costEstimates.per10,
            per100: recommendation.costEstimates.per100,
            per1k: recommendation.costEstimates.per1k,
            per10k: recommendation.costEstimates.per10k
          },
          overallReasoning: recommendation.overallReasoning
        }
      },
      {
        headers: {
          'X-RateLimit-Remaining': String(rateCheck.remainingRequests),
          'X-RateLimit-Reset': String(rateCheck.resetAt)
        }
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    // Distinguish user errors from server errors
    if (message.includes('cannot be empty') || message.includes('under 2000')) {
      return json({ error: message }, { status: 400 });
    }

    return json({ error: 'Failed to generate recommendation' }, { status: 500 });
  }
};
