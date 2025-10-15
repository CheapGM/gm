"use client";

import Image from "next/image";

interface RewardCardProps {
    position: string;
    reward: string;
    questsCount: number;
    icon?: string;
    positionColor: string;
}

export function RewardCard({
    position,
    reward,
    questsCount,
    icon,
    positionColor,
}: RewardCardProps) {
    return (
        <div className="flex flex-col justify-center gap-5 tablet:gap-3 py-3 tablet:py-2 px-[10px] tablet:px-3 rounded-2xl tablet:rounded-xl bg-[rgba(241,241,241,0.6)] flex-1">
            {/* Title Container */}
            <div className="flex flex-col gap-3 tablet:gap-2 w-full">
                <div className="flex justify-between items-center gap-2 w-full">
                    <span
                        className="text-base tablet:text-sm font-semibold leading-[1.5em] flex-1"
                        style={{ color: positionColor }}
                    >
                        {position}
                    </span>
                    {icon && (
                        <div className="w-[22px] h-[22px] tablet:w-[18px] tablet:h-[18px] flex-shrink-0 relative">
                            <Image
                                src={icon}
                                alt="Chain icon"
                                width={22}
                                height={22}
                                className="object-cover rounded-full"
                            />
                        </div>
                    )}
                </div>

                {/* Info Block */}
                <div className="flex flex-col justify-center gap-[18px] tablet:gap-2 px-[14px] tablet:px-3 py-[7px] tablet:py-1.5 h-[42px] tablet:h-auto bg-[#F1F1F1] border border-[#E6E6E6] rounded-xl tablet:rounded-lg w-full">
                    <div className="flex justify-between items-center w-full">
                        <span className="text-xs tablet:text-[10px] font-semibold leading-[1.5em] text-[#0177E7]">
                            {reward}
                        </span>
                        <span className="text-xs tablet:text-[10px] leading-[1.5em] text-[#888888]">
                            {questsCount} quests
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
