"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import type { QuestType } from "./QuestSelector";
import {
    useCurView,
    useCurrentPlayers,
    useUserContribution,
} from "@/lib/web3/hooks/useBronzeQuest";
import { QUEST_CONFIGS, QUEST_COMMON_CONFIG } from "@/config/bronze-quest";
import Image from "next/image";
import { SoundManager } from "@/lib/utils/sound";

interface QuestStatusCardMobileProps {
    questType: QuestType;
    chainId?: number;
    isSelected?: boolean;
    onClick?: () => void;
}

const questGradients = {
    bronze: "radial-gradient(ellipse at 50% 50%, rgba(159, 180, 223, 1) 0%, rgba(99, 110, 208, 1) 100%)",
    silver: "radial-gradient(ellipse at 50% 50%, rgba(159, 180, 223, 1) 0%, rgba(99, 110, 208, 1) 100%)",
    gold: "radial-gradient(ellipse at 50% 50%, rgba(159, 180, 223, 1) 0%, rgba(99, 110, 208, 1) 100%)",
    crystal: "radial-gradient(ellipse at 50% 50%, rgba(159, 180, 223, 1) 0%, rgba(99, 110, 208, 1) 100%)",
};

const questColors = {
    bronze: "#EDA94D",
    silver: "#D2D2D2",
    gold: "#F9C928",
    crystal: "#54c3ee",
};

const questBadges = {
    bronze: "/gifsAndSounds/Bronze Quest.gif",
    silver: "/gifsAndSounds/Silver Quest.gif",
    gold: "/gifsAndSounds/Gold Quest.gif",
    crystal: "/gifsAndSounds/Crystal Quest.gif",
};

const getChainIcon = (chainId: number): string => {
    const chainIcons: Record<number, string> = {
        8453: "/images/chains/base.png",
        57073: "/images/chains/ink.png",
        1868: "/images/chains/soneium.png",
        1301: "/images/chains/unichain.png",
        11155111: "/img/chainLogos/eth.svg",
    };
    return chainIcons[chainId] || "/images/chains/web-icon.svg";
};

export function QuestStatusCardMobile({
    questType,
    chainId = 11155111,
    isSelected = false,
    onClick,
}: QuestStatusCardMobileProps) {
    const { address } = useAccount();
    const questConfig = QUEST_CONFIGS[questType];

    const { round } = useCurView(questType);
    const { players } = useCurrentPlayers(questType);
    const userContribution = useUserContribution(address, questType);

    const [timeRemaining, setTimeRemaining] = useState(0);
    const [timeRange, setTimeRange] = useState({ start: "", end: "" });

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
                const cetFormatter = new Intl.DateTimeFormat("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Europe/Paris", // CET/CEST timezone
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

    const poolTokens = round?.poolWei || BigInt(0);
    const rewards = Number(formatUnits(poolTokens, 6));
    const maxRewards =
        (questConfig.entryFeeWei * BigInt(maxParticipants) * BigInt(95)) /
        BigInt(100);
    const rewardsPercent =
        maxRewards > BigInt(0)
            ? (Number(poolTokens) / Number(maxRewards)) * 100
            : 0;

    const roundId = round?.id || 0;
    const yourContribution =
        userContribution > BigInt(0) ? formatUnits(userContribution, 6) : "0";
    const hasEntry = userContribution > BigInt(0);

    const questColor = questColors[questType];
    const questBadge = questBadges[questType];
    const chainIcon = getChainIcon(chainId);
    const contractAddress = questConfig.address;

    const handleClick = () => {
        SoundManager.playButtonClick();
        onClick?.();
    };

    return (
        <div
            className={`bg-white rounded-[15px] border p-3 flex flex-col gap-3 w-full transition-all cursor-pointer ${
                isSelected
                    ? "border-[#0177E7] border-2"
                    : "border-[#A9D5FF] hover:border-[#0177E7]/50"
            }`}
            onClick={handleClick}
        >
            {/* Top Row: GIF and Clock */}
            <div className="flex flex-row justify-between items-start gap-[142px]">
                {/* Small GIF on left */}
                <div className="w-[34px] h-[34px] rounded-[10px] overflow-hidden flex-shrink-0">
                    <Image
                        src={questBadge}
                        alt="Quest badge"
                        width={34}
                        height={34}
                        className="object-cover"
                        unoptimized
                    />
                </div>

                {/* Clock on right */}
                <div className="flex items-center gap-[6px]">
                    <div className="flex items-center gap-[6px] h-[34px]">
                        <div className="bg-[#18181B] rounded-[7.45px] w-[27px] h-[34px] flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                                {String(Math.floor(minutes / 10))}
                            </span>
                        </div>
                        <div className="bg-[#18181B] rounded-[7.45px] w-[27px] h-[34px] flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                                {String(minutes % 10)}
                            </span>
                        </div>
                        <span className="text-[rgba(3,3,3,0.6)] text-[16.76px] font-bold leading-[1.35em]">
                            :
                        </span>
                        <div className="bg-[#18181B] rounded-[7.45px] w-[27px] h-[34px] flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                                {String(Math.floor(seconds / 10))}
                            </span>
                        </div>
                        <div className="bg-[#18181B] rounded-[7.45px] w-[27px] h-[34px] flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                                {String(seconds % 10)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <div
                className="rounded-lg p-[9px] flex flex-col gap-[3px]"
                style={
                    hasEntry
                        ? {
                              background:
                                  "radial-gradient(ellipse at center, #CAFC01 0%, #7CA245 65%, #7CA245 100%)",
                          }
                        : { background: questGradients[questType] }
                }
            >
                {/* Header Row */}
                <div className="flex flex-row justify-between items-center">
                    <div className="flex items-center gap-[3px]">
                        <div
                            className="w-[17px] h-[17px] rounded-full"
                            style={{ backgroundColor: questColor }}
                        />
                        <span className="text-xs font-semibold leading-[1.5em] text-[#030303]">
                            {questType.charAt(0).toUpperCase() + questType.slice(1)} Quest
                        </span>
                    </div>

                    <div className="flex items-center gap-[6px]">
                        <div className="flex items-center gap-[3px]">
                            <div
                                className="w-[6.16px] h-[6.16px] rounded-[10.79px]"
                                style={{ backgroundColor: questColor }}
                            />
                            <span className="text-[10.79px] leading-[1.5em] text-white">
                                <span className="font-semibold">{Number(formatUnits(questConfig.entryFeeWei, 6))} USDT</span> round
                            </span>
                        </div>
                        <div className="w-[17px] h-[17px] rounded-full overflow-hidden">
                            <Image src={chainIcon} alt="" width={17} height={17} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* Rewards Progress */}
                <div className="bg-[#F1F1F1] rounded-lg p-1 flex flex-col gap-[3px]">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex items-center gap-0.5">
                            <span className="text-[10px] font-semibold leading-[1.35em] text-[rgba(3,3,3,0.6)]">
                                {rewards.toFixed(0)} USDT
                            </span>
                            <span className="text-[10px] leading-[1.35em] text-[#888888]">
                                / {Number(formatUnits(maxRewards, 6)).toFixed(0)} USDT
                            </span>
                        </div>
                        <span className="text-[8px] leading-[1.5em] tracking-[0.01em] text-[#888888]">
                            Rewards
                        </span>
                    </div>
                    <div className="relative w-full h-[7px]">
                        <div className="absolute w-full h-[5px] top-[1px] bg-[rgba(230,230,230,0.8)] rounded-full" />
                        <div
                            className="absolute h-[5px] top-[1px] rounded-full"
                            style={{
                                width: `${Math.min(rewardsPercent, 100)}%`,
                                background:
                                    "linear-gradient(90deg, rgba(28, 150, 253, 1) 33%, rgba(51, 227, 96, 1) 100%)",
                            }}
                        />
                        <div
                            className="absolute w-[7px] h-[7px] rounded-full bg-[#F1F1F1] border-[0.58px]"
                            style={{
                                left: `calc(${Math.min(rewardsPercent, 100)}% - 3.5px)`,
                                top: "0px",
                                borderColor:
                                    "linear-gradient(90deg, rgba(28, 150, 253, 1) 0%, rgba(51, 227, 96, 1) 0%, rgba(244, 198, 48, 1) 0%, rgba(203, 18, 69, 1) 0%, rgba(173, 0, 254, 1) 100%)",
                            }}
                        />
                    </div>
                </div>

                {/* Entry Contribution */}
                <div className="flex flex-row justify-between items-center">
                    <span className="text-[10px] leading-[1.54em] tracking-[0.01em] text-white">
                        Your entry contribution
                    </span>
                    <span className="text-xs font-medium leading-[1.28em] tracking-[0.01em] text-right text-white">
                        {yourContribution} USDT
                    </span>
                </div>
            </div>

            {/* Bottom Row: Participants and Time */}
            <div className="flex flex-row gap-2">
                {/* Participants */}
                <div className="bg-[rgba(241,241,241,0.6)] rounded-lg p-1 flex flex-col gap-[6px] flex-1">
                    <div className="flex flex-col gap-[3px]">
                        <div className="flex flex-row justify-between items-center">
                            <div className="flex items-center gap-0.5">
                                <span className="text-[10px] font-semibold leading-[1.35em] text-[rgba(3,3,3,0.6)]">
                                    {participants}
                                </span>
                                <span className="text-[10px] leading-[1.35em] text-[#888888]">
                                    of {maxParticipants} joined
                                </span>
                            </div>
                            <span className="text-[8px] leading-[1.5em] tracking-[0.01em] text-[#888888]">
                                Participants
                            </span>
                        </div>
                    </div>
                    <div className="relative w-full h-[7px]">
                        <div className="absolute w-full h-[5px] top-[1px] bg-[rgba(230,230,230,0.8)] rounded-full" />
                        <div
                            className="absolute h-[5px] top-[1px] rounded-full"
                            style={{
                                width: `${Math.min(participantsPercent, 100)}%`,
                                background:
                                    "linear-gradient(90deg, rgba(246, 168, 226, 1) 33%, rgba(173, 0, 254, 1) 100%)",
                            }}
                        />
                        <div
                            className="absolute w-[8.42px] h-[7px] rounded-full bg-[#F1F1F1] border-[0.58px]"
                            style={{
                                left: `calc(${Math.min(participantsPercent, 100)}% - 4.21px)`,
                                top: "0px",
                                borderColor: "rgba(173, 0, 254, 1)",
                            }}
                        />
                    </div>
                </div>

                {/* Time Left */}
                <div className="bg-[rgba(241,241,241,0.6)] rounded-lg px-1 py-1 flex flex-row justify-between items-center gap-[6px] w-[119px] h-[32px]">
                    <div className="flex items-center justify-center gap-1 w-[111px]">
                        <Image
                            src="/quest-icons/timer-icon.svg"
                            alt=""
                            width={12}
                            height={12}
                            className="w-[12.33px] h-[12.33px]"
                        />
                        <span className="text-[10px] leading-[1.5em] text-[rgba(3,3,3,0.6)]">
                            {timeRange.start}-{timeRange.end} CET
                        </span>
                    </div>
                </div>
            </div>

            {/* Round ID & View Proof */}
            <div className="bg-[rgba(241,241,241,0.6)] rounded-lg px-[9px] py-[5px] flex flex-row justify-between items-center gap-[14px]">
                <div className="flex items-center gap-[7.7px]">
                    <span className="text-[10px] leading-[1.5em] text-[#888888]">
                        Round ID: {roundId}
                    </span>
                    <Image src="/quest-icons/info-icon.svg" alt="" width={12} height={12} className="w-3 h-3" />
                </div>
                <a
                    href={`https://basescan.org/address/${contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-[75px]"
                >
                    <span className="text-[10px] leading-[1.5em] text-[#0177E7] whitespace-nowrap">View proof</span>
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-shrink-0"
                    >
                        <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                          >
                              <path
                                  d="M11 3C11 2.44772 11.4477 2 12 2H18C18.5523 2 19 2.44772 19 3V9C19 9.55228 18.5523 10 18 10C17.4477 10 17 9.55228 17 9V5.41421L9.70711 12.7071C9.31658 13.0976 8.68342 13.0976 8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929L15.5858 4H12C11.4477 4 11 3.55228 11 3Z"
                                  fill="#0177E7"
                              />
                              <path
                                  d="M5 7C3.89543 7 3 7.89543 3 9V15C3 16.1046 3.89543 17 5 17H11C12.1046 17 13 16.1046 13 15V12C13 11.4477 13.4477 11 14 11C14.5523 11 15 11.4477 15 12V15C15 17.2091 13.2091 19 11 19H5C2.79086 19 1 17.2091 1 15V9C1 6.79086 2.79086 5 5 5H8C8.55228 5 9 5.44772 9 6C9 6.55228 8.55228 7 8 7H5Z"
                                  fill="#0177E7"
                              />
                         </svg>
                    </svg>
                </a>
            </div>
        </div>
    );
}
