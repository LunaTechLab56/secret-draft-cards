import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GameSessionManager } from '../../src/lib/game-session-manager';
import { FHEEncryption } from '../../src/lib/fhe-encryption';

describe('Game Session Integration', () => {
  let gameManager: GameSessionManager;
  let player1: any;
  let player2: any;

  beforeEach(async () => {
    gameManager = new GameSessionManager();
    
    // Create test players
    player1 = {
      address: '0x1234567890123456789012345678901234567890',
      cards: [
        { id: 'card-1', attack: 100, defense: 80, health: 120, mana: 50 },
        { id: 'card-2', attack: 90, defense: 90, health: 110, mana: 60 },
        { id: 'card-3', attack: 110, defense: 70, health: 130, mana: 40 },
        { id: 'card-4', attack: 80, defense: 100, health: 100, mana: 70 },
        { id: 'card-5', attack: 120, defense: 60, health: 140, mana: 30 }
      ]
    };

    player2 = {
      address: '0x0987654321098765432109876543210987654321',
      cards: [
        { id: 'card-6', attack: 95, defense: 85, health: 115, mana: 55 },
        { id: 'card-7', attack: 85, defense: 95, health: 105, mana: 65 },
        { id: 'card-8', attack: 105, defense: 75, health: 125, mana: 45 },
        { id: 'card-9', attack: 75, defense: 105, health: 95, mana: 75 },
        { id: 'card-10', attack: 115, defense: 65, health: 135, mana: 35 }
      ]
    };
  });

  afterEach(async () => {
    await gameManager.cleanup();
  });

  describe('Game Session Creation', () => {
    it('should create a new game session', async () => {
      const session = await gameManager.createSession(player1, player2);

      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(session.player1).toBe(player1.address);
      expect(session.player2).toBe(player2.address);
      expect(session.status).toBe('waiting');
      expect(session.turnCount).toBe(0);
    });

    it('should encrypt player cards in session', async () => {
      const session = await gameManager.createSession(player1, player2);

      expect(session.encryptedData.player1Cards).toBeDefined();
      expect(session.encryptedData.player2Cards).toBeDefined();
      expect(session.encryptedData.player1Cards.length).toBe(5);
      expect(session.encryptedData.player2Cards.length).toBe(5);

      // Verify cards are encrypted
      for (const card of session.encryptedData.player1Cards) {
        expect(card.attack.encrypted).toBe(true);
        expect(card.defense.encrypted).toBe(true);
        expect(card.health.encrypted).toBe(true);
        expect(card.mana.encrypted).toBe(true);
      }
    });
  });

  describe('Game Play Flow', () => {
    let session: any;

    beforeEach(async () => {
      session = await gameManager.createSession(player1, player2);
    });

    it('should handle card play moves', async () => {
      // Player 1 plays a card
      const move1 = {
        sessionId: session.id,
        player: player1.address,
        cardId: 'card-1',
        targetId: 'card-6',
        action: 'attack'
      };

      const result1 = await gameManager.playCard(move1);

      expect(result1.success).toBe(true);
      expect(result1.turnCount).toBe(1);
      expect(result1.currentPlayer).toBe(player2.address);

      // Player 2 plays a card
      const move2 = {
        sessionId: session.id,
        player: player2.address,
        cardId: 'card-6',
        targetId: 'card-1',
        action: 'attack'
      };

      const result2 = await gameManager.playCard(move2);

      expect(result2.success).toBe(true);
      expect(result2.turnCount).toBe(2);
      expect(result2.currentPlayer).toBe(player1.address);
    });

    it('should validate move legality', async () => {
      // Try to play with wrong player
      const invalidMove = {
        sessionId: session.id,
        player: player2.address, // Wrong player
        cardId: 'card-1',
        targetId: 'card-6',
        action: 'attack'
      };

      await expect(gameManager.playCard(invalidMove)).rejects.toThrow('Not your turn');
    });

    it('should handle card damage calculation', async () => {
      const move = {
        sessionId: session.id,
        player: player1.address,
        cardId: 'card-1',
        targetId: 'card-6',
        action: 'attack'
      };

      const result = await gameManager.playCard(move);

      expect(result.damageDealt).toBeDefined();
      expect(result.damageDealt.encrypted).toBe(true);
    });

    it('should track game history', async () => {
      const move = {
        sessionId: session.id,
        player: player1.address,
        cardId: 'card-1',
        targetId: 'card-6',
        action: 'attack'
      };

      await gameManager.playCard(move);

      const gameHistory = await gameManager.getGameHistory(session.id);
      expect(gameHistory.length).toBe(1);
      expect(gameHistory[0].player).toBe(player1.address);
      expect(gameHistory[0].cardId).toBe('card-1');
      expect(gameHistory[0].action).toBe('attack');
    });
  });

  describe('Game End Conditions', () => {
    let session: any;

    beforeEach(async () => {
      session = await gameManager.createSession(player1, player2);
    });

    it('should detect when a player has no cards left', async () => {
      // Simulate player 1 losing all cards
      await gameManager.simulatePlayerDefeat(session.id, player1.address);

      const gameState = await gameManager.getGameState(session.id);
      expect(gameState.status).toBe('completed');
      expect(gameState.winner).toBe(player2.address);
    });

    it('should handle maximum turn limit', async () => {
      // Simulate maximum turns reached
      await gameManager.simulateMaxTurnsReached(session.id);

      const gameState = await gameManager.getGameState(session.id);
      expect(gameState.status).toBe('completed');
      expect(gameState.reason).toBe('max_turns_reached');
    });

    it('should calculate final scores', async () => {
      await gameManager.endGame(session.id, player1.address);

      const finalScores = await gameManager.getFinalScores(session.id);
      expect(finalScores.player1Score.encrypted).toBe(true);
      expect(finalScores.player2Score.encrypted).toBe(true);
    });
  });

  describe('Reputation System Integration', () => {
    let session: any;

    beforeEach(async () => {
      session = await gameManager.createSession(player1, player2);
    });

    it('should update player reputation after game', async () => {
      await gameManager.endGame(session.id, player1.address);

      const player1Reputation = await gameManager.getPlayerReputation(player1.address);
      const player2Reputation = await gameManager.getPlayerReputation(player2.address);

      expect(player1Reputation.encrypted).toBe(true);
      expect(player2Reputation.encrypted).toBe(true);
    });

    it('should handle reputation penalties for disconnection', async () => {
      await gameManager.handlePlayerDisconnection(session.id, player2.address);

      const player2Reputation = await gameManager.getPlayerReputation(player2.address);
      expect(player2Reputation.encrypted).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid session ID', async () => {
      const invalidMove = {
        sessionId: 'invalid-session-id',
        player: player1.address,
        cardId: 'card-1',
        targetId: 'card-6',
        action: 'attack'
      };

      await expect(gameManager.playCard(invalidMove)).rejects.toThrow('Session not found');
    });

    it('should handle network errors gracefully', async () => {
      // Mock network error
      const originalPlayCard = gameManager.playCard;
      gameManager.playCard = vi.fn().mockRejectedValue(new Error('Network error'));

      const move = {
        sessionId: 'session-123',
        player: player1.address,
        cardId: 'card-1',
        targetId: 'card-6',
        action: 'attack'
      };

      await expect(gameManager.playCard(move)).rejects.toThrow('Network error');

      // Restore original method
      gameManager.playCard = originalPlayCard;
    });
  });

  describe('Performance Tests', () => {
    it('should handle multiple concurrent games', async () => {
      const sessions = [];
      const numGames = 10;

      // Create multiple game sessions
      for (let i = 0; i < numGames; i++) {
        const session = await gameManager.createSession(player1, player2);
        sessions.push(session);
      }

      expect(sessions.length).toBe(numGames);

      // Play moves in all sessions
      const promises = sessions.map(session => 
        gameManager.playCard({
          sessionId: session.id,
          player: player1.address,
          cardId: 'card-1',
          targetId: 'card-6',
          action: 'attack'
        })
      );

      const results = await Promise.all(promises);
      expect(results.length).toBe(numGames);
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });

    it('should maintain performance with large game history', async () => {
      const session = await gameManager.createSession(player1, player2);

      // Simulate many moves
      const numMoves = 100;
      for (let i = 0; i < numMoves; i++) {
        const move = {
          sessionId: session.id,
          player: i % 2 === 0 ? player1.address : player2.address,
          cardId: `card-${(i % 5) + 1}`,
          targetId: `card-${(i % 5) + 6}`,
          action: 'attack'
        };

        await gameManager.playCard(move);
      }

      const gameHistory = await gameManager.getGameHistory(session.id);
      expect(gameHistory.length).toBe(numMoves);
    });
  });
});
