<script lang="ts">
	interface BenchmarkScores {
		coding?: number;
		reasoning?: number;
		math?: number;
		chat?: number;
		vision?: number;
	}

	let {
		model
	}: {
		model: {
			modelId: string;
			modelName: string;
			provider: string;
			score: number;
			benchmarks: BenchmarkScores;
			pricing: { input: string; output: string };
			contextWindow: number;
			reasoning: string;
		};
	} = $props();

	const benchmarkNames: Record<string, string> = {
		coding: 'Coding',
		reasoning: 'Reasoning',
		math: 'Math',
		chat: 'Chat',
		vision: 'Vision'
	};

	const activeBenchmarks = $derived(
		Object.entries(model.benchmarks)
			.filter(([_, value]) => value !== null && value !== undefined)
			.slice(0, 5)
	);
</script>

<div class="rounded-lg border border-zinc-700 bg-zinc-900 p-6">
	<!-- Header -->
	<div class="mb-4 flex items-start justify-between">
		<div>
			<h3 class="text-xl font-semibold text-zinc-100">{model.modelName}</h3>
			<p class="text-sm text-zinc-400">{model.provider}</p>
		</div>
		<div class="text-right">
			<div class="text-3xl font-bold text-zinc-200">{model.score}</div>
			<div class="text-xs text-zinc-500">/100</div>
		</div>
	</div>

	<!-- Score Bar -->
	<div class="mb-6 h-2 overflow-hidden rounded-full bg-zinc-800">
		<div
			class="h-full bg-zinc-300 transition-all duration-500"
			style={`width: ${model.score}%`}
		></div>
	</div>

	<!-- Reasoning -->
	<p class="mb-6 text-sm text-zinc-300">{model.reasoning}</p>

	<!-- Benchmarks Grid -->
	{#if activeBenchmarks.length > 0}
		<div class="mb-6">
			<h4 class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
				Key Benchmarks
			</h4>
			<div class="grid grid-cols-2 gap-3 md:grid-cols-3">
				{#each activeBenchmarks as [key, value]}
					<div class="rounded-lg bg-zinc-800/50 px-3 py-2 text-center">
						<div class="text-xs text-zinc-400">{benchmarkNames[key]}</div>
						<div class="text-sm font-semibold text-zinc-200">{value?.toFixed(1) ?? '—'}</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Pricing -->
	<div class="mb-4 border-t border-zinc-700 pt-4">
		<h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">Pricing</h4>
		<div class="flex gap-4">
			<div>
				<div class="text-xs text-zinc-500">Input</div>
				<div class="text-sm font-semibold text-zinc-200">${model.pricing.input}/M</div>
			</div>
			<div>
				<div class="text-xs text-zinc-500">Output</div>
				<div class="text-sm font-semibold text-zinc-200">${model.pricing.output}/M</div>
			</div>
		</div>
	</div>

	<!-- Context Window -->
	<div class="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2 text-sm">
		<span class="text-zinc-400">Context Window</span>
		<span class="font-semibold text-zinc-200">{model.contextWindow.toLocaleString()} tokens</span>
	</div>
</div>
