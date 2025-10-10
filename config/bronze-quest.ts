// Quest Lottery Contracts Configuration

export type QuestType = 'bronze' | 'silver' | 'gold' | 'crystal';

export const QUEST_CONFIGS = {
  bronze: {
    address: '0xAB494bB36e53815b9780196F7354902d392efcae' as `0x${string}`,
    entryFeeWei: BigInt('1000000'), // 1 USDT (6 decimals)
    name: 'Bronze Quest',
  },
  silver: {
    address: '0x271Bd46430F7060E13E3f69021df4d37317fa227' as `0x${string}`,
    entryFeeWei: BigInt('2000000'), // 2 USDT (6 decimals)
    name: 'Silver Quest',
  },
  gold: {
    address: '0x4d9E8a416576Fd56C723eff6C9200e3330c5d3d4' as `0x${string}`,
    entryFeeWei: BigInt('5000000'), // 5 USDT (6 decimals)
    name: 'Gold Quest',
  },
  crystal: {
    address: '0x960d2d412ed19DaD39037D2334891AeBd660a32e' as `0x${string}`,
    entryFeeWei: BigInt('10000000'), // 10 USDT (6 decimals)
    name: 'Crystal Quest',
  },
} as const;

// Common configuration for all quests
export const QUEST_COMMON_CONFIG = {
  // Game constants
  MAX_PLAYERS: 20,
  INTERVAL_SEC: 600, // 10 minutes
  MIN_PLAYERS: 4,

  // Prize distribution percentages
  PRIZES: {
    FIRST: 55,   // 55%
    SECOND: 20,  // 20%
    THIRD: 15,   // 15%
    FOURTH: 10,  // 10%
  },

  // Supported chains
  CHAINS: {
    BASE: 8453,
  },

  // USDT Token address on Base
  USDT_ADDRESS: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2' as `0x${string}`,
} as const;

// Legacy export for backward compatibility
export const BRONZE_QUEST_CONFIG = {
  address: QUEST_CONFIGS.bronze.address,
  ...QUEST_COMMON_CONFIG,
  ENTRY_FEE_WEI: QUEST_CONFIGS.bronze.entryFeeWei,
} as const;