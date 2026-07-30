<script lang="ts">
</script>

<svelte:head>
	<title>Orchestra Melody & Harmony — AI Model Ensemble Recommender</title>
	<meta
		name="description"
		content="Free tool that recommends the best AI model ensemble for your task. Get a primary model (Melody) and supporting models (Harmony) with reasoning and cost estimates."
	/>
	<meta property="og:title" content="Orchestra Melody & Harmony" />
	<meta
		property="og:description"
		content="Find your perfect AI model ensemble. Describe your task, get model recommendations with reasoning and cost estimates."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://orchestra-melody-harmony.vercel.app" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Orchestra Melody & Harmony" />
	<meta
		name="twitter:description"
		content="Free AI model ensemble recommender with cost estimates."
	/>
	<link rel="canonical" href="https://orchestra-melody-harmony.vercel.app" />
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: 'Orchestra Melody & Harmony',
		description: 'Free AI model ensemble recommender with cost estimates',
		url: 'https://orchestra-melody-harmony.vercel.app',
		applicationCategory: 'DeveloperApplication',
		operatingSystem: 'Web',
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
		author: { '@type': 'Person', name: 'Krystal Martinez' }
	})}</script>`}
</svelte:head>

<div class="mx-auto max-w-5xl px-6 py-16">
	<!-- Hero Section -->
	<section class="mb-24 text-center">
		<h1 class="mb-6 text-4xl font-bold tracking-tight">Find Your Perfect AI Model Ensemble</h1>
		<p class="mb-8 text-xl text-zinc-300">
			Describe your task. Get a Melody (primary model) and Harmony (supporting models)
			recommendation with reasoning and cost estimates.
		</p>
		<a
			href="/recommend"
			class="inline-block rounded-lg bg-zinc-200 px-8 py-3 text-lg font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
		>
			Try it now
		</a>
	</section>

	<!-- How It Works Section -->
	<section class="mb-24">
		<h2 class="mb-12 text-center text-2xl font-semibold">How It Works</h2>
		<div class="grid gap-8 md:grid-cols-3">
			<article class="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 text-center">
				<div class="mb-4 text-4xl" aria-hidden="true">📝</div>
				<h3 class="mb-3 text-lg font-semibold">Describe Your Task</h3>
				<p class="text-zinc-400">
					Tell us what you're trying to do with AI — coding, writing, analysis, data processing, and
					more.
				</p>
			</article>

			<article class="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 text-center">
				<div class="mb-4 text-4xl" aria-hidden="true">🎵</div>
				<h3 class="mb-3 text-lg font-semibold">Get Your Ensemble</h3>
				<p class="text-zinc-400">
					Receive a Melody (primary model) and Harmony (supporting models) with detailed reasoning
					for each recommendation.
				</p>
			</article>

			<article class="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 text-center">
				<div class="mb-4 text-4xl" aria-hidden="true">💰</div>
				<h3 class="mb-3 text-lg font-semibold">See the Costs</h3>
				<p class="text-zinc-400">
					View estimated costs at 4 scales: per 10, 100, 1K, and 10K runs — so you know what to
					budget.
				</p>
			</article>
		</div>
	</section>

	<!-- Why Ensembles Section -->
	<section class="mb-24 rounded-lg border border-zinc-800 bg-zinc-900/30 p-12">
		<h2 class="mb-6 text-2xl font-semibold">Why Ensembles?</h2>
		<p class="mb-4 text-lg text-zinc-300">
			No single model excels at everything. By combining models, each specialized for different
			subtasks, you get better results at lower total cost.
		</p>
		<p class="text-zinc-400">
			Orchestra Melody & Harmony analyzes your task, identifies what matters most, and recommends
			the best ensemble for your specific needs — with full transparency into pricing and model
			capabilities.
		</p>
	</section>

	<!-- Powered By Section -->
	<section class="text-center">
		<h2 class="mb-6 text-2xl font-semibold">Powered By</h2>
		<p class="text-zinc-400">
			Updated daily with the latest models, benchmarks, and pricing from
			<a
				href="https://openrouter.ai"
				class="rounded px-1 underline hover:text-zinc-300 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
			>
				OpenRouter
			</a>
			and
			<a
				href="https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard"
				class="rounded px-1 underline hover:text-zinc-300 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
			>
				HuggingFace Open LLM Leaderboard
			</a>.
		</p>
	</section>
</div>
