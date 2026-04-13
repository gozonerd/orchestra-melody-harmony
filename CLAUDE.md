# Orchestra Melody & Harmony

**Owner:** Krystal Martinez / Stahl Systems
**Type:** Public web application (SvelteKit, Vercel)
**Purpose:** Free web app that recommends AI model ensembles by task. Lead magnet for Orchestra Production.

## Product Definition

Users describe what they're trying to do with AI, and the app recommends:
- **Melody** — Primary model best suited to the overall task
- **Harmony** — Supporting models by subtask with reasoning
- **Cost estimates** at 4 scales: per 10, per 100, per 1,000, per 10,000 runs

Data refreshes daily from OpenRouter API + HuggingFace Open LLM Leaderboard.

## Tech Stack

- **Framework:** SvelteKit + Svelte 5
- **Hosting:** Vercel (free tier)
- **Benchmark data:** Turso (edge SQLite)
- **Data refresh:** Vercel Cron (daily)
- **Recommendation engine:** Rule-based scoring (no LLM calls — deterministic, fast, free)
- **UI:** Tailwind CSS 4
- **Testing:** Vitest + Playwright
- **CI/CD:** GitHub Actions (lint > type-check > unit tests > build > integration tests > SAST Semgrep > npm audit > Gitleaks > preview deploy > E2E > Lighthouse CI > production deploy)
- **Monitoring:** Vercel Analytics + Sentry

## Critical Constraints

- **No auth in MVP** — Free tier only, no user accounts, no saved configs
- **No floating point for costs** — Use integer cents always
- **Rate limiting on all API routes** — Per-IP limiting (free tier abuse prevention)
- **WCAG 2.1 AA compliance** — Built in at every UI stage, zero violations
- **Lighthouse targets:** ≥95 Performance, ≥95 Accessibility, ≥95 SEO, ≥95 Best Practices
- **Coverage targets:** TARGET 100% line/branch, MIN GATE 80% line/70% branch
- **Enterprise standards:** OWASP Web Top 10, CWE Top 25, CERT secure coding

## File Naming

Standard Stahl Systems pattern: `[PREFIX_][Description]_YYYY-MM-DD_vXX_[suffix].[ext]`

No PREFIX for this repo's internal files.

## Retrieval Index

Not yet established — will be created when needed.
