import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FHEEncryption } from '../../src/lib/fhe-encryption';

// Mock FHE library
vi.mock('@fhevm/solidity/lib/FHE.sol', () => ({
  FHE: {
    asEuint32: vi.fn((value: number) => ({ value, encrypted: true })),
    fromExternal: vi.fn((external: any) => ({ value: external.value, encrypted: true })),
    add: vi.fn((a: any, b: any) => ({ value: a.value + b.value, encrypted: true })),
    decrypt: vi.fn((encrypted: any) => encrypted.value)
  }
}));

describe('FHE Encryption', () => {
  let cardStats: any;

  beforeEach(() => {
    cardStats = {
      attack: 100,
      defense: 80,
      health: 120,
      mana: 50,
      rarity: 3
    };
  });

  describe('encryptCardStats', () => {
    it('should encrypt card statistics correctly', async () => {
      const encryptedStats = await FHEEncryption.encryptCardStats(cardStats);

      expect(encryptedStats.attack).toBeDefined();
      expect(encryptedStats.defense).toBeDefined();
      expect(encryptedStats.health).toBeDefined();
      expect(encryptedStats.mana).toBeDefined();
      expect(encryptedStats.rarity).toBeDefined();

      expect(encryptedStats.attack.encrypted).toBe(true);
      expect(encryptedStats.defense.encrypted).toBe(true);
      expect(encryptedStats.health.encrypted).toBe(true);
      expect(encryptedStats.mana.encrypted).toBe(true);
      expect(encryptedStats.rarity.encrypted).toBe(true);
    });

    it('should handle invalid input gracefully', async () => {
      const invalidStats = {
        attack: -1,
        defense: 'invalid',
        health: null,
        mana: undefined,
        rarity: 0
      };

      await expect(FHEEncryption.encryptCardStats(invalidStats)).rejects.toThrow();
    });
  });

  describe('decryptCardStats', () => {
    it('should decrypt card statistics correctly', async () => {
      const encryptedStats = await FHEEncryption.encryptCardStats(cardStats);
      const decryptedStats = await FHEEncryption.decryptCardStats(encryptedStats);

      expect(decryptedStats.attack).toBe(cardStats.attack);
      expect(decryptedStats.defense).toBe(cardStats.defense);
      expect(decryptedStats.health).toBe(cardStats.health);
      expect(decryptedStats.mana).toBe(cardStats.mana);
      expect(decryptedStats.rarity).toBe(cardStats.rarity);
    });

    it('should handle corrupted encrypted data', async () => {
      const corruptedData = {
        attack: { value: null, encrypted: true },
        defense: { value: undefined, encrypted: true },
        health: { value: 'invalid', encrypted: true },
        mana: { value: -1, encrypted: true },
        rarity: { value: 0, encrypted: true }
      };

      await expect(FHEEncryption.decryptCardStats(corruptedData)).rejects.toThrow();
    });
  });

  describe('encryptGameMove', () => {
    it('should encrypt game move data', async () => {
      const gameMove = {
        cardId: 'card-123',
        targetId: 'target-456',
        action: 'attack',
        value: 50
      };

      const encryptedMove = await FHEEncryption.encryptGameMove(gameMove);

      expect(encryptedMove.cardId).toBe(gameMove.cardId);
      expect(encryptedMove.targetId).toBe(gameMove.targetId);
      expect(encryptedMove.action).toBe(gameMove.action);
      expect(encryptedMove.value.encrypted).toBe(true);
    });
  });

  describe('encryptTradeData', () => {
    it('should encrypt trade data', async () => {
      const tradeData = {
        cardId: 'card-123',
        price: 0.1,
        seller: '0x123...',
        buyer: '0x456...'
      };

      const encryptedTrade = await FHEEncryption.encryptTradeData(tradeData);

      expect(encryptedTrade.cardId).toBe(tradeData.cardId);
      expect(encryptedTrade.seller).toBe(tradeData.seller);
      expect(encryptedTrade.buyer).toBe(tradeData.buyer);
      expect(encryptedTrade.price.encrypted).toBe(true);
    });
  });

  describe('validateEncryptedData', () => {
    it('should validate encrypted data structure', () => {
      const validEncryptedData = {
        attack: { value: 100, encrypted: true },
        defense: { value: 80, encrypted: true }
      };

      expect(FHEEncryption.validateEncryptedData(validEncryptedData)).toBe(true);
    });

    it('should reject invalid encrypted data', () => {
      const invalidEncryptedData = {
        attack: { value: 100, encrypted: false },
        defense: { value: 80, encrypted: true }
      };

      expect(FHEEncryption.validateEncryptedData(invalidEncryptedData)).toBe(false);
    });
  });
});
