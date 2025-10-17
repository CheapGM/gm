"use client";
import React, { useEffect, useState, useCallback } from "react";
import { cn } from "@/utils";
import {
  NETWORKS,
  getChainByID,
  getChainColor,
  testnets,
} from "@/config/chains";
import InteractionButton from "@/ui/widget/interaction-button";
import Image from "@/ui/components/image";
import { FavoriteIcon } from "@/ui/components/icon/FavoriteIcon";
import useChainFavorite from "@/ui/hooks/useChainFavorite";
import { useAccount } from "wagmi";
import { FlashIcon } from "@/ui/components/icon/FlashIcon";
import { useDeploy } from "@/ui/hooks/useDeploy";
import { DeployDataResult } from "@/lib/web3/hooks/read/useSingleChainDeployData";
import BeamWrapper from "@/ui/widget/beam-wrapper";
import SuccessModal from "@/ui/components/success-modal";
import useAuth from "@/lib/auth/useAuth";

interface DeployCardProps {
  chainId: NETWORKS;
  isHot?: boolean;
  isNew?: boolean;
  onDeploySuccess?: () => void; // New prop to notify parent of successful deployment
  loadData?: (chainId: NETWORKS) => Promise<DeployDataResult>; // Function to refresh data for this chain
}

const DeployCard: React.FC<DeployCardProps> = ({
  chainId,
  isHot = false,
  isNew = false,
  onDeploySuccess,
  loadData,
}) => {
  const chain = getChainByID(chainId);
  const chainColor = getChainColor(chainId);
  const { isFavorite, onToggleFavorite } = useChainFavorite(chainId);
  const { isConnected } = useAccount();
  const { isAuthorized } = useAuth();

  // Track whether data has been fetched for this chain
  const [hasFetchedData, setHasFetchedData] = useState(false);

  // Local state for Deploy data
  const [deployData, setDeployData] = useState<DeployDataResult>({
    fee: "0",
    totalDeployments: 0,
    lastDeploy: null,
    lastDeployFormatted: "Never",
    todayDeployStatus: false,
  });

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [countdown, setCountdown] = useState<string>("00:00:00");

  // Function to fetch data for this chain
  const fetchChainData = useCallback(async () => {
    if (isAuthorized && loadData) {
      setIsLoadingData(true);
      try {
        const result = await loadData(chainId);
        setDeployData(result);
        setHasFetchedData(true);
      } catch (error) {
        console.error("Error fetching Deploy data for chain", chainId, error);
      } finally {
        setIsLoadingData(false);
      }
    }
  }, [isAuthorized, loadData, chainId]);

  // Callback to refresh deploy data after successful transaction
  const refreshDeployData = useCallback(async () => {
    if (isAuthorized) {
      try {
        // Fetch fresh data and update local state
        await fetchChainData();
        setHasFetchedData(true);
        // Notify parent component about successful deployment
        onDeploySuccess?.();
      } catch (error) {
        console.error("Error refreshing Deploy data for chain", chainId, error);
      }
    }
  }, [isAuthorized, fetchChainData]);

  // Initialize useDeploy with success callback for real-time updates
  const {
    isEnoughBalance,
    isProcessing,
    onDeploy,
    canDeploy,
    isDeploySupported,
    cooldownInfo,
    showSuccessModal,
    setShowSuccessModal,
  } = useDeploy(refreshDeployData);

  const handleDeploy = useCallback(async () => {
    if (!hasFetchedData) {
      fetchChainData();
    }
    await onDeploy();
  }, [onDeploy, fetchChainData, hasFetchedData]);

  // Check if this is the currently connected chain
  const { chainId: connectedChainId } = useAccount();
  const isCurrentChain = connectedChainId === chainId;

  // Function to calculate countdown timer
  const calculateCountdown = useCallback(() => {
    if (!cooldownInfo.lastDeploy || cooldownInfo.canSend) {
      setCountdown("00:00:00");
      return;
    }

    const now = new Date();
    const lastDeployTime = new Date(cooldownInfo.lastDeploy);
    const nextDeployTime = new Date(
      lastDeployTime.getTime() + 24 * 60 * 60 * 1000
    ); // Add 24 hours
    const timeDiff = nextDeployTime.getTime() - now.getTime();

    if (timeDiff <= 0) {
      setCountdown("00:00:00");
      return;
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    setCountdown(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    );
  }, [cooldownInfo.lastDeploy, cooldownInfo.canSend]);

  // Update countdown every second
  useEffect(() => {
    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [calculateCountdown]);

  // Helper function to convert hex to rgba with opacity
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Get button text based on connection status
  const getButtonText = () => {
    if (!isConnected) return "Connect";

    // If this is not the current chain, show switch network option
    if (!isCurrentChain) {
      return `Switch to ${chain.shortName}`;
    }

    // If this is the current chain
    if (!isDeploySupported) return "Deploy Not Available";
    if (isProcessing) return "Deploying...";
    if (!cooldownInfo.canSend && countdown !== "00:00:00") {
      return `Wait ${countdown}`;
    }
    if (!isEnoughBalance) return "Insufficient Balance";
    return `Deploy on ${chain.shortName}`;
  };

  const getButtonDisabled = () => {
    if (!isConnected) return false; // Connect button should be enabled

    // If this is not the current chain, allow clicking to switch networks
    if (!isCurrentChain) return false;

    // If this is the current chain but Deploy not supported, disable the button
    if (isCurrentChain && !isDeploySupported) return true;

    // For supported chains, check other conditions
    return isProcessing || !canDeploy;
  };

  const cardContent = (
    <div className="bg-white rounded-2xl px-5 py-4 flex flex-col justify-between border border-transparent hover:border-primary/20 transition-all duration-300 h-full shadow-shadow2">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-2xl"
            style={{ backgroundColor: hexToRgba(chainColor, 0.2) }}
          >
            <Image
              src={chain.iconUrl || ""}
              alt={chain.name}
              width={32}
              height={32}
              className="rounded-[10px]"
            />
          </div>
          {/* Chain Name and Badge */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <h3 className="text-black text-lg font-semibold">
                {chain.shortName || chain.name}
              </h3>
              {isHot && (
                <span className="bg-hot text-white text-xs font-medium flex items-center justify-center w-9 h-5 rounded-[14px]">
                  Hot
                </span>
              )}
              {isNew && (
                <span className="bg-new text-white text-xs font-medium flex items-center justify-center w-9 h-5 rounded-[14px]">
                  New
                </span>
              )}
            </div>
            <span className="flex items-center text-sm text-text2 h-[25px]">
              {testnets.includes(chainId) ? "Testnet" : "Mainnet"}
            </span>
          </div>
        </div>

        {/* Favorite Heart */}
        <div className="group cursor-pointer" onClick={onToggleFavorite}>
          <FavoriteIcon isFilled={isFavorite} className="fill-primary" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex-1 flex items-center justify-center text-sm min-h-[107px]">
        {!hasFetchedData ? (
          <div className="flex items-center justify-center w-full">
            <InteractionButton
              onClick={fetchChainData}
              disabled={isLoadingData}
              title={isLoadingData ? "Loading..." : "Fetch chain data"}
              className="px-4 py-2 h-8 bg-primary/20 text-primary w-24"
              requiredConnect={true}
            >
              {isLoadingData ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                "Load Info"
              )}
            </InteractionButton>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-between">
              <span className="text-text2">Today&apos;s SC Status</span>
              <span
                className={cn(
                  "text-sm w-[35px] h-[35px] flex items-center justify-center rounded-full",
                  deployData.todayDeployStatus
                    ? "text-primary bg-primary/20"
                    : "text-hot bg-hot/20"
                )}
              >
                {deployData.todayDeployStatus ? "YES" : "NO"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text2">Last Deployed</span>
              <span className="text-black">
                {deployData.lastDeployFormatted}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-text2">Total SC Deployed</div>
              <span className="text-black">
                {deployData.totalDeployments} SCs
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <InteractionButton
        onClick={handleDeploy}
        requiredChain={chainId}
        requiredConnect={true}
        className="w-full h-10 rounded-[10px] gap-1.5 text-white disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-200 disabled:hover:bg-gray-400 mt-6 whitespace-nowrap"
        disabled={getButtonDisabled()}
      >
        {!isConnected && <FlashIcon className="w-4 h-4" />}
        {getButtonText()}
      </InteractionButton>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="deploy"
      />
    </div>
  );

  // Wrap with BeamWrapper animation for active chains (isCurrentChain = true)
  if (isCurrentChain) {
    return (
      <BeamWrapper className="relative" roundClass="rounded-2xl">
        {cardContent}
      </BeamWrapper>
    );
  }

  // Return normal card for inactive chains
  return cardContent;
};

export default DeployCard;
