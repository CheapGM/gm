'use client';

import { useEffect } from 'react';
import { formatUnits } from 'viem';
import { markRoundAsViewed } from '@/lib/utils/roundResults';
import Image from 'next/image';

interface RoundResultModalProps {
  roundId: number;
  chainId: number;
  position: number;
  totalParticipants: number;
  winProbability: number;
  isWinner: boolean;
  prize?: {
    rank: number;
    amount: string;
  } | null;
  questType?: string;
  onClose: () => void;
}

export function RoundResultModal({
  roundId,
  chainId,
  position,
  totalParticipants,
  winProbability,
  isWinner,
  prize,
  questType,
  onClose,
}: RoundResultModalProps) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    // Mark as viewed
    markRoundAsViewed(chainId, roundId);
    onClose();
  };

  // isWinner = true;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={handleClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#A5DFF7] opacity-80" />

      {/* Modal Content */}
      <div className="relative z-10 w-[300px] h-[160px]">
        {/* Background Image */}
        <Image
          src="/img/modalBlock.png"
          alt="Modal Background"
          width={300}
          height={160}
          className="absolute inset-0"
        />

        {/* Title - "Your position" or "You win!!!" */}
        <div
          className={`absolute font-poppins font-bold leading-[1] whitespace-nowrap ${
            isWinner ? 'text-[45px]' : 'text-[22px]'
          }`}
          style={{
            top: isWinner ? '0px' : '27px',
            left: isWinner ? '46%' : '37%',
            transform: 'translateX(-50%) rotate(-11.2deg)',
            color: '#A5DFF7',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
            WebkitTextStroke: isWinner ? '10px #341D1A' : '6px #341D1A',
            paintOrder: 'stroke fill',
          }}
        >
          {isWinner ? 'You win!!!' : 'Your position:'}
        </div>

        {/* Main Stats */}
        <div
          className="absolute font-bold text-center"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'Bungee',
            color: '#1B0D38',
          }}
        >
          {isWinner && prize ? (
            <div
              className="text-[25px] font-poppins text-center"
              style={{
                lineHeight: '1.2em',
                letterSpacing: '0.05em',
                background:
                  'radial-gradient(circle at 100% 149%, rgba(85, 125, 33, 1) 0%, rgba(185, 200, 95, 1) 21%, rgba(59, 96, 0, 1) 60%, rgba(71, 103, 1, 1) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                WebkitTextStroke: '3px rgba(81, 82, 26, 0.2)',
                paintOrder: 'stroke fill',
              }}
            >
              +{formatUnits(BigInt(prize.amount), 6)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center -mb-10">
              <div
                className="font-poppins text-[22px] leading-[1] tracking-[0.05em] text-[#2B1A04]"
                style={{
                  WebkitTextStroke: '5px #51521A33',
                  paintOrder: 'stroke fill',
                }}
              >
                12 of 20
              </div>

              <div
                className="font-poppins text-[16px] leading-[1] tracking-[0.05em] text-[#2B1A04] whitespace-nowrap"
                style={{
                  WebkitTextStroke: '5px #51521A33',
                  paintOrder: 'stroke fill',
                }}
              >
                chance to win 20%
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
