<script lang="ts">
	let { onSubmit, isLoading = false }: { onSubmit: (task: string) => void; isLoading?: boolean } =
		$props();
	let taskInput = $state('');
	let charCount = $derived(taskInput.length);
	let isValid = $derived(taskInput.trim().length > 0 && taskInput.length <= 2000);

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (isValid && !isLoading) {
			onSubmit(taskInput.trim());
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && isValid && !isLoading) {
			handleSubmit(e);
		}
	}
</script>

<form onsubmit={handleSubmit} class="w-full" id="task-input">
	<label for="task-description" class="mb-2 block text-lg font-semibold text-zinc-200">
		Describe what you're trying to do with AI
	</label>
	<textarea
		id="task-description"
		bind:value={taskInput}
		onkeydown={handleKeydown}
		placeholder="e.g., Build a customer support chatbot that handles refund requests and routes complex issues to human agents..."
		rows="4"
		maxlength="2000"
		aria-describedby="task-help char-count"
		class="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 placeholder-zinc-500 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
		disabled={isLoading}
	></textarea>
	<div class="mt-2 flex items-center justify-between text-sm text-zinc-500">
		<span id="task-help">Press Ctrl+Enter to submit, or click the button below.</span>
		<span id="char-count" aria-live="polite">{charCount}/2000</span>
	</div>
	<button
		type="submit"
		disabled={!isValid || isLoading}
		class="mt-4 w-full rounded-lg bg-zinc-200 px-6 py-3 text-base font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
	>
		{#if isLoading}
			<span class="inline-flex items-center gap-2">
				<span class="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-900"
				></span>
				Analyzing...
			</span>
		{:else}
			Get Recommendations
		{/if}
	</button>
</form>
