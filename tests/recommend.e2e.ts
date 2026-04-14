import { test, expect } from '@playwright/test';

test.describe('Recommendation flow', () => {
	test('shows task input form', async ({ page }) => {
		await page.goto('/recommend');
		await expect(page.getByLabel(/describe what you/i)).toBeVisible();
		await expect(page.getByRole('button', { name: /get recommendations/i })).toBeVisible();
	});

	test('submits task and shows results', async ({ page }) => {
		await page.goto('/recommend');
		await page.getByLabel(/describe what you/i).fill('Write a Python function to sort a list');
		await page.getByRole('button', { name: /get recommendations/i }).click();
		// Wait for results (may need to mock API or seed DB)
		await expect(page.getByText(/melody/i)).toBeVisible({ timeout: 10000 });
		await expect(page.getByText(/harmony/i)).toBeVisible();
	});

	test('shows error for empty input', async ({ page }) => {
		await page.goto('/recommend');
		// Button should be disabled when input is empty
		const button = page.getByRole('button', { name: /get recommendations/i });
		await expect(button).toBeDisabled();
	});
});
