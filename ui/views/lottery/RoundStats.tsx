'use client';

import { formatEther } from 'viem';
import { useCurView, useTimeLeft } from '@/lib/web3/hooks/useBronzeQuest';

export function RoundStats() {
  const { round, isLoading } = useCurView();
  const { timeLeft } = useTimeLeft();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-[rgba(230,230,230,0.5)] rounded-[20px] p-5 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (!round) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-[20px] p-5">
        <p className="text-sm text-[#888888] mb-1">Prize Pool</p>
        <p className="text-2xl font-semibold text-[#030303]">
          {formatEther(round.poolWei)} ETH
        </p>
      </div>

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-[20px] p-5">
        <p className="text-sm text-[#888888] mb-1">Players</p>
        <p className="text-2xl font-semibold text-[#030303]">
          {round.players} / 20
        </p>
      </div>

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-[20px] p-5">
        <p className="text-sm text-[#888888] mb-1">Time Left</p>
        <p className="text-2xl font-semibold text-[#030303]">
          {timeLeft > 0 ? formatTime(timeLeft) : 'Ended'}
        </p>
      </div>
    </div>
  );
}