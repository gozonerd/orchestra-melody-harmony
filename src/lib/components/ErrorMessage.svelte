<script lang="ts">
	let { message }: { message: string } = $props();
</script>

<div role="alert" class="rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-200">
	<p><strong>Error:</strong> {message}</p>
</div>
