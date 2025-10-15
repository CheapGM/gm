"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import Image from "next/image";

interface Winner {
    id: number;
    roundId: number;
    walletAddress?: string;
    prizeWei: string;
    rank: number;
    chainId?: number;
    poolWei?: string;
    questType?: string;
    settlementTxHash?: string;
    createdAt: string;
}

const questBadges = {
    bronze: "/gifsAndSounds/Bronze%20Quest.gif",
    silver: "/gifsAndSounds/Silver%20Quest.gif",
    gold: "/gifsAndSounds/Gold%20Quest.gif",
    crystal: "/gifsAndSounds/Crystal%20Quest.gif",
};

async function fetchWinners() {
    const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://gm-lottery-api-production.up.railway.app";
    const res = await fetch(`${apiUrl}/winners/latest?limit=20`);
    if (!res.ok) throw new Error("Failed to fetch winners");
    return res.json();
}

async function fetchUserWinnings(walletAddress: string) {
    const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://gm-lottery-api-production.up.railway.app";
    const res = await fetch(`${apiUrl}/winners/user/${walletAddress}`);
    if (!res.ok) throw new Error("Failed to fetch user winnings");
    return res.json();
}

export function NFTCarouselMobile() {
    const { address } = useAccount();
    const [selectedUserFilter, setSelectedUserFilter] = useState<
        "Life Winners" | "My Quests"
    >("Life Winners");

    const { data, isLoading } = useQuery({
        queryKey: ["winners", selectedUserFilter, address],
        queryFn: () => {
            if (selectedUserFilter === "My Quests" && address) {
                return fetchUserWinnings(address);
            }
            return fetchWinners();
        },
        refetchInterval: 10000,
        enabled:
            selectedUserFilter === "Life Winners" ||
            (selectedUserFilter === "My Quests" && !!address),
    });

    const winners: Winner[] =
        selectedUserFilter === "My Quests"
            ? data?.recentWins || []
            : data?.winners || [];

    const getQuestBadge = (questType?: string): string => {
        const type = (
            questType || "bronze"
        ).toLowerCase() as keyof typeof questBadges;
        return questBadges[type] || questBadges.bronze;
    };

    return (
        <div className="w-full flex flex-col gap-[11px]">
            {/* Tab Buttons */}
            <div className="flex items-center justify-between gap-[11px]">
                <button
                    onClick={() => setSelectedUserFilter("Life Winners")}
                    className={`
                        flex items-center justify-center gap-1 px-3 h-[30px] rounded-xl transition-all
                        ${
                            selectedUserFilter === "Life Winners"
                                ? "bg-[rgba(169,213,255,0.19)] border-[1.5px] border-[#05ABFF]"
                                : "bg-[#0177E7] border border-transparent"
                        }
                    `}
                >
                    {selectedUserFilter === "Life Winners" && (
                        <img src="/quest-icons/timer-icon.svg" alt="" className="w-4 h-4" />
                    )}
                    <span
                        className={`text-xs leading-[1.5em] ${
                            selectedUserFilter === "Life Winners"
                                ? "text-[rgba(3,3,3,0.6)]"
                                : "text-[#E8E8E8]"
                        }`}
                    >
                        Life Winners
                    </span>
                </button>
                <button
                    onClick={() => {
                        // Scroll to winners section
                        const winnersSection = document.getElementById("winners-section");
                        if (winnersSection) {
                            winnersSection.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            });
                        }
                        // Wait for scroll to complete, then trigger My Quests filter
                        setTimeout(() => {
                            const myQuestsButton = document.querySelector(
                                "[data-my-quests-button]"
                            ) as HTMLButtonElement;
                            if (myQuestsButton) {
                                myQuestsButton.click();
                            }
                        }, 500);
                    }}
                    className={`
                        flex items-center justify-center px-[10px] h-[30px] rounded-xl transition-all
                        ${
                            selectedUserFilter === "My Quests"
                                ? "bg-[rgba(169,213,255,0.19)] border-[1.5px] border-[#05ABFF]"
                                : "bg-[#0177E7] border border-transparent"
                        }
                    `}
                >
                    <span
                        className={`text-xs font-medium leading-[1.5em] ${
                            selectedUserFilter === "My Quests"
                                ? "text-[rgba(3,3,3,0.6)]"
                                : "text-[#E8E8E8]"
                        }`}
                    >
                        My Quests
                    </span>
                </button>
            </div>

            {/* Winners Grid - 2 rows with horizontal scroll */}
            {isLoading ? (
                <div className="py-8 text-center text-[#888888] text-sm">
                    Loading winners...
                </div>
            ) : selectedUserFilter === "My Quests" && !address ? (
                <div className="py-8 text-center text-[#888888] text-sm">
                    Connect wallet to see your quests
                </div>
            ) : winners.length === 0 ? (
                <div className="py-8 text-center text-[#888888] text-sm">
                    {selectedUserFilter === "My Quests"
                        ? "You have no wins yet. Join a quest!"
                        : "No winners yet. Be the first!"}
                </div>
            ) : (
                <div className="flex flex-col gap-2 w-full">
                    {/* First Row - Horizontal scroll */}
                    <div className="flex flex-row gap-2 overflow-x-auto scrollbar-hide">
                        {winners
                            .filter((_, index) => index % 2 === 0)
                            .map((winner) => (
                                <div
                                    key={winner.id}
                                    className="bg-white border border-[#E6E6E6] rounded-[11.38px] p-1 flex-shrink-0"
                                >
                                    <div className="flex flex-row gap-[7px]">
                                        {/* Badge */}
                                        <div className="w-6 h-6 rounded-[7px] overflow-hidden flex-shrink-0">
                                            <Image
                                                src={getQuestBadge(
                                                    winner.questType
                                                )}
                                                alt="Quest badge"
                                                width={24}
                                                height={24}
                                                className="object-cover"
                                            />
                                        </div>
                                        {/* Info */}
                                        <div className="bg-[rgba(241,241,241,0.8)] rounded-lg p-1 w-[77px] flex flex-col gap-1">
                                            <div className="flex flex-row justify-between items-center">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-[14.34px] h-[14.34px] rounded-full overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src="/images/chains/base.png"
                                                            alt="avatar"
                                                            width={14}
                                                            height={14}
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-semibold leading-[1.5em] text-[rgba(3,3,3,0.6)]">
                                                        {winner.walletAddress
                                                            ? `${winner.walletAddress.slice(
                                                                  0,
                                                                  2
                                                              )}...${winner.walletAddress.slice(
                                                                  -2
                                                              )}`
                                                            : "0x..."}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-semibold leading-[1.5em] text-[#0177E7]">
                                                    $
                                                    {parseFloat(
                                                        formatUnits(
                                                            BigInt(
                                                                winner.prizeWei
                                                            ),
                                                            6
                                                        )
                                                    ).toFixed(0)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Second Row - Horizontal scroll */}
                    <div className="flex flex-row gap-2 overflow-x-auto scrollbar-hide">
                        {winners
                            .filter((_, index) => index % 2 === 1)
                            .map((winner) => (
                                <div
                                    key={winner.id}
                                    className="bg-white border border-[#E6E6E6] rounded-[11.38px] p-1 flex-shrink-0"
                                >
                                    <div className="flex flex-row gap-[7px]">
                                        {/* Badge */}
                                        <div className="w-6 h-6 rounded-[7px] overflow-hidden flex-shrink-0">
                                            <Image
                                                src={getQuestBadge(
                                                    winner.questType
                                                )}
                                                alt="Quest badge"
                                                width={24}
                                                height={24}
                                                className="object-cover"
                                            />
                                        </div>
                                        {/* Info */}
                                        <div className="bg-[rgba(241,241,241,0.8)] rounded-lg p-1 w-[77px] flex flex-col gap-1">
                                            <div className="flex flex-row justify-between items-center">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-[14.34px] h-[14.34px] rounded-full overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src="/images/chains/base.png"
                                                            alt="avatar"
                                                            width={14}
                                                            height={14}
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-semibold leading-[1.5em] text-[rgba(3,3,3,0.6)]">
                                                        {winner.walletAddress
                                                            ? `${winner.walletAddress.slice(
                                                                  0,
                                                                  2
                                                              )}...${winner.walletAddress.slice(
                                                                  -2
                                                              )}`
                                                            : "0x..."}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-semibold leading-[1.5em] text-[#0177E7]">
                                                    $
                                                    {parseFloat(
                                                        formatUnits(
                                                            BigInt(
                                                                winner.prizeWei
                                                            ),
                                                            6
                                                        )
                                                    ).toFixed(0)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
