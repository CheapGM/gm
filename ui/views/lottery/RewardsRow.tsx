"use client";

import { RewardCard } from "./RewardCard";

const rewardsData = [
    {
        position: "1st Position",
        reward: "60% from the quest",
        questsCount: 4,
        positionColor: "#12694A",
        icon: "/images/chains/base.png",
    },
    {
        position: "2nd Position",
        reward: "25% from the quest",
        questsCount: 4,
        positionColor: "#0A4E58",
        icon: "/images/chains/base.png",
    },
    {
        position: "3rd Position",
        reward: "10% from the quest",
        questsCount: 4,
        positionColor: "#192973",
        icon: "/images/chains/base.png",
    },
    {
        position: "4th Positions",
        reward: "5% from the quest",
        questsCount: 4,
        positionColor: "#480E5D",
        icon: "/images/chains/base.png",
    },
    {
        position: "5th-20th Positions",
        reward: "NFT reward Badge",
        questsCount: 4,
        positionColor: "#574B0C",
        icon: "/images/chains/base.png",
    },
];

export function RewardsRow() {
    return (
        <div className="flex flex-row tablet:flex-col justify-stretch items-stretch gap-[9px] tablet:gap-3 w-full">
            {rewardsData.map((reward, index) => (
                <RewardCard key={index} {...reward} />
            ))}
        </div>
    );
}
