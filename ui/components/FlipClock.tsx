'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Digit = ({ value }: { value: number }) => {
  return (
    <div className="relative w-10 h-14 overflow-hidden rounded-md bg-zinc-900 text-white font-mono text-3xl font-bold flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

interface FlipClockProps {
  startedAt?: number; // Unix timestamp
  intervalSec?: number; // Duration in seconds
}

export default function FlipClock({ startedAt, intervalSec = 600 }: FlipClockProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!startedAt) return;

    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const endTime = startedAt + intervalSec;
      const remaining = Math.max(0, endTime - now);
      setTimeRemaining(remaining);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [startedAt, intervalSec]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const minutesStr = minutes.toString().padStart(2, '0');
  const secondsStr = seconds.toString().padStart(2, '0');

  return (
    <div className="flex justify-center items-center gap-1">
      {minutesStr.split('').map((digit, i) => (
        <Digit key={`m-${i}`} value={parseInt(digit)} />
      ))}
      <span className="text-3xl font-bold text-zinc-500">:</span>
      {secondsStr.split('').map((digit, i) => (
        <Digit key={`s-${i}`} value={parseInt(digit)} />
      ))}
    </div>
  );
}
