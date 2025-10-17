import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useBalance } from "wagmi";
import { useWriteContractGM } from "@/lib/web3/hooks/core/useWriteContractGM";
import { CONTRACTS_GM } from "@/config/contracts";
import { useTransactionStatus } from "@/lib/web3/hooks/core/useTransactionStatus";
import { useAppSelector } from "@/lib/store";
import { isEmpty } from "lodash";
import { useGMData } from "@/lib/web3/hooks/read/useGMData";
import { parseEther } from "viem";
import { canUserSendGM, saveGM } from "@/lib/api/gm";
import { updateGMReferral } from "@/lib/api/referral";
import useAuth from "@/lib/auth/useAuth";

export const useGM = (successCallback?: () => void) => {
  const { user } = useAppSelector((state) => state.user);
  const { address, chainId } = useAccount();
  const { isAuthorized } = useAuth();
  const [fee, setFee] = useState<bigint>(BigInt(0));
  const [cooldownInfo, setCooldownInfo] = useState<{
    canSend: boolean;
    timeRemaining: number;
    lastGM?: Date;
  }>({ canSend: true, timeRemaining: 0 });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const defaultAddressReferral =
    process.env.NEXT_PUBLIC_DEFAULT_ADDRESS_REFERRAL_HIP!;

  // Initialize useGM with success callback for real-time updates
  const { fetchGMFee, isGMSupported } = useGMData(chainId);

  const refer = useMemo(() => {
    if (!user || user.refer === address || isEmpty(user.refer)) {
      return defaultAddressReferral;
    }
    return user.refer ?? defaultAddressReferral;
  }, [user, address, defaultAddressReferral]);

  const {
    data: hash,
    error,
    isPending,
    isError,
    reset,
    callWriteContractGM,
  } = useWriteContractGM();

  // Get current connected chain
  const { chainId: connectedChainId } = useAccount();
  
  // Only fetch balance if we're on the correct chain
  const { data: balanceData } = useBalance({
    address,
    chainId: connectedChainId === chainId ? chainId : undefined,
  });

  // Check cooldown status
  const checkCooldown = useCallback(async () => {
    if (!address || !chainId || !isGMSupported || !isAuthorized) {
      setCooldownInfo({ canSend: true, timeRemaining: 0 });
      return;
    }

    try {
      const result = await canUserSendGM(address, chainId);

      if (!result.isError) {
        setCooldownInfo({
          canSend: result.data.canSend,
          timeRemaining: result.data.timeRemaining,
          lastGM: result.data.lastGM ? new Date(result.data.lastGM) : undefined,
        });
      } else {
        console.error("Failed to check GM cooldown:", result.error);
        setCooldownInfo({ canSend: true, timeRemaining: 0 });
      }
    } catch (error) {
      console.error("Error checking GM cooldown:", error);
      setCooldownInfo({ canSend: true, timeRemaining: 0 });
    }
  }, [address, chainId, isAuthorized]);

  // Enhanced transaction status to save to database
  const handleTransactionSuccess = useCallback(async () => {
    // Show success modal instead of toast
    setShowSuccessModal(true);
    // Call the original success callback first
    if (successCallback) {
      successCallback();
    }
  }, [successCallback]);

  const { isLoading, receipt, isSuccess } = useTransactionStatus(
    hash,
    "GM sent successfully! 👋",
    handleTransactionSuccess,
    reset,
    false // Don't show toast, we'll show modal instead
  );

  // Save to database when transaction is successful
  useEffect(() => {
    const saveGMToDatabase = async () => {
      if (
        isSuccess &&
        receipt &&
        address &&
        chainId &&
        isGMSupported &&
        isAuthorized
      ) {
        try {
          const result = await saveGM({
            walletAddress: address,
            dId: receipt.blockNumber.toString(),
            chainId: chainId,
          });

          if (!result.isError) {
            console.log("GM record saved to database successfully");

            // Update referral earnings if there's a valid referrer
            if (refer !== defaultAddressReferral) {
              await updateGMReferral(refer, fee, chainId);
            }

            // Trigger success callback again after database save to refresh UI
            if (successCallback) {
              successCallback();
            }
            // Refresh cooldown status after successful GM
            checkCooldown();
          } else {
            console.error("Failed to save GM to database:", result.error);
          }
        } catch (error) {
          console.error("Error saving GM to database:", error);
        }
      }
    };

    saveGMToDatabase();
  }, [isSuccess, receipt, address, chainId, isAuthorized]);

  useEffect(() => {
    if (isError) {
      console.error("Error sending GM:", error);
      toast.error("Failed to send GM. Please try again.");
    }
  }, [isError, error]);

  // Check cooldown when component mounts or dependencies change
  useEffect(() => {
    if (address && chainId && isGMSupported && isAuthorized) {
      checkCooldown();
    }
  }, [address, chainId, isAuthorized]);

  const isProcessing = useMemo(
    () => (isLoading && !!hash) || isPending,
    [isLoading, hash, isPending]
  );

  const isEnoughBalance = useMemo(() => {
    // If not on the correct chain, assume balance is sufficient (will check after switch)
    if (connectedChainId !== chainId) return true;
    if (!balanceData || !fee) return false;
    return balanceData.value >= fee;
  }, [balanceData, fee, connectedChainId, chainId]);

  const canSendGM = useMemo(() => {
    return (
      !isProcessing && isEnoughBalance && cooldownInfo.canSend && isGMSupported
    );
  }, [isProcessing, isEnoughBalance, cooldownInfo.canSend, isGMSupported]);

  const onSayGM = useCallback(async () => {
    // Check authorization first - if not authorized, the button should show "Sign Message"
    // and this function shouldn't be called
    if (!isAuthorized) {
      console.warn("onSayGM called without authorization");
      return;
    }

    if (!canSendGM) {
      if (!isGMSupported) {
        toast.error("GM is not supported on this chain");
        return;
      }
      if (!isEnoughBalance) {
        toast.error("Insufficient balance.");
        return;
      }
      if (!cooldownInfo.canSend) {
        toast.error(
          `Please wait ${cooldownInfo.timeRemaining} more hours before sending another GM`
        );
      }
      return;
    }

    try {
      await callWriteContractGM(
        {
          contract: CONTRACTS_GM.GM,
          functionName: "sayGM",
          value: fee,
        },
        chainId,
        refer
      );
    } catch (error) {
      console.error("Error calling sayGM:", error);
      toast.error("Failed to send GM");
    }
  }, [
    isAuthorized,
    canSendGM,
    cooldownInfo,
    callWriteContractGM,
    fee,
    chainId,
    refer,
    isGMSupported,
    isEnoughBalance,
  ]);

  // Fetch actual fee from contract
  useEffect(() => {
    const fetchFee = async () => {
      try {
        if (isGMSupported) {
          const feeString = await fetchGMFee();
          const feeInWei = parseEther(feeString);
          setFee(feeInWei);
        } else {
          setFee(parseEther("0")); // Set to 0 for unsupported chains
        }
      } catch (error) {
        console.error("Error fetching GM fee:", error);
        // Fallback to default fee if contract call fails
        setFee(parseEther("0.001")); // 0.001 ETH
      }
    };

    if (chainId && isAuthorized) {
      fetchFee();
    }
  }, [chainId, isAuthorized]);

  return {
    isEnoughBalance,
    isProcessing,
    onSayGM,
    fee,
    hash,
    isError,
    error,
    canSendGM,
    cooldownInfo,
    isGMSupported,
    showSuccessModal,
    setShowSuccessModal,
  };
};
