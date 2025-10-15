'use client';

import Image from 'next/image';
import { SoundManager } from '@/lib/utils/sound';

interface SpinButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  buttonText?: string;
  isLoading?: boolean;
}

export function SpinButton({
  onClick,
  disabled = false,
  buttonText,
  isLoading = false,
}: SpinButtonProps) {
  // Determine if user has joined (when buttonText is "Joined")
  const isJoined = buttonText?.toLowerCase().includes('joined');
  // Check if button text needs smaller font size
  const needsSmallerFont = buttonText === 'Switch Network' || buttonText === 'Insufficient Balance';
  const needsMediumFont = buttonText === 'Approving...';

  const handleClick = () => {
    if (!disabled) {
      SoundManager.playButtonClick();
      onClick?.();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="relative w-[251px] h-[160px] tablet:w-[140px] tablet:h-[90px] group transition-all duration-150 hover:translate-y-1 active:translate-y-2 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {/* Button Background Image */}
      <Image
        src={isJoined ? '/img/spinBtnJoined.png' : '/img/spinBtn2.png'}
        alt="Quest Button"
        width={251}
        height={160}
        className="w-full h-full object-contain"
        priority
      />

      {buttonText && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-[30px] tablet:top-[10px]"
        >
          <span
            className={`font-poppins whitespace-nowrap ${
              needsSmallerFont ? 'text-[15px] tablet:text-[7px]' : needsMediumFont ? 'text-[20px] tablet:text-[10px]' : 'text-[28px] tablet:text-[10px]'
            }`}
            style={{
              fontWeight: 400,
              lineHeight: '1.108em',
              letterSpacing: '0.01em',
              color: '#FFFFFF',
              textShadow: '0px 4.7px 4.7px rgba(0, 0, 0, 0.25)',
              WebkitTextStroke: '2.35px #F7405E',
              paintOrder: 'stroke fill',
            }}
          >
            {isLoading && <span className="inline-block mr-2 animate-spin">⏳</span>}
            {buttonText}
          </span>
        </div>
      )}
    </button>
  );
}
