'use client';

import React from 'react';

export function PrizePoolInfo() {
  return (
    <div className="flex flex-row justify-between items-center gap-[18px] px-2 py-[7px] w-[127px] h-[42px] rounded-xl bg-[rgba(169,213,255,0.19)] border-2 border-[#05ABFF]">
      <div className="flex flex-row items-center gap-1">
        <img src="/quest-icons/timer-icon.svg" alt="" className="w-4 h-4" />
        <span className="text-sm leading-[1.5em] text-[rgba(3,3,3,0.6)] font-poppins">
          Life Winners
        </span>
      </div>
    </div>
  );
}
