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
      className="relative w-[251px] h-[160px] group transition-all duration-150 hover:translate-y-1 active:translate-y-2 disabled:opacity-60 disabled:cursor-not-allowed"
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

      {/* Button Text Overlay - Positioned according to Figma */}
      {buttonText && (
        <div
          className="absolute"
          style={{
            left: '50%',
            top: '30px',
            transform: 'translateX(-50%)',
          }}
        >
          <span
            className="font-poppins whitespace-nowrap"
            style={{
              fontSize: needsSmallerFont ? '15px' : needsMediumFont ? '20px' : '28px', // 15px for very long, 20px for medium, 28px default
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
