'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import type { QuestType } from './QuestSelector';
import {
  useCurView,
  useCurrentPlayers,
  useUserContribution,
} from '@/lib/web3/hooks/useBronzeQuest';
import { QUEST_CONFIGS, QUEST_COMMON_CONFIG } from '@/config/bronze-quest';
import Image from 'next/image';
import FlipClock from '@/ui/components/FlipClock';

interface QuestStatusCardProps {
  questType: QuestType;
  chainId?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

function BadgeImage({
  src,
  alt,
  fallback = '/img/placeholders/badge-fallback.png',
  width = 182,
  height = 177,
  priority = false,
}: {
  src?: string;
  alt: string;
  fallback?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  const safeSrc = src && src.trim().length > 0 ? src : fallback;

  return (
    <div
      className=" overflow-hidden relative"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Image
        src={safeSrc}
        alt={alt}
        fill
        sizes={`${width}px`}
        priority={priority}
        placeholder="blur"
        blurDataURL="/img/placeholders/blur-8px.png"
        className="object-cover"
      />
    </div>
  );
}

const questGradients = {
  bronze:
    'radial-gradient(ellipse at 50% 50%, rgba(159, 180, 223, 1) 0%, rgba(99, 110, 208, 1) 100%)',
  silver:
    'radial-gradient(ellipse at 50% 50%, rgba(159, 180, 223, 1) 0%, rgba(99, 110, 208, 1) 100%)',
  gold: 'radial-gradient(ellipse at 50% 50%, rgba(159, 180, 223, 1) 0%, rgba(99, 110, 208, 1) 100%)',
  crystal:
    'radial-gradient(ellipse at 50% 50%, rgba(159, 180, 223, 1) 0%, rgba(99, 110, 208, 1) 100%)',
};

const questColors = {
  bronze: '#b76230',
  silver: '#84acc4',
  gold: '#ffa013',
  crystal: '#54c3ee',
};

const questBadges = {
  bronze: '/gifsAndSounds/Bronze%20Quest.gif',
  silver: '/gifsAndSounds/Silver%20Quest.gif',
  gold: '/gifsAndSounds/Gold%20Quest.gif',
  crystal: '/gifsAndSounds/Crystal%20Quest.gif',
};

// Map chainId to chain icon
const getChainIcon = (chainId: number): string => {
  const chainIcons: Record<number, string> = {
    8453: '/images/chains/base.png', // Base
    57073: '/images/chains/ink.png', // Ink
    1868: '/images/chains/soneium.png', // Soneium
    1301: '/images/chains/unichain.png', // Unichain
    11155111: '/img/chainLogos/eth.svg', // Sepolia (Ethereum testnet)
  };
  return chainIcons[chainId] || '/images/chains/web-icon.svg';
};

export function QuestStatusCard({
  questType,
  chainId = 11155111,
  isSelected = false,
  onClick,
}: QuestStatusCardProps) {
  const { address } = useAccount();
  const questConfig = QUEST_CONFIGS[questType];

  // Fetch contract data
  const { round } = useCurView(questType);
  const { players } = useCurrentPlayers(questType);
  const userContribution = useUserContribution(address, questType);

  // Calculate time remaining and time range
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timeRange, setTimeRange] = useState({ start: '', end: '' });

  useEffect(() => {
    if (!round?.startedAt) return;

    const startedAt = round.startedAt;

    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const endTime = startedAt + QUEST_COMMON_CONFIG.INTERVAL_SEC;
      const remaining = Math.max(0, endTime - now);
      setTimeRemaining(remaining);

      // Format time range in CET
      const startDate = new Date(startedAt * 1000);
      const endDate = new Date(endTime * 1000);

      const formatTime = (date: Date) => {
        // Convert to CET (UTC+1) or CEST (UTC+2)
        const cetFormatter = new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Paris', // CET/CEST timezone
          hour12: false,
        });
        return cetFormatter.format(date);
      };

      setTimeRange({
        start: formatTime(startDate),
        end: formatTime(endDate),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [round?.startedAt]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const participants = players.length;
  const maxParticipants = QUEST_COMMON_CONFIG.MAX_PLAYERS;
  const participantsPercent = (participants / maxParticipants) * 100;

  // Calculate rewards (pool size)
  const poolTokens = round?.poolWei || BigInt(0);
  const rewards = Number(formatUnits(poolTokens, 6)); // USDT has 6 decimals
  const maxRewards = (questConfig.entryFeeWei * BigInt(maxParticipants) * BigInt(95)) / BigInt(100); // 95% of max capacity goes to pool
  const rewardsPercent =
    maxRewards > BigInt(0) ? (Number(poolTokens) / Number(maxRewards)) * 100 : 0;

  const roundValue = `${Number(formatUnits(questConfig.entryFeeWei, 6))} USDT`;
  const roundId = round?.id || 0;
  const yourContribution = userContribution > BigInt(0) ? formatUnits(userContribution, 6) : '0';
  const hasEntry = userContribution > BigInt(0);

  const questColor = questColors[questType];
  const questBadge = questBadges[questType];
  const chainIcon = getChainIcon(chainId);

  // Get contract address for etherscan link
  const contractAddress = questConfig.address;

  return (
    <div
      className={`bg-white rounded-[20px] border p-10 flex flex-row gap-6 w-full transition-all cursor-pointer ${
        isSelected ? 'border-[#0177E7] border-[3px]' : 'border-[#A9D5FF] hover:border-[#0177E7]/50'
      }`}
      onClick={onClick}
    >
      {/* Left Column - NFT Image */}
      <div className="flex flex-col items-center flex-shrink-0 w-[201px]">
        {/* Flip Clock Timer */}
        <div className="w-[181.73px] h-[164.21px] flex items-center justify-center">
          <FlipClock startedAt={round?.startedAt} intervalSec={QUEST_COMMON_CONFIG.INTERVAL_SEC} />
        </div>

        {/* Round Badge */}
        <BadgeImage src={questBadge} alt="Quest badge" width={182} height={177} />
      </div>

      {/* Right Column - Info */}
      <div className="flex flex-col gap-[11px] flex-1 min-w-0">
        {/* Top Card - Timer & Entry */}
        <div
          className="rounded-xl p-3 flex flex-col justify-center items-center gap-2.5"
          style={
            hasEntry
              ? {
                  background:
                    'radial-gradient(ellipse at center, #CAFC01 0%, #7CA245 65%, #7CA245 100%)',
                }
              : { background: questGradients[questType] }
          }
        >
          {/* Header Row */}
          <div className="flex flex-row justify-between items-center w-full gap-1">
            {/* Left Side - Quest Type */}
            <div className="flex items-center gap-1">
              <div
                className="w-[22px] h-[22px] rounded-full"
                style={{ backgroundColor: questColor }}
              />
              <span className="text-sm text-[#030303]">
                {questType.charAt(0).toUpperCase() + questType.slice(1)} Quest
              </span>
            </div>

            {/* Right Side - Round Badge */}
            <div className="flex items-center gap-2">
              <div className="rounded-xl px-2 py-0.5 flex items-center gap-1.5">
                <span className="text-sm" style={{ color: questColor }}>
                  {roundValue}
                </span>
                <span className="text-sm text-white"> round</span>
              </div>
              <div className="w-[22px] h-[22px] rounded-full overflow-hidden">
                <img src={chainIcon} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Time Badge */}
          <div className="bg-[#F1F1F1] border border-[#E6E6E6] rounded-xl px-3 py-[7px] flex flex-row justify-between items-center gap-[18px] w-full">
            <div className="flex items-center gap-2.5">
              <img src="/quest-icons/timer-icon.svg" alt="" className="w-4 h-4" />
              <span className="text-sm text-[rgba(3,3,3,0.6)]">
                {timeRange.start}-{timeRange.end} CET
              </span>
            </div>
            <span className="text-sm text-[#0177E7]">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} Left
            </span>
          </div>

          {/* Entry Contribution */}
          <div className="flex flex-row justify-between items-center w-full gap-[26px]">
            <span className="text-xs leading-[1.67em] tracking-[0.01em] text-white">
              Your entry contribution
            </span>
            <span className="text-sm font-medium leading-[1.43em] tracking-[0.01em] text-right text-white">
              {yourContribution} USDT
            </span>
          </div>
        </div>


        {/* Middle Section - Stats */}
        <div className="flex flex-col justify-center items-center gap-[11px] w-full">

          {/* Participants Progress */}
          <div className="bg-[rgba(241,241,241,0.6)] rounded-2xl p-3 flex flex-col justify-center gap-2.5 w-full relative">
            <div className="flex flex-row items-center gap-2 w-full">
              <span className="text-base font-semibold leading-[1.35em] text-[#030303]">
                {participants}
              </span>
              <span className="text-base leading-[1.35em] text-[#888888]">
                of {maxParticipants} joined
              </span>
            </div>
            <div className="relative w-full h-4">
              <div className="absolute w-full h-4 bg-[rgba(230,230,230,0.8)] rounded-2xl" />
              <div
                className="absolute h-4 rounded-2xl"
                style={{
                  width: `${participantsPercent}%`,
                  background:
                    'linear-gradient(90deg, rgba(246, 168, 226, 1) 33%, rgba(173, 0, 254, 1) 100%)',
                }}
              />
              <div
                className="absolute w-6 h-6 rounded-full bg-[#F1F1F1] border-2"
                style={{
                  left: `calc(${participantsPercent}% - 12px)`,
                  top: '-4px',
                  borderColor: 'rgba(173, 0, 254, 1)',
                }}
              />
            </div>
            <span className="absolute top-[9px] right-3 text-xs leading-[1.67em] tracking-[0.01em] text-[#888888]">
              Participants
            </span>
          </div>

          {/* Rewards Progress */}
          <div className="bg-[rgba(241,241,241,0.6)] rounded-2xl p-3 flex flex-col justify-center gap-2.5 w-full relative">
            <div className="flex flex-row items-center gap-2 w-full">
              <span className="text-base font-semibold leading-[1.35em] text-[rgba(3,3,3,0.6)]">
                {rewards.toFixed(2)} USDT / {Number(formatUnits(maxRewards, 6)).toFixed(2)} USDT
              </span>
            </div>
            <div className="relative w-full h-4">
              <div className="absolute w-full h-4 bg-[rgba(230,230,230,0.8)] rounded-2xl" />
              <div
                className="absolute h-4 rounded-2xl"
                style={{
                  width: `${rewardsPercent}%`,
                  background:
                    'linear-gradient(90deg, rgba(28, 150, 253, 1) 33%, rgba(51, 227, 96, 1) 100%)',
                  borderRadius: '16px 0 0 16px',
                }}
              />
              <div
                className="absolute w-6 h-6 rounded-full bg-[#F1F1F1] border-2"
                style={{
                  left: `calc(${rewardsPercent}% - 12px)`,
                  top: '-4px',
                  borderColor: 'rgba(173, 0, 254, 1)',
                }}
              />
            </div>
            <span className="absolute top-[13px] right-3 text-xs leading-[1.67em] tracking-[0.01em] text-[#888888]">
              Rewards
            </span>
          </div>
        </div>

        {/* Bottom Card - Round ID & View Proof */}
        <div className="bg-[#F1F1F1] border border-[#E6E6E6] rounded-xl px-3 py-[7px] flex flex-row justify-between items-center gap-[18px] w-full">
          <div className="flex items-center gap-2.5">
            <span className="text-base leading-[1.5em] text-[rgba(3,3,3,0.6)]">
              Round ID: {roundId}
            </span>
            <img src="/quest-icons/info-icon.svg" alt="" className="w-4 h-4" />
          </div>
          <a
            href={`https://basescan.org/address/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#0177E7] text-base hover:opacity-80 transition"
          >
            <span>View proof</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M5 3L9 7L5 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
