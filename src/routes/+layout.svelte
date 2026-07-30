<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#09090b" />
</svelte:head>

<div class="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
	<nav class="border-b border-zinc-800 px-6 py-4">
		<div class="mx-auto flex max-w-5xl items-center justify-between">
			<a
				href="/"
				class="text-lg font-bold tracking-tight focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
			>
				Orchestra Melody & Harmony
			</a>
			<div class="flex gap-6 text-sm text-zinc-400">
				<a
					href="/privacy"
					class="rounded px-2 py-1 hover:text-zinc-200 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
				>
					Privacy
				</a>
				<a
					href="/terms"
					class="rounded px-2 py-1 hover:text-zinc-200 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
				>
					Terms
				</a>
			</div>
		</div>
	</nav>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="border-t border-zinc-800 px-6 py-8 text-center text-sm text-zinc-500">
		<p>
			Part of
			<a
				href="https://orchestraproduction.krystalmartinez.com"
				class="rounded px-1 underline hover:text-zinc-300 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
			>
				Orchestra Production
			</a>
		</p>
		<p class="mt-2">Built with Claude Code &mdash; Engineered by Krystal Martinez</p>
		<div class="mt-4 flex justify-center gap-6">
			<a
				href="/privacy"
				class="rounded px-2 py-1 hover:text-zinc-300 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
			>
				Privacy Policy
			</a>
			<a
				href="/terms"
				class="rounded px-2 py-1 hover:text-zinc-300 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
			>
				Terms of Use
			</a>
		</div>
	</footer>
</div>
