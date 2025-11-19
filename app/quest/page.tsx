"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useAccount, useBalance } from "wagmi";
import Image from "next/image";
import Container from "@/ui/components/container";
import { toast } from "sonner";
import { SoundManager } from "@/lib/utils/sound";
import {
    WinnersFeed,
    NFTCarouselMobile,
    QuestSelector,
    QuestInfo,
    QuestStatusCard,
    QuestStatusCardMobile,
    ParticipantsList,
    RewardsRow,
    SpinButton,
    NFTCarousel,
    QuestTimer,
    PrizePoolInfo,
    HeroSection,
    ParticipantsGrid,
    RewardDistribution,
    QuestDropdown,
} from "@/ui/views/lottery";
import {
    useCurView,
    useJoinRound,
    useApproveUSDT,
    useUSDTAllowance,
    useJoinedCurrent,
    useEntryFee,
    useCurrentPlayers,
    useUSDTBalance,
} from "@/lib/web3/hooks/useBronzeQuest";
import { type QuestType, QUEST_CONFIGS } from "@/config/bronze-quest";
import { NetworkSwitcher } from "@/ui/components/NetworkSwitcher";
import { LotteryNetworkButton } from "@/ui/widget/network-button/LotteryNetworkButton";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Button } from "@/ui/components/button";
import { useRoundResults } from "@/lib/hooks/useRoundResults";
import { RoundResultModal } from "@/ui/components/RoundResultModal";
import { useChainId } from "wagmi";
import useAuth from "@/lib/auth/useAuth";
import useSign from "@/lib/auth/useSign";

// Allowed chains for lottery
const LOTTERY_ALLOWED_CHAINS = [
    8453, // Base mainnet
];

const MAX_PARTICIPANTS = 20;
const WINNERS_COUNT = 4;

const calcWinChance = (n: number) => {
    const total = Math.min(Math.max(n, 1), MAX_PARTICIPANTS);
    if (total <= WINNERS_COUNT) return 100;
    return Math.round((WINNERS_COUNT / total) * 100);
};

export default function LotteryPage() {
    const { address, isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();
    const chainId = useChainId();
    const { isAuthorized } = useAuth();
    const { signUser, isPending: isSignPending } = useSign();
    const [selectedQuest, setSelectedQuest] = useState<QuestType>("bronze");
    const [isPollingAfterEnd, setIsPollingAfterEnd] = useState(false);
    const [isQuestDropdownOpen, setIsQuestDropdownOpen] = useState(false);

    // Check for completed round results
    const { pendingResults, clearResult } = useRoundResults(address, chainId);

    // TEST: Show modal preview
    const [showTestModal, setShowTestModal] = useState(false);

    // Join confirmation modal state
    const [showJoinConfirmationModal, setShowJoinConfirmationModal] =
        useState(false);
    const [joinConfirmationData, setJoinConfirmationData] = useState<{
        position: number;
        totalParticipants: number;
        winProbability: number;
    } | null>(null);

    // Quest-specific hooks - use selectedQuest
    const { round, refetch } = useCurView(selectedQuest);
    const entryFee = useEntryFee(selectedQuest);
    const { allowance, refetch: refetchAllowance } = useUSDTAllowance(
        address,
        selectedQuest
    );
    const { hasJoined, refetch: refetchJoined } = useJoinedCurrent(
        address,
        selectedQuest
    );
    const { players } = useCurrentPlayers(selectedQuest);
    const { balance: usdtBalance, refetch: refetchBalance } =
        useUSDTBalance(address);

    const { data: ethBalance } = useBalance({
        address: address,
        chainId: 8453, // Base mainnet
    });

    const isOnCorrectNetwork = LOTTERY_ALLOWED_CHAINS.includes(chainId);
    const {
        approve,
        isPending: isApproving,
        isConfirming: isApprovingConfirming,
        isSuccess: isApproveSuccess,
        error: approveError,
    } = useApproveUSDT(selectedQuest);
    const {
        join,
        isPending: isJoining,
        isConfirming: isJoiningConfirming,
        isSuccess: isJoinSuccess,
        error: joinError,
    } = useJoinRound(selectedQuest);

    // Toast notifications for approve
    useEffect(() => {
        if (isApproving) {
            toast.loading("Approving USDT...", { id: "approve" });
        }
    }, [isApproving]);

    useEffect(() => {
        if (isApprovingConfirming) {
            toast.loading("Confirming approval...", { id: "approve" });
        }
    }, [isApprovingConfirming]);

    useEffect(() => {
        if (isApproveSuccess) {
            toast.success("USDT approved successfully!", { id: "approve" });
            // Refetch allowance after successful approve
            refetchAllowance();
        }
    }, [isApproveSuccess, refetchAllowance]);

    useEffect(() => {
        if (approveError) {
            toast.error("Failed to approve USDT", { id: "approve" });
        }
    }, [approveError]);

    // Toast notifications for join
    useEffect(() => {
        if (isJoining) {
            toast.loading("Joining quest...", { id: "join" });
        }
    }, [isJoining]);

    useEffect(() => {
        if (isJoiningConfirming) {
            toast.loading("Confirming join...", { id: "join" });
        }
    }, [isJoiningConfirming]);

    useEffect(() => {
        if (isJoinSuccess) {
            toast.success("Successfully joined the quest!", { id: "join" });
        }
    }, [isJoinSuccess]);

    // Safety timeout: if joining/confirming takes too long, force refetch
    useEffect(() => {
        if (isJoining || isJoiningConfirming) {
            const timeout = setTimeout(() => {
                // Force refetch after 30 seconds if still in loading state
                refetch();
                refetchJoined();
                toast.dismiss("join");
            }, 30000);

            return () => clearTimeout(timeout);
        }
    }, [isJoining, isJoiningConfirming, refetch, refetchJoined]);

    useEffect(() => {
        if (joinError) {
            // Parse error message for better user feedback
            const errorMessage = joinError.message || "";
            let userMessage = "Failed to join quest";

            if (errorMessage.includes("insufficient funds")) {
                userMessage = "Insufficient funds for gas fee";
            } else if (errorMessage.includes("user rejected")) {
                userMessage = "Transaction cancelled";
            } else if (errorMessage.includes("Already joined")) {
                userMessage = "You have already joined this round";
            } else if (errorMessage.includes("Round is full")) {
                userMessage = "This round is full (20 players maximum)";
            } else if (errorMessage.includes("Round is closed")) {
                userMessage = "This round has ended";
            }

            toast.error(userMessage, { id: "join" });
        }
    }, [joinError]);

    // Auto-join after successful approval (only once)
    useEffect(() => {
        if (
            isApproveSuccess &&
            allowance >= entryFee &&
            !hasJoined &&
            !isJoining &&
            !isJoiningConfirming
        ) {
            join();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isApproveSuccess]);

    // Refetch data after successful join and show confirmation modal
    useEffect(() => {
        if (isJoinSuccess && address) {
            // Immediate refetch
            refetch();
            refetchJoined();
            refetchBalance();

            // Additional refetches for mobile reliability
            const refetchInterval = setInterval(() => {
                refetch();
                refetchJoined();
            }, 1000);

            // Get player position after successful join
            // Wait a bit for the blockchain state to update
            setTimeout(async () => {
                clearInterval(refetchInterval);
                
                try {
                    // Force one more refetch before checking
                    await refetch();
                    await refetchJoined();
                    
                    // Use the players data we already have
                    const currentPlayers = players;
                    const userPosition = currentPlayers.findIndex(
                        (p) => p.toLowerCase() === address.toLowerCase()
                    );

                    if (userPosition !== -1) {
                        const position = userPosition + 1; // Convert to 1-indexed
                        const totalParticipants = currentPlayers.length;

                        // ---- New: fixed probability model (4 winners, max 20 participants)
                        const winProbability = calcWinChance(totalParticipants);

                        setJoinConfirmationData({
                            position,
                            totalParticipants,
                            winProbability,
                        });
                        setShowJoinConfirmationModal(true);
                    }
                } catch (error) {
                    console.error("Error fetching player position:", error);
                }
            }, 3000); // Wait 3 seconds for blockchain update

            // Cleanup interval on unmount
            return () => clearInterval(refetchInterval);
        }
    }, [
        isJoinSuccess,
        refetch,
        refetchJoined,
        refetchBalance,
        address,
        players,
        selectedQuest,
    ]);

    // Refetch allowance and joined status when quest changes
    useEffect(() => {
        if (address) {
            refetchAllowance();
            refetchJoined();
        }
    }, [selectedQuest, address, refetchAllowance, refetchJoined]);

    // Play background music on page load
    useEffect(() => {
        // Start background music when component mounts
        SoundManager.playBackgroundMusic(0.2); // 20% volume

        // Cleanup: stop background music when component unmounts
        return () => {
            SoundManager.stopBackgroundMusic();
        };
    }, []);

    // Play spinner sound when user has joined (only once when status changes)
    const hasPlayedSpinnerSoundRef = useRef(false);
    const [showSpinningWheel, setShowSpinningWheel] = useState(false);

    useEffect(() => {
        if (hasJoined && !hasPlayedSpinnerSoundRef.current) {
            // Play sound
            SoundManager.playSpinnerSound();
            hasPlayedSpinnerSoundRef.current = true;

            // Show spinning GIF
            setShowSpinningWheel(true);

            // Return to static image after animation
            const timer = setTimeout(() => {
                setShowSpinningWheel(false);
            }, 8000); // 8 seconds

            // Cleanup function only for this timer
            return () => {
                clearTimeout(timer);
            };
        } else if (!hasJoined) {
            SoundManager.stopSpinnerSound();
            hasPlayedSpinnerSoundRef.current = false;
            setShowSpinningWheel(false);
        }
    }, [hasJoined]);

    // Handle timer end - start polling for new round data
    const handleTimerEnd = () => {
        setIsPollingAfterEnd(true);
        refetch(); // Immediate refetch
    };

    // Poll for new round data after timer ends
    useEffect(() => {
        if (!isPollingAfterEnd) return;

        const pollInterval = setInterval(() => {
            refetch();
        }, 5000); // Check every 5 seconds

        // Stop polling after 2 minutes or when new round starts
        const stopTimeout = setTimeout(() => {
            setIsPollingAfterEnd(false);
        }, 120000); // 2 minutes

        return () => {
            clearInterval(pollInterval);
            clearTimeout(stopTimeout);
        };
    }, [isPollingAfterEnd, refetch]);

    // Stop polling when new round starts
    useEffect(() => {
        if (isPollingAfterEnd && round?.startedAt) {
            const now = Math.floor(Date.now() / 1000);
            const endTime = round.startedAt + 600; // 10 minutes
            const remaining = Math.max(0, endTime - now);

            // If we have a new round with time remaining, stop polling
            if (remaining > 0 && remaining < 600) {
                setIsPollingAfterEnd(false);
            }
        }
    }, [isPollingAfterEnd, round?.startedAt]);

    const handleQuestButtonClick = async () => {
        if (!isConnected || !address) {
            openConnectModal?.();
            return;
        }

        if (!isOnCorrectNetwork) {
            toast.error("Please switch to Base network", {
                id: "wrong-network",
            });
            return;
        }

        if (!isAuthorized) {
            // Trigger signing instead of just showing an error
            await signUser();
            return;
        }

        if (!round) {
            toast.error("Loading round data. Please wait...", {
                id: "loading-round",
            });
            return;
        }

        if (round.closed) {
            toast.error(
                "This round has ended. Please wait for the next round.",
                { id: "round-closed" }
            );
            return;
        }

        if (players.length >= MAX_PARTICIPANTS) {
            toast.error(
                `This round is full (${MAX_PARTICIPANTS} players maximum)`,
                {
                    id: "round-full",
                }
            );
            return;
        }

        if (hasJoined) {
            toast.error("You have already joined this round", {
                id: "already-joined",
            });
            return;
        }

        if (usdtBalance < entryFee) {
            const needed = Number(entryFee) / 1000000;
            const current = Number(usdtBalance) / 1000000;
            toast.error(
                `Insufficient USDT. You have ${current} USDT but need ${needed} USDT`,
                { id: "insufficient-balance" }
            );
            return;
        }

        const minEthForGas = BigInt("100000000000000"); // 0.0001 ETH minimum
        const currentEthBalance = ethBalance?.value || BigInt(0);

        if (currentEthBalance < minEthForGas) {
            const currentEth = Number(currentEthBalance) / 1e18;
            toast.error(
                `Insufficient ETH for gas fees. You have ${currentEth.toFixed(
                    4
                )} ETH but need at least 0.0001 ETH`,
                { id: "insufficient-gas" }
            );
            return;
        }

        if ((allowance || 0n) < entryFee) {
            // Need approval first
            approve();
        } else {
            // Already approved, join directly
            join();
        }
    };

    const isLoading =
        isApproving ||
        isApprovingConfirming ||
        isJoining ||
        isJoiningConfirming ||
        isSignPending;
    const hasInsufficientBalance = usdtBalance < entryFee;
    const isButtonDisabled = Boolean(
        (isConnected && isOnCorrectNetwork && hasJoined) ||
            (isConnected && isOnCorrectNetwork && isLoading) ||
            (isConnected && isOnCorrectNetwork && hasInsufficientBalance && isAuthorized)
    );

    // Get quest info based on selected quest
    const getQuestInfo = (questType: QuestType) => {
        const config = QUEST_CONFIGS[questType];
        const questConfig = {
            bronze: { name: config.name, amount: "1 USDT", color: "#EDA94D" },
            silver: { name: config.name, amount: "2 USDT", color: "#D2D2D2" },
            gold: { name: config.name, amount: "5 USDT", color: "#F9C928" },
            crystal: { name: config.name, amount: "10 USDT", color: "#54C3EE" },
        };
        return questConfig[questType];
    };

    const currentQuestInfo = getQuestInfo(selectedQuest);

    // All quests for dropdown
    const allQuests: Array<{
        type: QuestType;
        info: ReturnType<typeof getQuestInfo>;
        disabled?: boolean;
    }> = [
        { type: "bronze", info: getQuestInfo("bronze"), disabled: false },
        { type: "silver", info: getQuestInfo("silver"), disabled: true },
        { type: "gold", info: getQuestInfo("gold"), disabled: true },
        { type: "crystal", info: getQuestInfo("crystal"), disabled: true },
    ];

    const handleQuestSelect = (questType: QuestType) => {
        // Prevent selecting disabled quests
        const quest = allQuests.find((q) => q.type === questType);
        if (quest?.disabled) return;

        setSelectedQuest(questType);
        setIsQuestDropdownOpen(false);
    };

    // Close quest dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setIsQuestDropdownOpen(false);
        if (isQuestDropdownOpen) {
            document.addEventListener("click", handleClickOutside);
            return () =>
                document.removeEventListener("click", handleClickOutside);
        }
    }, [isQuestDropdownOpen]);

    // Determine button text based on state
    const getButtonText = () => {
        if (!isConnected) return "Connect";
        if (!isOnCorrectNetwork) return "Switch Network";
        if (hasJoined) return "Joined";
        if (isSignPending) return "Signing...";
        if (!isAuthorized) return "Sign Message";
        if (hasInsufficientBalance) return "Insufficient Balance";
        if (isJoining || isJoiningConfirming) return "Joining...";
        if (isApproving || isApprovingConfirming) return "Approving...";
        if ((allowance || 0n) < entryFee) return "Approve";
        return "Deposit";
    };

    const previewPlayersCount = Math.min(
        players.length + (hasJoined ? 0 : 1),
        MAX_PARTICIPANTS
    );
    const estimatedProbability = calcWinChance(previewPlayersCount);

    return (
        <main className="min-h-screen bg-[#F7F9FA] pt-[102px] tablet:pt-[80px] overflow-x-hidden">
            <NetworkSwitcher targetChainId={8453} autoSwitch={true} />

            <div className="fixed top-4 right-4 z-50 tablet:hidden">
                <button
                    onClick={() => setShowTestModal(true)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg"
                >
                    🎯 Test Modal
                </button>
            </div>

            <Container className="py-8 tablet:py-4 tablet:px-0 mobile:px-4">
                <div className="flex flex-col items-center gap-8 tablet:gap-4 w-full max-w-[1376px] tablet:max-w-full mx-auto tablet:px-4 mobile:px-0">
                    {/* Title section - Mobile: Shows before hero */}
                    <div className="flex flex-col items-center w-full tablet:gap-[5px]">
                        <h1 className="text-[48px] tablet:text-[24px] font-semibold leading-[1.5em] tracking-[-0.06em] text-[#030303] mb-0 tablet:text-center">
                            GM Quest
                        </h1>
                        <p className="text-[14px] tablet:text-[12px] leading-[1.5em] text-[#888888] text-center tablet:hidden">
                            Quest on CheapGm - 4 quest - 95% in rewards
                        </p>
                    </div>

                    {/* Hero Section - Mobile Only (after heading) */}
                    <HeroSection />

                    {/* Mobile Spin Card - Single white card with all content */}
                    <div className="hidden tablet:flex flex-col w-full bg-white rounded-xl p-[18px_12px] gap-6">
                        {/* Network Selector */}
                        <div className="bg-[rgba(241,241,241,0.6)] rounded-xl px-4 py-3">
                            {isConnected ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-[#888888]">
                                            Current Network
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-[#0C9B4A]" />
                                            <span className="text-[#0C9B4A] text-xs">
                                                Connected
                                            </span>
                                        </div>
                                    </div>
                                    <LotteryNetworkButton
                                        allowedChainIds={LOTTERY_ALLOWED_CHAINS}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#FF4D4F]" />
                                        <span className="text-[#FF4D4F] text-sm">
                                            Not connected
                                        </span>
                                    </div>
                                    <Button
                                        onClick={openConnectModal}
                                        className="w-full bg-[#0177E7] text-white font-medium rounded-xl py-2 text-sm"
                                    >
                                        Connect
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Quest Selection Card - Mobile (same as desktop) */}
                        <div className="bg-[rgba(241,241,241,0.6)] rounded-xl py-4 px-4 flex flex-col justify-center gap-3">
                            <div className="flex flex-col gap-3 w-full relative">
                                {/* Header */}
                                <div className="flex flex-row justify-between w-full gap-1">
                                    <span className="text-sm leading-[1.5em] text-[#888888]">
                                        Choose Quest
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#0C9B4A]" />
                                        <span className="text-sm leading-[1.5em] text-[#0C9B4A]">
                                            Connected
                                        </span>
                                    </div>
                                </div>

                                {/* Quest Selector Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsQuestDropdownOpen(
                                            !isQuestDropdownOpen
                                        );
                                    }}
                                    className="bg-[#F1F1F1] border border-[#E6E6E6] rounded-xl px-5 py-[7px] h-[42px] flex flex-col justify-center w-full hover:bg-[#E9E9E9] transition-colors"
                                >
                                    <div className="flex flex-row justify-between items-center w-full">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-[22px] h-[22px] rounded-full flex-shrink-0"
                                                style={{
                                                    backgroundColor:
                                                        currentQuestInfo.color,
                                                }}
                                            />
                                            <span className="text-sm leading-[1.5em] text-[rgba(3,3,3,0.6)]">
                                                {currentQuestInfo.name} -{" "}
                                                {currentQuestInfo.amount} round
                                            </span>
                                        </div>
                                        <svg
                                            width="12"
                                            height="8"
                                            viewBox="0 0 12 8"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`transition-transform duration-200 ${
                                                isQuestDropdownOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        >
                                            <path
                                                d="M1 1L6 6L11 1"
                                                stroke="#030303"
                                                strokeOpacity="0.6"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {isQuestDropdownOpen && (
                                    <div
                                        className="absolute top-full left-0 right-0 mt-1 bg-[#F1F1F1] border border-[#E6E6E6] rounded-xl overflow-hidden z-10 shadow-lg"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {allQuests.map((quest) => (
                                            <button
                                                key={quest.type}
                                                onClick={() =>
                                                    handleQuestSelect(quest.type)
                                                }
                                                disabled={quest.disabled}
                                                className={`w-full px-5 py-[7px] h-[42px] flex flex-row items-center transition-colors ${
                                                    quest.disabled
                                                        ? "opacity-40 cursor-not-allowed"
                                                        : "hover:bg-[#E9E9E9]"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-[22px] h-[22px] rounded-full flex-shrink-0"
                                                        style={{
                                                            backgroundColor:
                                                                quest.info.color,
                                                        }}
                                                    />
                                                    <span className="text-sm leading-[1.5em] text-[rgba(3,3,3,0.6)]">
                                                        {quest.info.name} -{" "}
                                                        {quest.info.amount} round
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                                                <div>
                            <Suspense fallback={<div>Loading...</div>}>
                                <NFTCarouselMobile />
                            </Suspense>
                        </div>

                        {/* Platform Contribution & Probability */}
                        <div className="bg-[rgba(241,241,241,0.3)] border border-[rgba(230,230,230,0.52)] rounded-2xl px-5 py-3 flex flex-col gap-2.5">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-[#888888]">
                                    Platform contribution
                                </span>
                                <span className="text-sm font-medium text-[rgba(3,3,3,0.6)]">
                                    5%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-[#888888]">
                                    Estimated Probability (dynamic)
                                </span>
                                <span className="text-sm font-medium text-[rgba(3,3,3,0.6)]">
                                    {estimatedProbability}%
                                </span>
                            </div>
                        </div>

                        {/* Wheel - Static on mobile */}
                        <div className="w-full h-[280px] flex items-center justify-center relative">
                            <div className="absolute w-[240px] h-[240px]">
                                <Image
                                    src="/img/spin.png"
                                    alt="GM Lottery Wheel"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Spin Button - Mobile */}
                        <div className="flex items-center justify-center">
                            <SpinButton
                                onClick={handleQuestButtonClick}
                                disabled={isButtonDisabled}
                                buttonText={getButtonText()}
                                isLoading={isLoading}
                            />
                        </div>

                        {/* Timer */}
                        <QuestTimer
                            startedAt={round?.startedAt}
                            intervalSec={600}
                            onTimerEnd={handleTimerEnd}
                        />

                        {/* Quest Selection Cards - Below spin button - 2x2 Grid */}
                        <div className="grid grid-cols-2 gap-2.5 w-full">
                            {allQuests.map((quest) => {
                                const priceValue = quest.info.amount.replace(
                                    " USDT",
                                    ""
                                );
                                return (
                                    <button
                                        key={quest.type}
                                        onClick={() =>
                                            handleQuestSelect(quest.type)
                                        }
                                        disabled={quest.disabled}
                                        className={`flex items-center justify-between gap-[18px] px-3 py-[7px] h-[35px] rounded-xl border ${
                                            quest.type === selectedQuest
                                                ? "bg-[rgba(169,213,255,0.19)] border-[#05ABFF] border-[1.5px]"
                                                : "bg-[rgba(241,241,241,0.4)] border-[rgba(230,230,230,0.52)]"
                                        } ${
                                            quest.disabled
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        <span className="text-sm font-normal">
                                            <span className="text-[rgba(3,3,3,0.6)]">
                                                {quest.info.name.replace(
                                                    " Quest",
                                                    ""
                                                )}{" "}
                                                -{" "}
                                            </span>
                                            <span className="text-[#0177E7]">
                                                ${priceValue}
                                            </span>
                                        </span>
                                        <div
                                            className="w-4 h-4 rounded-full flex-shrink-0"
                                            style={{
                                                backgroundColor:
                                                    quest.info.color,
                                            }}
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Participants Grid */}
                        <ParticipantsGrid
                            participants={players}
                            currentUser={address}
                        />

                        {/* Disclaimer */}
                        <div className="bg-[rgba(241,241,241,0.3)] border border-[rgba(230,230,230,0.52)] rounded-2xl px-3 py-3">
                            <p className="text-[10px] text-[#888888] leading-[1.5em] text-center">
                                Results are generated by verifiable on-chain
                                randomness (Chainlink VRF). No servers, no
                                databases — every outcome can be checked on the
                                blockchain.
                            </p>
                        </div>

                        {/* Reward Distribution */}
                        <div className="flex flex-col gap-6">
                            <div className="inline-flex w-fit bg-[rgba(169,213,255,0.19)] border border-[#05ABFF] rounded-xl px-3 py-2 mx-auto">
                                <span className="text-xs text-[rgba(3,3,3,0.6)]">
                                    🏆 Reward Distribution
                                </span>
                            </div>
                            <div className="grid grid-cols-4 gap-2.5">
                                {[
                                    { place: "1st", percentage: "60%" },
                                    { place: "2nd", percentage: "25%" },
                                    { place: "3rd", percentage: "10%" },
                                    { place: "4th", percentage: "5%" },
                                ].map((reward) => (
                                    <div
                                        key={reward.place}
                                        className="bg-[rgba(241,241,241,0.6)] rounded-2xl p-3 flex flex-col gap-3"
                                    >
                                        <span className="text-sm font-semibold text-[#12694A] w-fit mx-auto">
                                            {reward.place}
                                        </span>
                                        <div className="bg-[#F1F1F1] border border-[#E6E6E6] rounded-xl px-3 py-2 flex items-center justify-center">
                                            <span className="text-xs font-semibold text-[#0177E7]">
                                                {reward.percentage}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="tablet:hidden bg-white border border-[rgba(230,230,230,0.5)] rounded-[20px] p-6 w-full flex flex-col gap-[50px]">
                        {/* NFT Carousel - Top */}
                        <div className="w-full relative -mt-2">
                            {/* Prize Pool Info - Positioned above carousel */}
                            <div className="absolute -top-[70px] left-0">
                                <PrizePoolInfo />
                            </div>
                            <NFTCarousel />
                        </div>

                        {/* Main Content - Middle */}
                        <div className="flex flex-row justify-between gap-[46px]">
                            {/* Left Column */}
                            <div className="flex flex-col items-center gap-[21px] tablet:gap-4 w-[818px] tablet:w-full h-[614px] tablet:h-auto">
                                {/* Timer Header */}
                                <QuestTimer
                                    startedAt={round?.startedAt}
                                    intervalSec={600}
                                    onTimerEnd={handleTimerEnd}
                                />

                                {/* Main content with wheel and selectors */}
                                <div className="flex flex-row tablet:flex-col gap-[0px] tablet:gap-4 relative">
                                    {/* Quest Selector Column */}
                                    <div className="h-[347px] tablet:h-auto">
                                        <QuestSelector
                                            selected={selectedQuest}
                                            onSelect={setSelectedQuest}
                                        />
                                    </div>

                                    {/* Wheel Container */}
                                    <div className="w-[431px] tablet:w-full flex flex-col items-center tablet:max-w-[280px] tablet:mx-auto">
                                        {/* Wheel */}
                                        <div className="w-full h-[440px] tablet:h-[280px] flex items-center justify-center relative">
                                            {/* Static wheel - always present */}
                                            <div
                                                className="absolute w-[328.5px] h-[328.5px] tablet:w-[240px] tablet:h-[240px]"
                                                style={{
                                                    opacity: showSpinningWheel
                                                        ? 0
                                                        : 1,
                                                }}
                                            >
                                                <Image
                                                    src="/img/spin.png"
                                                    alt="GM Lottery Wheel"
                                                    fill
                                                    className="object-contain"
                                                    priority
                                                />
                                            </div>
                                            {/* Spinning GIF - appears instantly when active */}
                                            <div
                                                key={
                                                    showSpinningWheel
                                                        ? Date.now()
                                                        : "static"
                                                }
                                                className="absolute w-[380px] h-[380px] tablet:w-[280px] tablet:h-[280px]"
                                                style={{
                                                    opacity: showSpinningWheel
                                                        ? 1
                                                        : 0,
                                                    pointerEvents:
                                                        showSpinningWheel
                                                            ? "auto"
                                                            : "none",
                                                }}
                                            >
                                                <Image
                                                    src="/gifsAndSounds/SpinWheel.gif"
                                                    alt="GM Lottery Wheel Spinning"
                                                    fill
                                                    className="object-contain"
                                                    unoptimized
                                                />
                                            </div>
                                        </div>

                                        {/* My Quests Button */}
                                        <button
                                            onClick={() => {
                                                // Scroll to winners section (desktop)
                                                const winnersSection =
                                                    document.getElementById(
                                                        "winners-section-desktop"
                                                    );
                                                if (winnersSection) {
                                                    winnersSection.scrollIntoView(
                                                        {
                                                            behavior: "smooth",
                                                            block: "start",
                                                        }
                                                    );
                                                }
                                                // Wait for scroll to complete, then trigger My Quests filter
                                                setTimeout(() => {
                                                    const myQuestsButton =
                                                        document.querySelector(
                                                            "[data-my-quests-button]"
                                                        ) as HTMLButtonElement;
                                                    if (myQuestsButton) {
                                                        myQuestsButton.click();
                                                    }
                                                }, 500);
                                            }}
                                            className="w-[118px] tablet:w-full bg-[#0177E7] text-white rounded-xl px-2 py-[0.5rem] font-base text-base hover:bg-[#0165CC] transition-colors absolute tablet:relative bottom-0 right-0 tablet:bottom-auto tablet:right-auto font-poppins"
                                        >
                                            My Quests
                                        </button>
                                    </div>

                                    {/* Participants List - Desktop */}
                                    <div className="tablet:hidden">
                                        <ParticipantsList
                                            participants={players}
                                        />
                                    </div>

                                    {/* Participants Grid - Mobile */}
                                    <div className="hidden tablet:block">
                                        <ParticipantsGrid
                                            participants={players}
                                            currentUser={address}
                                        />
                                    </div>
                                </div>

                                {/* Disclaimer */}
                                <div className="bg-[rgba(241,241,241,0.5)] border border-[#E6E6E6] rounded-2xl tablet:rounded-xl px-5 tablet:px-3 py-3 tablet:py-2 flex items-center justify-center w-full">
                                    <p className="text-sm tablet:text-xs font-medium text-[#888888] leading-[1.43em] tracking-[0.01em] text-center">
                                        Results are generated by verifiable
                                        on-chain randomness (Chainlink VRF).{" "}
                                        <br className="tablet:hidden" />
                                        No servers, no databases — every outcome
                                        can be checked on the blockchain.
                                    </p>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="flex flex-col items-center w-[525px] tablet:w-full">
                                {/* Cards + Info Block */}
                                <div className="flex flex-col w-full h-[515px] tablet:h-auto gap-[11px] tablet:gap-3">
                                    {/* Current Network Card */}
                                    <div className="bg-[rgba(241,241,241,0.6)] rounded-2xl tablet:rounded-xl px-5 tablet:px-4 py-6 tablet:py-4">
                                        {isConnected ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-[#888888]">
                                                        Current Network
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-[#0C9B4A]" />
                                                        <span className="text-[#0C9B4A] text-sm">
                                                            Connected
                                                        </span>
                                                    </div>
                                                </div>
                                                <LotteryNetworkButton
                                                    allowedChainIds={
                                                        LOTTERY_ALLOWED_CHAINS
                                                    }
                                                />
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-[#FF4D4F]" />
                                                    <span className="text-[#FF4D4F] text-lg">
                                                        Not connected
                                                    </span>
                                                </div>
                                                <p className="text-[#888888] text-sm">
                                                    Connect your wallet to join
                                                    quests and win rewards
                                                </p>
                                                <Button
                                                    onClick={openConnectModal}
                                                    className="w-full bg-[#0177E7] text-white font-medium rounded-xl py-3 gap-2"
                                                >
                                                    Connect
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Quest Selection Card */}
                                    <div className="bg-[rgba(241,241,241,0.6)] rounded-2xl tablet:rounded-xl py-6 tablet:py-4 px-5 tablet:px-4 flex flex-col justify-center gap-5 tablet:gap-3">
                                        <div className="flex flex-col gap-3 w-full relative">
                                            {/* Header */}
                                            <div className="flex flex-row justify-between w-full gap-1">
                                                <span className="text-sm leading-[1.5em] text-[#888888]">
                                                    Choose Quest
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-[#0C9B4A]" />
                                                    <span className="text-sm leading-[1.5em] text-[#0C9B4A]">
                                                        Connected
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Quest Selector Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsQuestDropdownOpen(
                                                        !isQuestDropdownOpen
                                                    );
                                                }}
                                                className="bg-[#F1F1F1] border border-[#E6E6E6] rounded-xl px-5 py-[7px] h-[42px] flex flex-col justify-center w-full hover:bg-[#E9E9E9] transition-colors"
                                            >
                                                <div className="flex flex-row justify-between items-center w-full">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-[22px] h-[22px] rounded-full flex-shrink-0"
                                                            style={{
                                                                backgroundColor:
                                                                    currentQuestInfo.color,
                                                            }}
                                                        />
                                                        <span className="text-sm leading-[1.5em] text-[rgba(3,3,3,0.6)]">
                                                            {
                                                                currentQuestInfo.name
                                                            }{" "}
                                                            -{" "}
                                                            {
                                                                currentQuestInfo.amount
                                                            }{" "}
                                                            round
                                                        </span>
                                                    </div>
                                                    <svg
                                                        width="12"
                                                        height="8"
                                                        viewBox="0 0 12 8"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className={`transition-transform duration-200 ${
                                                            isQuestDropdownOpen
                                                                ? "rotate-180"
                                                                : ""
                                                        }`}
                                                    >
                                                        <path
                                                            d="M1 1L6 6L11 1"
                                                            stroke="#030303"
                                                            strokeOpacity="0.6"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </div>
                                            </button>

                                            {/* Dropdown Menu */}
                                            {isQuestDropdownOpen && (
                                                <div
                                                    className="absolute top-full left-0 right-0 mt-1 bg-[#F1F1F1] border border-[#E6E6E6] rounded-xl overflow-hidden z-10 shadow-lg"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    {allQuests.map((quest) => (
                                                        <button
                                                            key={quest.type}
                                                            onClick={() =>
                                                                handleQuestSelect(
                                                                    quest.type
                                                                )
                                                            }
                                                            disabled={
                                                                quest.disabled
                                                            }
                                                            className={`w-full px-5 py-[7px] h-[42px] flex flex-row items-center transition-colors ${
                                                                quest.disabled
                                                                    ? "opacity-40 cursor-not-allowed"
                                                                    : "hover:bg-[#E9E9E9]"
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="w-[22px] h-[22px] rounded-full flex-shrink-0"
                                                                    style={{
                                                                        backgroundColor:
                                                                            quest
                                                                                .info
                                                                                .color,
                                                                    }}
                                                                />
                                                                <span className="text-sm leading-[1.5em] text-[rgba(3,3,3,0.6)]">
                                                                    {
                                                                        quest
                                                                            .info
                                                                            .name
                                                                    }{" "}
                                                                    -{" "}
                                                                    {
                                                                        quest
                                                                            .info
                                                                            .amount
                                                                    }{" "}
                                                                    round
                                                                </span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info Block */}
                                    <div className="bg-[rgba(241,241,241,0.5)] border border-[#E6E6E6] rounded-2xl px-5 py-3 h-[140px] flex flex-col justify-center items-center gap-2.5 w-full">
                                        <div className="flex flex-row justify-between items-center w-full gap-[38px]">
                                            <span className="text-sm leading-[1.5em] text-[#888888]">
                                                Entry contribution
                                            </span>
                                            <span className="text-base font-medium leading-[1.5em] text-[rgba(3,3,3,0.6)]">
                                                {currentQuestInfo.amount}
                                            </span>
                                        </div>
                                        <div className="flex flex-row justify-between items-center w-full gap-[38px]">
                                            <span className="text-sm leading-[1.5em] text-[#888888]">
                                                Platform contribution
                                            </span>
                                            <span className="text-sm font-medium leading-[1.5em] text-[rgba(3,3,3,0.6)]">
                                                5% (supports XP & rewards)
                                            </span>
                                        </div>
                                        <div className="flex flex-row justify-between items-center w-full gap-[38px]">
                                            <span className="text-sm leading-[1.5em] text-[#888888]">
                                                Estimated Probability (dynamic)
                                            </span>
                                            <span className="text-base font-medium leading-[1.5em] text-[rgba(3,3,3,0.6)]">
                                                {estimatedProbability}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quest Button */}
                                <div className="mt-[-56px] mb-[-15px]">
                                    <SpinButton
                                        onClick={handleQuestButtonClick}
                                        disabled={isButtonDisabled}
                                        buttonText={getButtonText()}
                                        isLoading={isLoading}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Rewards Row - Bottom */}
                        <RewardsRow />
                    </div>

                    {/* Disclaimer - Desktop only */}
                    <div className="tablet:hidden w-full max-w-[1006px] mx-auto bg-[rgba(241,241,241,0.5)] border border-[#E6E6E6] rounded-[12px] px-6 py-4">
                        <p className="text-sm leading-[1.5em] text-[#888888] text-center">
                            <span className="font-medium">
                                Randomness Source : Chainlink VRF
                            </span>
                            <br />
                            CheapGM Quests are skill-based on-chain experiments
                            with verifiable randomness.
                            <br />
                            Results cannot be altered or influenced by any third
                            party. This is not gambling — all outcomes are
                            transparent, on-chain, and provable.
                        </p>
                    </div>

                    {/* Quest Status Section */}
                    <div className="w-full">
                        <h2 className="text-2xl font-semibold text-[#030303] mb-6">
                            Quest Status
                        </h2>
                        {/* Mobile: 1 column - shows on screens <= 768px */}
                        <div className="tablet:flex flex-col gap-3 hidden">
                            <QuestStatusCardMobile
                                questType="bronze"
                                chainId={8453}
                                isSelected={selectedQuest === "bronze"}
                                onClick={() => setSelectedQuest("bronze")}
                            />
                            <div className="relative">
                                <QuestStatusCardMobile
                                    questType="silver"
                                    chainId={8453}
                                    isSelected={selectedQuest === "silver"}
                                    onClick={() => {}}
                                />
                                <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-[1px] rounded-2xl cursor-not-allowed" />
                            </div>
                            <div className="relative">
                                <QuestStatusCardMobile
                                    questType="gold"
                                    chainId={8453}
                                    isSelected={selectedQuest === "gold"}
                                    onClick={() => {}}
                                />
                                <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-[1px] rounded-2xl cursor-not-allowed" />
                            </div>
                            <div className="relative">
                                <QuestStatusCardMobile
                                    questType="crystal"
                                    chainId={8453}
                                    isSelected={selectedQuest === "crystal"}
                                    onClick={() => {}}
                                />
                                <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-[1px] rounded-2xl cursor-not-allowed" />
                            </div>
                        </div>
                        {/* Desktop: 2 columns - shows on screens > 768px */}
                        <div className="grid grid-cols-2 gap-4 tablet:hidden">
                            <QuestStatusCard
                                questType="bronze"
                                chainId={8453}
                                isSelected={selectedQuest === "bronze"}
                                onClick={() => setSelectedQuest("bronze")}
                            />
                            <div className="relative">
                                <QuestStatusCard
                                    questType="silver"
                                    chainId={8453}
                                    isSelected={selectedQuest === "silver"}
                                    onClick={() => {}}
                                />
                                <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-[1px] rounded-2xl cursor-not-allowed" />
                            </div>
                            <div className="relative">
                                <QuestStatusCard
                                    questType="gold"
                                    chainId={8453}
                                    isSelected={selectedQuest === "gold"}
                                    onClick={() => {}}
                                />
                                <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-[1px] rounded-2xl cursor-not-allowed" />
                            </div>
                            <div className="relative">
                                <QuestStatusCard
                                    questType="crystal"
                                    chainId={8453}
                                    isSelected={selectedQuest === "crystal"}
                                    onClick={() => {}}
                                />
                                <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-[1px] rounded-2xl cursor-not-allowed" />
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer - Mobile only */}
                    <div className="hidden tablet:block w-full bg-[rgba(241,241,241,0.5)] border border-[#E6E6E6] rounded-[12px] px-6 py-4">
                        <p className="text-[7px] leading-[1.5em] text-[#888888] text-center">
                            <span className="font-medium">
                                Randomness Source : Chainlink VRF
                            </span>
                            <br />
                            CheapGM Quests are skill-based on-chain experiments
                            with verifiable randomness.
                            <br />
                            Results cannot be altered or influenced by any third
                            party. This is not gambling — all outcomes are
                            transparent, on-chain, and provable.
                        </p>
                    </div>

                    {/* Winners Section - Mobile */}
                    <div id="winners-section-mobile" className="hidden tablet:block">
                        <Suspense fallback={<div>Loading winners...</div>}>
                            <WinnersFeed />
                        </Suspense>
                    </div>

                    {/* Winners Section - Desktop Only */}
                    <div id="winners-section-desktop" className="tablet:hidden w-full bg-white border border-[rgba(230,230,230,0.5)] rounded-[20px] p-6">
                        <Suspense fallback={<div>Loading winners...</div>}>
                            <WinnersFeed />
                        </Suspense>
                    </div>
                </div>
            </Container>

            {/* Join Confirmation Modal - Shows immediately after joining */}
            {showJoinConfirmationModal && joinConfirmationData && (
                <RoundResultModal
                    roundId={round?.id || 0}
                    chainId={chainId}
                    position={joinConfirmationData.position}
                    totalParticipants={joinConfirmationData.totalParticipants}
                    winProbability={joinConfirmationData.winProbability}
                    isWinner={false}
                    prize={null}
                    questType={selectedQuest.toUpperCase()}
                    onClose={() => {
                        setShowJoinConfirmationModal(false);
                        setJoinConfirmationData(null);
                    }}
                />
            )}

            {/* Round Results Modal - Only shows if user won */}
            {pendingResults.length > 0 && (
                <RoundResultModal
                    roundId={pendingResults[0].result.roundId}
                    chainId={pendingResults[0].chainId}
                    position={pendingResults[0].result.position}
                    totalParticipants={
                        pendingResults[0].result.totalParticipants
                    }
                    winProbability={pendingResults[0].result.winProbability}
                    isWinner={pendingResults[0].result.isWinner}
                    prize={pendingResults[0].result.prize}
                    questType={pendingResults[0].result.questType}
                    onClose={() => clearResult(pendingResults[0].roundId)}
                />
            )}

            {/* TEST MODAL - Remove in production */}
            {showTestModal && (
                <RoundResultModal
                    roundId={888}
                    chainId={8453}
                    position={12}
                    totalParticipants={20}
                    winProbability={30}
                    isWinner={false}
                    prize={null}
                    questType="BRONZE"
                    onClose={() => setShowTestModal(false)}
                />
            )}
        </main>
    );
}
