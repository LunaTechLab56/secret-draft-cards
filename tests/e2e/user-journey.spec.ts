import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should complete full user onboarding and gameplay', async ({ page }) => {
    // Step 1: Connect wallet
    await test.step('Connect wallet', async () => {
      await page.click('[data-testid="connect-wallet"]');
      await page.waitForSelector('[data-testid="wallet-connected"]', { timeout: 10000 });
      await expect(page.locator('[data-testid="wallet-address"]')).toBeVisible();
    });

    // Step 2: Create first card
    await test.step('Create first card', async () => {
      await page.click('[data-testid="create-card-button"]');
      await page.fill('[data-testid="card-name-input"]', 'My First Card');
      await page.fill('[data-testid="card-description-input"]', 'A powerful card for beginners');
      
      // Upload card image
      await page.setInputFiles('[data-testid="card-image-input"]', 'tests/fixtures/card-image.png');
      
      // Set encrypted stats (simulated)
      await page.click('[data-testid="set-attack"]');
      await page.fill('[data-testid="attack-value"]', '100');
      
      await page.click('[data-testid="set-defense"]');
      await page.fill('[data-testid="defense-value"]', '80');
      
      await page.click('[data-testid="set-health"]');
      await page.fill('[data-testid="health-value"]', '120');
      
      await page.click('[data-testid="set-mana"]');
      await page.fill('[data-testid="mana-value"]', '50');
      
      await page.click('[data-testid="set-rarity"]');
      await page.selectOption('[data-testid="rarity-select"]', 'rare');
      
      // Submit card creation
      await page.click('[data-testid="submit-card"]');
      await page.waitForSelector('[data-testid="card-created-success"]', { timeout: 15000 });
    });

    // Step 3: View card collection
    await test.step('View card collection', async () => {
      await page.click('[data-testid="view-collection"]');
      await expect(page.locator('[data-testid="card-collection"]')).toBeVisible();
      await expect(page.locator('[data-testid="card-item"]')).toHaveCount(1);
    });

    // Step 4: Find opponent and start game
    await test.step('Find opponent and start game', async () => {
      await page.click('[data-testid="play-game"]');
      await page.click('[data-testid="find-opponent"]');
      
      // Wait for matchmaking
      await page.waitForSelector('[data-testid="searching-for-opponent"]');
      await page.waitForSelector('[data-testid="opponent-found"]', { timeout: 30000 });
      
      // Select cards for game
      await page.click('[data-testid="select-card-0"]');
      await page.click('[data-testid="select-card-1"]');
      await page.click('[data-testid="select-card-2"]');
      await page.click('[data-testid="select-card-3"]');
      await page.click('[data-testid="select-card-4"]');
      
      await page.click('[data-testid="confirm-selection"]');
      await page.waitForSelector('[data-testid="game-started"]');
    });

    // Step 5: Play the game
    await test.step('Play the game', async () => {
      // Wait for turn
      await page.waitForSelector('[data-testid="your-turn"]');
      
      // Play a card
      await page.click('[data-testid="play-card-0"]');
      await page.click('[data-testid="target-opponent-card-0"]');
      await page.click('[data-testid="confirm-move"]');
      
      // Wait for opponent's turn
      await page.waitForSelector('[data-testid="opponent-turn"]');
      await page.waitForSelector('[data-testid="your-turn"]', { timeout: 30000 });
      
      // Play another card
      await page.click('[data-testid="play-card-1"]');
      await page.click('[data-testid="target-opponent-card-1"]');
      await page.click('[data-testid="confirm-move"]');
      
      // Continue until game ends
      await page.waitForSelector('[data-testid="game-ended"]', { timeout: 120000 });
    });

    // Step 6: View game results
    await test.step('View game results', async () => {
      await expect(page.locator('[data-testid="game-result"]')).toBeVisible();
      const winner = await page.textContent('[data-testid="game-winner"]');
      expect(winner).toBeDefined();
      
      // View detailed results
      await page.click('[data-testid="view-details"]');
      await expect(page.locator('[data-testid="game-details"]')).toBeVisible();
    });

    // Step 7: Check reputation update
    await test.step('Check reputation update', async () => {
      await page.click('[data-testid="view-profile"]');
      await expect(page.locator('[data-testid="reputation-score"]')).toBeVisible();
      
      const reputation = await page.textContent('[data-testid="reputation-score"]');
      expect(parseInt(reputation || '0')).toBeGreaterThan(0);
    });

    // Step 8: Create trade offer
    await test.step('Create trade offer', async () => {
      await page.click('[data-testid="trading-section"]');
      await page.click('[data-testid="create-trade-offer"]');
      
      // Select card to trade
      await page.click('[data-testid="select-trade-card"]');
      await page.selectOption('[data-testid="trade-card-select"]', '0');
      
      // Set price
      await page.fill('[data-testid="trade-price"]', '0.1');
      
      // Create offer
      await page.click('[data-testid="create-offer"]');
      await page.waitForSelector('[data-testid="offer-created"]');
    });

    // Step 9: View marketplace
    await test.step('View marketplace', async () => {
      await page.click('[data-testid="marketplace"]');
      await expect(page.locator('[data-testid="marketplace-list"]')).toBeVisible();
      await expect(page.locator('[data-testid="trade-offer"]')).toHaveCount(1);
    });
  });

  test('should handle wallet disconnection gracefully', async ({ page }) => {
    // Connect wallet first
    await page.click('[data-testid="connect-wallet"]');
    await page.waitForSelector('[data-testid="wallet-connected"]');
    
    // Disconnect wallet
    await page.click('[data-testid="disconnect-wallet"]');
    await page.waitForSelector('[data-testid="wallet-disconnected"]');
    
    // Verify user is redirected to connection page
    await expect(page.locator('[data-testid="connect-wallet"]')).toBeVisible();
    await expect(page.locator('[data-testid="wallet-connected"]')).not.toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network error
    await page.route('**/api/**', route => route.abort());
    
    await page.click('[data-testid="connect-wallet"]');
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Network error');
  });

  test('should validate card creation form', async ({ page }) => {
    await page.click('[data-testid="connect-wallet"]');
    await page.waitForSelector('[data-testid="wallet-connected"]');
    
    await page.click('[data-testid="create-card-button"]');
    
    // Try to submit without filling required fields
    await page.click('[data-testid="submit-card"]');
    
    // Should show validation errors
    await expect(page.locator('[data-testid="validation-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="validation-error"]')).toContainText('Card name is required');
  });
});
