'use client';

import { useAccount } from 'wagmi';
import { useJoinRound, useJoinedCurrent, useEntryFee } from '@/lib/web3/hooks/useBronzeQuest';
import { formatEther } from 'viem';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

interface JoinButtonProps {
  disabled?: boolean;
  onSuccess?: () => void;
}

export function JoinButton({ disabled, onSuccess }: JoinButtonProps) {
  const { address } = useAccount();
  const entryFee = useEntryFee();
  const hasJoined = useJoinedCurrent(address);
  const { join, isPending, isConfirming, isSuccess, error } = useJoinRound();

  useEffect(() => {
    if (isSuccess) {
      toast.success('Successfully joined the round! 🎉');
      onSuccess?.();
    }
  }, [isSuccess, onSuccess]);

  useEffect(() => {
    if (error) {
      toast.error(`Failed to join: ${error.message}`);
    }
  }, [error]);

  const handleJoin = () => {
    if (!address || hasJoined || disabled) return;
    join(entryFee);
  };

  if (!address) {
    return (
      <button
        disabled
        className="px-8 py-4 bg-gray-300 text-gray-500 rounded-[12px] font-medium text-base cursor-not-allowed"
      >
        Connect Wallet First
      </button>
    );
  }

  if (hasJoined) {
    return (
      <button
        disabled
        className="px-8 py-4 bg-green-100 text-green-700 rounded-[12px] font-medium text-base cursor-not-allowed border border-green-300"
      >
        ✓ Joined This Round
      </button>
    );
  }

  return (
    <button
      onClick={handleJoin}
      disabled={disabled || isPending || isConfirming}
      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-[12px] font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
    >
      {isPending || isConfirming
        ? 'Joining...'
        : `Join Round (${formatEther(entryFee)} ETH)`}
    </button>
  );
}