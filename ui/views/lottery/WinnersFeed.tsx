"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import Image from "next/image";
import { WinnerDetailModal } from "./WinnerDetailModal";

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

type ChainFilter = "All chains" | "Base" | "Ink" | "Soneium" | "Unichain";
type QuestFilter =
    | "All Quests"
    | "Bronze Quest"
    | "Silver Quest"
    | "Crystal Quest"
    | "Gold Quest";

const chainFilters: { name: ChainFilter; icon?: string }[] = [
    { name: "All chains", icon: "/images/chains/web-icon.svg" },
    { name: "Base", icon: "/images/chains/base.png" },
    { name: "Ink", icon: "/images/chains/ink.png" },
    { name: "Soneium", icon: "/images/chains/soneium.png" },
    { name: "Unichain", icon: "/images/chains/unichain.png" },
];

const questFilters: QuestFilter[] = [
    "All Quests",
    "Bronze Quest",
    "Silver Quest",
    "Gold Quest",
    "Crystal Quest",
];

async function fetchWinners() {
    const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://gm-lottery-api-production.up.railway.app";
    const res = await fetch(`${apiUrl}/winners/latest?limit=10`);
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

// Map chainId to chain name
const getChainName = (chainId: number): string => {
    const chains: Record<number, string> = {
        1: "Ethereum",
        137: "Polygon",
        8453: "Base",
        57073: "Ink",
        1868: "Soneium",
        1301: "Unichain",
        11155111: "Sepolia",
    };
    return chains[chainId] || `Chain ${chainId}`;
};

const getChainIcon = (chainId: number): string => {
    const icons: Record<number, string> = {
        8453: "/images/chains/base.png",
        57073: "/images/chains/ink.png",
        1868: "/images/chains/soneium.png",
        1301: "/images/chains/unichain.png",
    };
    return icons[chainId] || "/images/chains/web-icon.svg";
};

// Get block explorer URL for a chain
const getBlockExplorerUrl = (chainId: number, txHash: string): string => {
    const explorers: Record<number, string> = {
        1: "https://etherscan.io",
        137: "https://polygonscan.com",
        8453: "https://basescan.org",
        57073: "https://explorer.inkonchain.com",
        1868: "https://soneium.blockscout.com",
        1301: "https://unichain-sepolia.blockscout.com",
        11155111: "https://sepolia.etherscan.io",
    };
    const baseUrl = explorers[chainId] || "https://etherscan.io";
    return `${baseUrl}/tx/${txHash}`;
};

export function WinnersFeed() {
    const { address } = useAccount();
    const [selectedChainFilter, setSelectedChainFilter] =
        useState<ChainFilter>("All chains");
    const [selectedQuestFilter, setSelectedQuestFilter] =
        useState<QuestFilter>("All Quests");
    const [selectedUserFilter, setSelectedUserFilter] = useState<
        "All Users" | "My Quests"
    >("All Users");
    const [isQuestDropdownOpen, setIsQuestDropdownOpen] = useState(false);
    const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleWinnerClick = (winner: Winner) => {
        setSelectedWinner(winner);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedWinner(null), 300);
    };

    // Fetch all winners or user-specific winners based on filter
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
            selectedUserFilter === "All Users" ||
            (selectedUserFilter === "My Quests" && !!address),
    });

    // Get base winners list
    const baseWinners: Winner[] =
        selectedUserFilter === "My Quests"
            ? data?.recentWins || []
            : data?.winners || [];

    // Apply chain filter
    const filteredByChain =
        selectedChainFilter === "All chains"
            ? baseWinners
            : baseWinners.filter((winner) => {
                  const chainName = winner.chainId
                      ? getChainName(winner.chainId)
                      : "";
                  return chainName === selectedChainFilter;
              });

    // Apply quest filter
    const winners =
        selectedQuestFilter === "All Quests"
            ? filteredByChain
            : filteredByChain.filter((winner) => {
                  const questType = (
                      winner.questType || "BRONZE"
                  ).toUpperCase();
                  const filterQuestType = selectedQuestFilter
                      .replace(" Quest", "")
                      .toUpperCase();
                  return questType === filterQuestType;
              });

    useEffect(() => {
        const handleClickOutside = () => setIsQuestDropdownOpen(false);
        if (isQuestDropdownOpen) {
            document.addEventListener("click", handleClickOutside);
            return () =>
                document.removeEventListener("click", handleClickOutside);
        }
    }, [isQuestDropdownOpen]);

    return (
        <div className="w-full flex flex-col gap-8 tablet:gap-4">
            {/* Title - centered */}
            <div className="flex justify-center">
                <h2 className="text-[32px] tablet:text-[24px] font-semibold leading-[1.5em] tracking-[-0.06em] text-[#030303] font-poppins">
                    Winners
                </h2>
            </div>

            {/* Chain Filters - full width */}
            <div className="flex items-center gap-[6px] tablet:gap-1 w-full px-5 tablet:px-0 justify-center tablet:justify-start tablet:overflow-x-auto tablet:scrollbar-hide">
                <div className="flex items-center gap-[6px] tablet:gap-1 tablet:flex-nowrap tablet:px-2">
                    {chainFilters.map((filter) => (
                        <button
                            key={filter.name}
                            onClick={() => setSelectedChainFilter(filter.name)}
                            className={`
                flex items-center gap-[11px] tablet:gap-1.5 px-3 tablet:px-2 h-[44px] tablet:h-[36px] rounded-[14px] tablet:rounded-lg transition-all whitespace-nowrap
                ${
                    selectedChainFilter === filter.name
                        ? "bg-[#F1F1F1] border border-[#0177E7]"
                        : "bg-[#F1F1F1] hover:bg-[rgba(241,241,241,0.8)]"
                }
              `}
                        >
                            {filter.icon && (
                                <div
                                    className={`flex items-center justify-center ${
                                        filter.name === "All chains"
                                            ? "w-[17px] h-[17px] tablet:w-[14px] tablet:h-[14px] rounded-full bg-[rgba(16,16,16,0.7)]"
                                            : "w-[17px] h-[17px] tablet:w-[14px] tablet:h-[14px]"
                                    }`}
                                >
                                    <Image
                                        src={filter.icon}
                                        alt={filter.name}
                                        width={17}
                                        height={17}
                                        className={
                                            filter.name === "All chains"
                                                ? ""
                                                : "rounded-full"
                                        }
                                    />
                                </div>
                            )}
                            <span className="text-sm tablet:text-xs font-medium text-[#030303] font-inter">
                                {filter.name}
                            </span>
                        </button>
                    ))}
                </div>
                {/* Dropdown arrow */}
                <Image
                    src="/images/chains/dropdown-arrow.svg"
                    alt="dropdown"
                    width={12}
                    height={6}
                    className="ml-1"
                />
            </div>

            {/* Quest Tabs + User Filters + View Mode */}
            <div className="flex tablet:flex-col items-center justify-between h-[57px] tablet:h-auto border-b border-[rgba(230,230,230,0.8)] tablet:gap-3 tablet:py-3">
                {/* Quest Tabs - Desktop */}
                <div className="tablet:hidden flex items-center gap-5 h-full">
                    {questFilters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setSelectedQuestFilter(filter)}
                            className={`
                flex items-center justify-center px-5 h-full transition-all font-poppins whitespace-nowrap
                ${
                    selectedQuestFilter === filter
                        ? "text-[#0177E7] border-b-2 border-[#0177E7] text-base font-medium"
                        : "text-[#888888] text-base font-medium hover:text-[#030303]"
                }
              `}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Mobile Filters Row */}
                <div className="hidden tablet:flex items-center justify-between w-full gap-4">
                    {/* Quest Dropdown - Left */}
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsQuestDropdownOpen(!isQuestDropdownOpen);
                            }}
                            className="bg-[rgba(241,241,241,0.4)] border border-[rgba(230,230,230,0.52)] rounded-xl px-[10px] py-[7px] h-[30px] flex items-center justify-between gap-[81px]"
                        >
                            <span className="text-xs text-[rgba(3,3,3,0.6)] font-normal">
                                {selectedQuestFilter}
                            </span>
                            <svg
                                width="9"
                                height="5"
                                viewBox="0 0 9 5"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`transition-transform duration-200 ${
                                    isQuestDropdownOpen ? "rotate-180" : ""
                                }`}
                            >
                                <path
                                    d="M1 1L4.5 4L8 1"
                                    stroke="#888888"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {isQuestDropdownOpen && (
                            <div
                                className="absolute top-full left-0 mt-1 bg-[#F1F1F1] border border-[#E6E6E6] rounded-xl overflow-hidden z-10 shadow-lg min-w-[133px]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {questFilters.map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => {
                                            setSelectedQuestFilter(filter);
                                            setIsQuestDropdownOpen(false);
                                        }}
                                        className={`w-full px-[10px] py-[7px] text-left text-xs transition-colors ${
                                            selectedQuestFilter === filter
                                                ? "bg-[rgba(1,119,231,0.1)] text-[rgba(3,3,3,0.6)]"
                                                : "text-[rgba(3,3,3,0.6)] hover:bg-[#E9E9E9]"
                                        }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* User Filter Buttons - Right */}
                    <div className="flex items-center gap-0">
                        <button
                            onClick={() => setSelectedUserFilter("All Users")}
                            className={`
                px-[10px] py-[10px] h-[30px] flex items-center justify-center rounded-xl text-xs font-medium transition-all border border-transparent
                ${
                    selectedUserFilter === "All Users"
                        ? "bg-[#0177E7] text-[#E8E8E8]"
                        : "text-[#888888]"
                }
              `}
                        >
                            All Users
                        </button>
                        <button
                            data-my-quests-button
                            onClick={() => {
                                setSelectedUserFilter("My Quests");
                            }}
                            className={`
                px-[10px] py-[10px] h-[30px] flex items-center justify-center rounded-xl text-xs font-medium transition-all border border-transparent
                ${
                    selectedUserFilter === "My Quests"
                        ? "bg-[#0177E7] text-[#E8E8E8]"
                        : "text-[#888888]"
                }
              `}
                            style={
                                selectedUserFilter === "My Quests"
                                    ? {
                                          borderImageSlice: 1,
                                      }
                                    : undefined
                            }
                        >
                            My Quests
                        </button>
                    </div>
                </div>

                {/* User Filters - Desktop */}
                <div className="tablet:hidden flex items-center gap-[10px] h-full">
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => setSelectedUserFilter("All Users")}
                            className={`
                px-[10px] py-[10px] rounded-[9px] text-base font-medium font-poppins transition-all
                ${
                    selectedUserFilter === "All Users"
                        ? "bg-[#0177E7] text-white"
                        : "text-[#888888] hover:bg-[rgba(1,119,231,0.05)]"
                }
              `}
                        >
                            All Users
                        </button>
                        <button
                            data-my-quests-button
                            onClick={() => {
                                setSelectedUserFilter("My Quests");
                            }}
                            className={`
                px-[10px] py-[10px] rounded-[9px] text-base font-medium font-poppins transition-all
                ${
                    selectedUserFilter === "My Quests"
                        ? "bg-[#0177E7] text-white"
                        : "text-[#888888] hover:bg-[rgba(1,119,231,0.05)]"
                }
              `}
                        >
                            My Quests
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop Table / Mobile Feed */}
            <div className="w-full">
                {/* Desktop Table Headers - hidden on mobile */}
                <div className="tablet:hidden flex items-center w-full border-b border-[rgba(230,230,230,0.8)] h-[80px]">
                    <div className="flex items-center px-5 w-[297px]">
                        <span className="text-sm text-[#888888]">Wallet</span>
                    </div>
                    <div className="flex items-center justify-end px-5 flex-1">
                        <span className="text-sm text-[#888888]">Prize</span>
                    </div>
                    <div className="flex items-center px-5 flex-1">
                        <span className="text-sm text-[#888888]">Chain</span>
                    </div>
                    <div className="flex items-center justify-end px-5 flex-1">
                        <span className="text-sm text-[#888888]">Quest</span>
                    </div>
                    <div className="flex items-center px-5 w-[194px]">
                        <span className="text-sm text-[#888888]">Round ID</span>
                    </div>
                    <div className="flex items-center justify-end px-5 w-[109px]">
                        <span className="text-sm text-[#888888]">
                            Total rewards
                        </span>
                    </div>
                    <div className="flex items-center justify-end px-5 w-[207px]">
                        <span className="text-sm text-[#888888]">
                            Finished at
                        </span>
                    </div>
                </div>

                {/* Winners List */}
                {isLoading ? (
                    <div className="py-8 text-center text-[#888888]">
                        Loading winners...
                    </div>
                ) : selectedUserFilter === "My Quests" && !address ? (
                    <div className="py-8 text-center text-[#888888]">
                        Connect wallet to see your quests
                    </div>
                ) : winners.length === 0 ? (
                    <div className="py-8 text-center text-[#888888]">
                        {selectedUserFilter === "My Quests"
                            ? "You have no wins yet. Join a quest!"
                            : "No winners yet. Be the first!"}
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {winners.map((winner) => (
                            <div
                                key={winner.id}
                                onClick={() => handleWinnerClick(winner)}
                                className="flex items-center justify-between w-full border-t border-[rgba(230,230,230,0.8)] hover:bg-[rgba(241,241,241,0.3)] transition-colors tablet:px-3 tablet:py-4 tablet:gap-2 cursor-pointer"
                            >
                                {/* Mobile Layout */}
                                <div className="hidden tablet:flex items-center gap-2 flex-1">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-[rgba(3,3,3,0.6)]">
                                            {winner.walletAddress
                                                ? `${winner.walletAddress.slice(
                                                      0,
                                                      6
                                                  )}...${winner.walletAddress.slice(
                                                      -4
                                                  )}`
                                                : "Unknown"}
                                        </span>
                                        <span className="text-[10px] text-[rgba(3,3,3,0.6)] leading-[1.2em]">
                                            {new Date(
                                                winner.createdAt
                                            ).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="hidden tablet:flex items-center gap-3">
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src={getChainIcon(
                                                    winner.chainId || 8453
                                                )}
                                                alt={
                                                    winner.chainId
                                                        ? getChainName(
                                                              winner.chainId
                                                          )
                                                        : "Chain"
                                                }
                                                width={16}
                                                height={16}
                                                className="rounded-full"
                                            />
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-[rgba(3,3,3,0.6)]">
                                                    {formatUnits(
                                                        BigInt(winner.prizeWei),
                                                        6
                                                    )}
                                                </span>
                                                <span className="text-[10px] text-[#888888] leading-[1.5em]">
                                                    USDT
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-[rgba(3,3,3,0.6)] leading-[1.2em]">
                                            {winner.poolWei
                                                ? formatUnits(
                                                      BigInt(winner.poolWei),
                                                      6
                                                  )
                                                : "0"}{" "}
                                            Total Rewards
                                        </span>
                                    </div>

                                    {winner.settlementTxHash && winner.chainId && (
                                        <Image
                                                src="/img/arrow.svg"
                                                alt="arrow"
                                                width={18}
                                                height={18}
                                                className="w-[18px] h-[18px]"
                                            />
                                        
                                    )}
                                </div>

                                {/* Desktop Layout */}
                                <div className="tablet:hidden flex items-center w-full">
                                    <div className="flex items-center px-5 py-[37px] w-[297px]">
                                        <span className="text-base text-[#030303]">
                                            {winner.walletAddress
                                                ? `${winner.walletAddress.slice(
                                                      0,
                                                      6
                                                  )}...${winner.walletAddress.slice(
                                                      -4
                                                  )}`
                                                : "Unknown"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-end px-5 py-5 flex-1">
                                        <span className="text-base font-medium text-[#030303]">
                                            {formatUnits(
                                                BigInt(winner.prizeWei),
                                                6
                                            )}{" "}
                                            USDT
                                        </span>
                                    </div>
                                    <div className="flex items-center px-5 py-5 flex-1">
                                        <span className="text-base text-[#888888]">
                                            {winner.chainId
                                                ? getChainName(winner.chainId)
                                                : "Unknown"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-end px-5 py-5 flex-1">
                                        <span className="text-base text-[#888888]">
                                            {winner.questType || "Bronze"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 px-5 py-5 w-[194px]">
                                        <span className="text-base text-[#888888]">
                                            #{winner.roundId}
                                        </span>
                                        {winner.settlementTxHash &&
                                            winner.chainId && (
                                                <a
                                                    href={getBlockExplorerUrl(
                                                        winner.chainId,
                                                        winner.settlementTxHash
                                                    )}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex items-center justify-center w-6 h-6 rounded hover:bg-[rgba(1,119,231,0.1)] transition-colors"
                                                    title="View settlement transaction"
                                                >
                                                    <svg
                                                        width="16"
                                                        height="16"
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
                                                </a>
                                            )}
                                    </div>
                                    <div className="flex items-center justify-end px-5 py-5 w-[109px]">
                                        <span className="text-base text-[#888888]">
                                            {winner.poolWei
                                                ? formatUnits(
                                                      BigInt(winner.poolWei),
                                                      6
                                                  )
                                                : "0"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-end px-5 py-5 w-[207px]">
                                        <span className="text-base text-[#888888]">
                                            {new Date(
                                                winner.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Winner Detail Modal */}
            <WinnerDetailModal
                winner={selectedWinner}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}
