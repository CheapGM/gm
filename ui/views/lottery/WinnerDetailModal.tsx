"use client";

import { useEffect } from "react";
import Image from "next/image";
import { formatUnits } from "viem";

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

interface WinnerDetailModalProps {
    winner: Winner | null;
    isOpen: boolean;
    onClose: () => void;
}

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

export function WinnerDetailModal({
    winner,
    isOpen,
    onClose,
}: WinnerDetailModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen || !winner) return null;

    const questType = (winner.questType || "Bronze").toLowerCase();
    const questName = `${
        questType.charAt(0).toUpperCase() + questType.slice(1)
    } Quest`;

    // Quest colors mapping
    const questColors: Record<string, { bg: string; text: string }> = {
        bronze: { bg: "#EDA94D", text: "#EDA94D" },
        silver: { bg: "#C0C0C0", text: "#C0C0C0" },
        crystal: { bg: "#ADF25C", text: "#ADF25C" },
        diamond: { bg: "#B4E1FF", text: "#B4E1FF" },
    };

    const colors = questColors[questType] || questColors.bronze;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-end tablet:items-end justify-center pointer-events-none">
                <div
                    className="bg-white rounded-t-[14px] tablet:rounded-t-[14px] w-full max-w-[351px] tablet:max-w-full pointer-events-auto animate-slide-up"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Content */}
                    <div className="flex flex-col items-center gap-3 p-5">
                        {/* Header with icon and title */}
                        <div className="flex flex-col items-center gap-3 w-full">
                            <div
                                className="w-[51px] h-[51px] rounded-full"
                                style={{ backgroundColor: colors.bg }}
                            />
                            <h3
                                className="text-sm font-medium font-poppins"
                                style={{ color: colors.text }}
                            >
                                {questName}
                            </h3>
                            <div className="w-full h-[1px] bg-[rgba(230,230,230,0.8)]" />
                        </div>

                        {/* Details */}
                        <div className="flex flex-col gap-8 w-full">
                            {/* Wallet */}
                            <div className="flex items-center justify-between w-full">
                                <span className="text-xs text-[#888888] font-poppins">
                                    Wallet
                                </span>
                                <span className="text-sm font-medium text-[rgba(3,3,3,0.6)] font-poppins">
                                    {winner.walletAddress
                                        ? `${winner.walletAddress.slice(
                                              0,
                                              6
                                          )}...${winner.walletAddress.slice(-4)}`
                                        : "Unknown"}
                                </span>
                            </div>

                            {/* Prize */}
                            <div className="flex items-center justify-between w-full">
                                <span className="text-xs text-[#888888] font-poppins">
                                    Prize
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-[rgba(3,3,3,0.6)] font-poppins">
                                        {formatUnits(BigInt(winner.prizeWei), 6)}
                                    </span>
                                    <span className="text-[10px] text-[#888888] font-poppins">
                                        USDT
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
                                                className="w-[10.46px] h-[10.46px]"
                                            >
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
                                        )}
                                </div>
                            </div>

                            {/* Chain */}
                            <div className="flex items-center justify-between w-full">
                                <span className="text-xs text-[#888888] font-poppins">
                                    Chain
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-[rgba(3,3,3,0.6)] font-poppins">
                                        {winner.chainId
                                            ? getChainName(winner.chainId)
                                            : "Unknown"}
                                    </span>
                                    {winner.chainId && (
                                        <Image
                                            src={getChainIcon(winner.chainId)}
                                            alt={getChainName(winner.chainId)}
                                            width={18}
                                            height={18}
                                            className="rounded-full"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Round ID */}
                            <div className="flex items-center justify-between w-full">
                                <span className="text-xs text-[#888888] font-poppins">
                                    Round ID
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-[rgba(3,3,3,0.6)] font-poppins">
                                        {winner.roundId}
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
                                                className="w-[10.46px] h-[10.46px]"
                                            >
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
                                        )}
                                </div>
                            </div>

                            {/* Total rewards */}
                            <div className="flex items-center justify-between w-full">
                                <span className="text-xs text-[#888888] font-poppins">
                                    Total rewards
                                </span>
                                <span className="text-sm font-medium text-[rgba(3,3,3,0.6)] font-poppins">
                                    {winner.poolWei
                                        ? formatUnits(BigInt(winner.poolWei), 6)
                                        : "0"}
                                </span>
                            </div>

                            {/* Finished at */}
                            <div className="flex items-center justify-between w-full">
                                <span className="text-[10.46px] text-[#888888] font-normal font-opensans">
                                    Finished at
                                </span>
                                <span className="text-sm font-medium text-[rgba(3,3,3,0.6)] font-poppins">
                                    {new Date(winner.createdAt).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        }
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
