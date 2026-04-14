<script lang="ts">
	let {
		harmony
	}: {
		harmony: {
			subtask: string;
			modelId: string;
			modelName: string;
			provider: string;
			score: number;
			reasoning: string;
		};
	} = $props();
</script>

<div class="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
	<div class="mb-3 flex items-start justify-between">
		<div>
			<h3 class="text-sm font-semibold text-zinc-200">{harmony.subtask}</h3>
			<p class="text-xs text-zinc-400">{harmony.modelName} • {harmony.provider}</p>
		</div>
		<div class="text-right">
			<div class="text-lg font-bold text-zinc-300">{harmony.score}</div>
			<div class="text-xs text-zinc-500">/100</div>
		</div>
	</div>

	<p class="text-xs text-zinc-400">{harmony.reasoning}</p>
</div>
