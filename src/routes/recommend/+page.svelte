<script lang="ts">
	import TaskInput from '$lib/components/TaskInput.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import MelodyCard from '$lib/components/MelodyCard.svelte';
	import HarmonyCard from '$lib/components/HarmonyCard.svelte';
	import CostToggle from '$lib/components/CostToggle.svelte';

	let isLoading = $state(false);
	let error = $state('');
	let recommendation = $state<any>(null);

	async function handleSubmit(task: string) {
		isLoading = true;
		error = '';
		recommendation = null;

		try {
			const res = await fetch('/api/recommend', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ task })
			});

			const data = await res.json();

			if (!res.ok) {
				error = data.error || 'Something went wrong';
				return;
			}

			recommendation = data.recommendation;
		} catch (e) {
			error = 'Network error. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Get Recommendations — Orchestra Melody & Harmony</title>
	<meta
		name="description"
		content="Describe your AI task and get model ensemble recommendations."
	/>
</svelte:head>

<div class="mx-auto max-w-5xl px-6 py-12">
	<h1 class="mb-8 text-3xl font-bold">Get Your AI Ensemble</h1>

	<TaskInput onSubmit={handleSubmit} {isLoading} />

	{#if error}
		<div class="mt-6">
			<ErrorMessage message={error} />
		</div>
	{/if}

	{#if recommendation}
		<div class="mt-10 space-y-8" aria-live="polite">
			<section>
				<h2 class="mb-2 text-sm font-medium tracking-wider text-zinc-400 uppercase">
					Task: {recommendation.task.category}
				</h2>
				<p class="text-zinc-300">{recommendation.overallReasoning}</p>
			</section>

			<section>
				<h2 class="mb-4 text-xl font-semibold">Melody — Primary Model</h2>
				<MelodyCard model={recommendation.melody} />
			</section>

			<section>
				<h2 class="mb-4 text-xl font-semibold">Harmony — Supporting Models</h2>
				<div class="space-y-4">
					{#each recommendation.harmony as h}
						<HarmonyCard harmony={h} />
					{/each}
				</div>
			</section>

			<section>
				<h2 class="mb-4 text-xl font-semibold">Cost Estimates</h2>
				<CostToggle costEstimates={recommendation.costEstimates} />
			</section>
		</div>
	{/if}
</div>
