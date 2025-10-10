'use client';

import { useEffect, useState } from 'react';

interface QuestTimerProps {
  startedAt?: number; // Unix timestamp
  intervalSec?: number; // Duration in seconds (default 10 minutes)
  onTimerEnd?: () => void; // Callback when timer reaches 0
}

export function QuestTimer({ startedAt, intervalSec = 600, onTimerEnd }: QuestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeRange, setTimeRange] = useState({ start: '', end: '' });
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    if (!startedAt) return;

    const calculateTimes = () => {
      const now = Math.floor(Date.now() / 1000);
      const endTime = startedAt + intervalSec;
      const remaining = Math.max(0, endTime - now);

      setTimeLeft(remaining);

      // If timer just ended, trigger callback and set flag
      if (remaining === 0 && !hasEnded && onTimerEnd) {
        setHasEnded(true);
        onTimerEnd();
      }

      // Reset hasEnded flag if timer restarted (new round)
      if (remaining > 0 && hasEnded) {
        setHasEnded(false);
      }

      // Format time range (HH:MM-HH:MM CET)
      const startDate = new Date(startedAt * 1000);
      const endDate = new Date(endTime * 1000);

      const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      setTimeRange({
        start: formatTime(startDate),
        end: formatTime(endDate),
      });
    };

    calculateTimes();
    const interval = setInterval(calculateTimes, 1000);

    return () => clearInterval(interval);
  }, [startedAt, intervalSec, hasEnded, onTimerEnd]);

  const formatTimeLeft = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-row justify-between items-center w-full gap-[18px] h-[42px]">
      {/* Left: Title */}
      <h3 className="text-[24px] font-medium leading-[1.06em] text-[#243300] font-unbounded">
        Your GM Quest
      </h3>

      {/* Right: Timer info - only show when startedAt is available */}
      {startedAt && (
        <div className="flex flex-row items-center gap-[18px] px-3 py-[7px] rounded-xl bg-[rgba(169,213,255,0.19)] border-2 border-[#05ABFF]">
          {/* Time range */}
          <div className="flex items-center gap-2.5 whitespace-nowrap">
            <img src="/quest-icons/timer-icon.svg" alt="" className="w-4 h-4" />
            <span className="text-sm leading-[1.5em] text-[rgba(3,3,3,0.6)] font-poppins">
              {timeRange.start}-{timeRange.end} CET
            </span>
          </div>

          {/* Countdown - two separate parts to prevent jumping */}
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold leading-[1.5em] text-[#0177E7] font-poppins tabular-nums w-[42px] text-right">
              {formatTimeLeft(timeLeft)}
            </span>
            <span className="text-sm font-semibold leading-[1.5em] text-[#0177E7] font-poppins">
              Left
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
