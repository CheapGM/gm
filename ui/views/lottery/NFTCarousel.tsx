'use client';

import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { NFTCard } from './NFTCard';
import { useState, useEffect, useRef, useMemo } from 'react';

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
    BRONZE: '/gifsAndSounds/BronzeQuest.gif',
    SILVER: '/gifsAndSounds/SilverQuest.gif',
    GOLD: '/gifsAndSounds/GoldQuest.gif',
    CRYSTAL: '/gifsAndSounds/CrystalQuest.gif',
  };
  return badges[questType.toUpperCase()] || '/gifsAndSounds/BronzeQuest.gif';
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

  const winners: Winner[] = useMemo(() => data?.winners || [], [data?.winners]);

  // Track previous winners to detect new ones
  const prevWinnersRef = useRef<Winner[]>([]);
  const [displayedWinners, setDisplayedWinners] = useState<Winner[]>([]);
  const [newWinnerIds, setNewWinnerIds] = useState<Set<number>>(new Set());
  const [shouldAnimateSlide, setShouldAnimateSlide] = useState(false);

  useEffect(() => {
    if (winners.length === 0) return;

    // First load - show all winners without animation
    if (prevWinnersRef.current.length === 0) {
      setDisplayedWinners(winners);
      prevWinnersRef.current = winners;
      return;
    }

    // Find new winners (those not in previous list)
    const prevIds = new Set(prevWinnersRef.current.map(w => w.id));
    const newWinners = winners.filter(w => !prevIds.has(w.id));

    if (newWinners.length > 0) {
      // Mark new winners for animation
      const newIds = new Set(newWinners.map(w => w.id));
      setNewWinnerIds(newIds);
      setShouldAnimateSlide(true);

      // Add new winners one by one with delay
      newWinners.forEach((winner, index) => {
        setTimeout(() => {
          setDisplayedWinners(prev => [winner, ...prev].slice(0, 16));
        }, index * 300); // 300ms delay between each new winner
      });

      // Clear animation markers after animations complete
      setTimeout(() => {
        setNewWinnerIds(new Set());
        setShouldAnimateSlide(false);
      }, newWinners.length * 300 + 1000);

      prevWinnersRef.current = winners;
    } else if (winners.length !== prevWinnersRef.current.length) {
      // Winners list changed but no new ones (maybe removed old ones)
      setDisplayedWinners(winners);
      prevWinnersRef.current = winners;
    }
  }, [winners]);

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

  if (displayedWinners.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <span className="text-[#888888] text-sm">No winners yet. Be the first!</span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex flex-row items-center gap-[6px] pb-2">
        {displayedWinners.map((winner, index) => {
          const shortAddress = `${winner.walletAddress.slice(0, 6)}...${winner.walletAddress.slice(-4)}`;
          const prizeAmount = parseFloat(formatUnits(BigInt(winner.prizeWei), 6)).toFixed(2);
          const badgeImage = getQuestBadge(winner.questType || 'BRONZE');
          const isNew = newWinnerIds.has(winner.id);

          return (
            <div
              key={winner.id}
              className={`flex-shrink-0 ${
                isNew
                  ? 'animate-slideInFromLeft'
                  : shouldAnimateSlide
                  ? 'animate-slideRight'
                  : ''
              }`}
              style={{
                animationDelay: isNew ? '0ms' : shouldAnimateSlide ? `${index * 50}ms` : '0ms',
              }}
            >
              <NFTCard
                imageUrl={badgeImage}
                address={shortAddress}
                price={`${prizeAmount} USDT`}
                roundId={winner.roundId}
                chainId={winner.chainId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
