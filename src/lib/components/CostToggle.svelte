<script lang="ts">
	interface CostEstimate {
		per10: number;
		per100: number;
		per1k: number;
		per10k: number;
	}

	let { costEstimates }: { costEstimates: CostEstimate } = $props();

	let selectedScale: 'per10' | 'per100' | 'per1k' | 'per10k' = $state('per100');

	const scales = [
		{ key: 'per10' as const, label: 'Per 10', count: 10 },
		{ key: 'per100' as const, label: 'Per 100', count: 100 },
		{ key: 'per1k' as const, label: 'Per 1K', count: 1000 },
		{ key: 'per10k' as const, label: 'Per 10K', count: 10000 }
	];
</script>

<div class="space-y-6">
	<!-- Toggle Buttons -->
	<div role="group" aria-label="Cost scale selector" class="flex flex-wrap gap-2">
		{#each scales as scale (scale.key)}
			<button
				on:click={() => {
					selectedScale = scale.key;
				}}
				aria-pressed={selectedScale === scale.key}
				class="rounded-lg border px-4 py-2 text-sm font-medium transition-colors {selectedScale ===
				scale.key
					? 'border-zinc-400 bg-zinc-400 text-zinc-900'
					: 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-600'}"
			>
				{scale.label}
			</button>
		{/each}
	</div>

	<!-- Cost Display -->
	<div class="rounded-lg border border-zinc-700 bg-zinc-900 p-6">
		<div class="mb-2 text-sm text-zinc-400">
			Estimated cost for {scales.find((s) => s.key === selectedScale)?.count.toLocaleString()} requests:
		</div>
		<div class="mb-4">
			<div class="text-4xl font-bold text-zinc-100">
				${(costEstimates[selectedScale] / 100).toFixed(2)}
			</div>
			<div class="text-xs text-zinc-500">USD</div>
		</div>

		<div class="border-t border-zinc-700 pt-4">
			<div class="text-xs font-semibold tracking-wider text-zinc-400 uppercase">Breakdown</div>
			<div class="mt-3 space-y-2 text-xs text-zinc-300">
				<div class="flex justify-between">
					<span>Estimated per request</span>
					<span
						>${(
							costEstimates[selectedScale] /
							100 /
							(scales.find((s) => s.key === selectedScale)?.count ?? 1)
						).toFixed(4)}</span
					>
				</div>
			</div>
		</div>
	</div>
</div>
