'use client';

import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { NFTCard } from './NFTCard';

interface Winner {
  id: number;
  roundId: number;
  walletAddress: string;
  prizeWei: string;
  questType?: string;
  chainId?: number;
}

// Map questType to badge image (GIF animations)
const getQuestBadge = (questType: string): string => {
  const badges: Record<string, string> = {
    BRONZE: '/gifsAndSounds/Bronze%20Quest.gif',
    SILVER: '/gifsAndSounds/Silver%20Quest.gif',
    GOLD: '/gifsAndSounds/Gold%20Quest.gif',
    CRYSTAL: '/gifsAndSounds/Crystal%20Quest.gif',
  };
  return badges[questType.toUpperCase()] || '/gifsAndSounds/Bronze%20Quest.gif';
};

async function fetchLatestWinners() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gm-lottery-api-production.up.railway.app';
  const res = await fetch(`${apiUrl}/winners/latest?limit=16`);
  if (!res.ok) throw new Error('Failed to fetch winners');
  return res.json();
}

export function NFTCarousel() {
  const { data, isLoading } = useQuery({
    queryKey: ['latestWinners'],
    queryFn: fetchLatestWinners,
    refetchInterval: 60000, // Refetch every 60 seconds (1 minute)
  });

  const winners: Winner[] = data?.winners || [];

  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex flex-row items-center gap-[6px] pb-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-[188px] h-[164px] bg-gray-200 animate-pulse rounded-[11.38px] flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  if (winners.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <span className="text-[#888888] text-sm">No winners yet. Be the first!</span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex flex-row items-center gap-[6px] pb-2">
        {winners.map((winner) => {
          const shortAddress = `${winner.walletAddress.slice(0, 6)}...${winner.walletAddress.slice(-4)}`;
          const prizeAmount = parseFloat(formatUnits(BigInt(winner.prizeWei), 6)).toFixed(2);
          const badgeImage = getQuestBadge(winner.questType || 'BRONZE');

          return (
            <NFTCard
              key={winner.id}
              imageUrl={badgeImage}
              address={shortAddress}
              price={`${prizeAmount} USDT`}
              roundId={winner.roundId}
              chainId={winner.chainId}
            />
          );
        })}
      </div>
    </div>
  );
}
