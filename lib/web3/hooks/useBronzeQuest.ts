import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { BRONZE_QUEST_ABI } from '@/config/abis';
import {
  BRONZE_QUEST_CONFIG,
  QUEST_CONFIGS,
  QUEST_COMMON_CONFIG,
  type QuestType,
} from '@/config/bronze-quest';

// Read current round view
export function useCurView(questType: QuestType = 'bronze') {
  const questConfig = QUEST_CONFIGS[questType];

  const { data, isLoading, error, refetch } = useReadContract({
    address: questConfig.address,
    abi: BRONZE_QUEST_ABI,
    functionName: 'curView',
    chainId: QUEST_COMMON_CONFIG.CHAINS.BASE,
    query: {
      refetchInterval: 5000, // Refetch every 5 seconds to keep round data fresh
    },
  });

  return {
    round: data
      ? {
          id: Number(data[0]),
          name: data[1] as string,
          startedAt: Number(data[2]),
          endedAt: Number(data[3]),
          poolWei: data[4],
          players: Number(data[5]),
          closed: data[6] as boolean,
          isSealed: data[7] as boolean,
        }
      : null,
    isLoading,
    error,
    refetch,
  };
}

// Read time left in current round
export function useTimeLeft() {
  const { data, isLoading } = useReadContract({
    address: BRONZE_QUEST_CONFIG.address,
    abi: BRONZE_QUEST_ABI,
    functionName: 'timeLeft',
    query: {
      refetchInterval: 1000, // Update every second
    },
  });

  return {
    timeLeft: data ? Number(data) : 0,
    isLoading,
  };
}

// Read entry fee - returns the configured entry fee for the quest type
export function useEntryFee(questType: QuestType = 'bronze') {
  const questConfig = QUEST_CONFIGS[questType];

  // Return the statically configured entry fee
  // This ensures we always have the correct fee immediately without waiting for contract read
  return questConfig.entryFeeWei;
}

// Check if user joined current round
export function useJoinedCurrent(address?: `0x${string}`, questType: QuestType = 'bronze') {
  const questConfig = QUEST_CONFIGS[questType];

  const { data, refetch } = useReadContract({
    address: questConfig.address,
    abi: BRONZE_QUEST_ABI,
    functionName: 'joinedCurrent',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 3000,
    },
  });

  return { hasJoined: data || false, refetch };
}

// Read prize preview
export function usePreviewPrizes() {
  const { data } = useReadContract({
    address: BRONZE_QUEST_CONFIG.address,
    abi: BRONZE_QUEST_ABI,
    functionName: 'previewPrizes',
  });

  return data || [BigInt(0), BigInt(0), BigInt(0), BigInt(0)];
}

// Read current players
export function useCurrentPlayers(questType: QuestType = 'bronze') {
  const questConfig = QUEST_CONFIGS[questType];

  const { data, refetch } = useReadContract({
    address: questConfig.address,
    abi: BRONZE_QUEST_ABI,
    functionName: 'getPlayers',
    chainId: QUEST_COMMON_CONFIG.CHAINS.BASE,
    query: {
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  return {
    players: (data || []) as `0x${string}`[],
    refetch,
  };
}

// Write: Approve USDT for BronzeQuest
export function useApproveUSDT(questType: QuestType = 'bronze') {
  const questConfig = QUEST_CONFIGS[questType];

  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = () => {
    // Approve unlimited amount (max uint256)
    const MAX_UINT256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

    writeContract({
      address: QUEST_COMMON_CONFIG.USDT_ADDRESS,
      abi: [
        {
          name: 'approve',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          outputs: [{ name: '', type: 'bool' }],
        },
      ] as const,
      functionName: 'approve',
      args: [questConfig.address, MAX_UINT256],
    });
  };

  return {
    approve,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

// Write: Join round (requires USDT approval first)
export function useJoinRound(questType: QuestType = 'bronze') {
  const questConfig = QUEST_CONFIGS[questType];

  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const join = () => {
    writeContract({
      address: questConfig.address,
      abi: BRONZE_QUEST_ABI,
      functionName: 'join',
    });
  };

  return {
    join,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

// Check USDT allowance
export function useUSDTAllowance(ownerAddress?: `0x${string}`, questType: QuestType = 'bronze') {
  const questConfig = QUEST_CONFIGS[questType];
  const { data, refetch } = useReadContract({
    address: QUEST_COMMON_CONFIG.USDT_ADDRESS,
    abi: [
      {
        name: 'allowance',
        type: 'function',
        stateMutability: 'view',
        inputs: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' },
        ],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ] as const,
    functionName: 'allowance',
    args: ownerAddress ? [ownerAddress, questConfig.address] : undefined,
    query: {
      enabled: !!ownerAddress,
    },
  });

  return { allowance: data || BigInt(0), refetch };
}

// Read sealed round view
export function useSealedView() {
  const { data } = useReadContract({
    address: BRONZE_QUEST_CONFIG.address,
    abi: BRONZE_QUEST_ABI,
    functionName: 'sealedView',
  });

  if (!data || !data[0]) return null;

  return {
    exists: data[0] as boolean,
    id: Number(data[1]),
    startedAt: Number(data[2]),
    endedAt: Number(data[3]),
    poolWei: data[4],
    players: Number(data[5]),
    closed: data[6] as boolean,
  };
}

// Read round deadline
export function useRoundDeadline() {
  const { data } = useReadContract({
    address: BRONZE_QUEST_CONFIG.address,
    abi: BRONZE_QUEST_ABI,
    functionName: 'roundDeadline',
  });

  return data ? Number(data) : 0;
}

// Read user's contribution to current round
export function useUserContribution(address?: `0x${string}`, questType: QuestType = 'bronze') {
  const questConfig = QUEST_CONFIGS[questType];
  const { hasJoined } = useJoinedCurrent(address, questType);

  // If user has joined the round, return their contribution
  if (hasJoined) {
    return questConfig.entryFeeWei;
  }

  return BigInt(0);
}

// Read USDT balance of user
export function useUSDTBalance(address?: `0x${string}`) {
  const { data, refetch } = useReadContract({
    address: QUEST_COMMON_CONFIG.USDT_ADDRESS,
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ] as const,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  return { balance: data || BigInt(0), refetch };
}
