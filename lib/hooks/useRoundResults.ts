import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { isRoundViewed } from '../utils/roundResults';

interface RoundResult {
  roundId: number;
  chainId: number;
  participated: boolean;
  isWinner: boolean;
  position: number;
  totalParticipants: number;
  winnersCount: number;
  winProbability: number;
  roundStatus: string;
  questType?: string;
  prize?: {
    rank: number;
    amount: string;
  } | null;
}

interface PendingResult {
  roundId: number;
  chainId: number;
  result: RoundResult;
}

export function useRoundResults(walletAddress?: string, chainId?: number) {
  const [pendingResults, setPendingResults] = useState<PendingResult[]>([]);

  // Fetch user participations
  const { data: participationsData } = useQuery({
    queryKey: ['user-participations', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gm-lottery-api-production.up.railway.app';
      const res = await fetch(`${apiUrl}/me/participations?walletAddress=${walletAddress.toLowerCase()}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!walletAddress,
    refetchInterval: 30000, // Check every 30 seconds
  });

  useEffect(() => {
    if (!participationsData?.participations || !walletAddress) return;

    const checkCompletedRounds = async () => {
      const completedRounds: PendingResult[] = [];

      for (const participation of participationsData.participations) {
        const roundId = participation.roundId;
        const participationChainId = participation.chainId || chainId;

        // Skip if already viewed
        if (participationChainId && isRoundViewed(participationChainId, roundId)) {
          continue;
        }

        // Fetch round result
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gm-lottery-api-production.up.railway.app';
          const res = await fetch(
            `${apiUrl}/winners/round/${roundId}/user/${walletAddress.toLowerCase()}`
          );

          if (res.ok) {
            const result: RoundResult = await res.json();

            // Only show if round is completed (CLOSED status) and user participated
            if (
              result.participated &&
              result.roundStatus === 'CLOSED' &&
              participationChainId
            ) {
              completedRounds.push({
                roundId,
                chainId: participationChainId,
                result,
              });
            }
          }
        } catch (error) {
          console.error(`Error fetching result for round ${roundId}:`, error);
        }
      }

      if (completedRounds.length > 0) {
        setPendingResults(completedRounds);
      }
    };

    checkCompletedRounds();
  }, [participationsData, walletAddress, chainId]);

  return {
    pendingResults,
    hasResults: pendingResults.length > 0,
    clearResult: (roundId: number) => {
      setPendingResults((prev) => prev.filter((r) => r.roundId !== roundId));
    },
  };
}
