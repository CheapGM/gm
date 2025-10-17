import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useBalance } from "wagmi";
import { useWriteContractDeploy } from "@/lib/web3/hooks/core/useWriteContractDeploy";
import { CONTRACTS_DEPLOY } from "@/config/contracts";
import { useTransactionStatus } from "@/lib/web3/hooks/core/useTransactionStatus";
import { useAppSelector } from "@/lib/store";
import { isEmpty } from "lodash";
import { useDeployData } from "@/lib/web3/hooks/read/useDeployData";
import { parseEther } from "viem";
import { canUserDeploy, saveDeploy } from "@/lib/api/deploy";
import { updateDeployReferral } from "@/lib/api/referral";
import useAuth from "@/lib/auth/useAuth";

export const useDeploy = (successCallback?: () => void) => {
  const { user } = useAppSelector((state) => state.user);
  const { address, chainId } = useAccount();
  const { isAuthorized } = useAuth();
  const [fee, setFee] = useState<bigint>(BigInt(0));
  const [cooldownInfo, setCooldownInfo] = useState<{
    canSend: boolean;
    timeRemaining: number;
    lastDeploy?: Date;
  }>({ canSend: true, timeRemaining: 0 });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const defaultAddressReferral =
    process.env.NEXT_PUBLIC_DEFAULT_ADDRESS_REFERRAL_HIP!;

  const { fetchDeployFee, isDeploySupported } = useDeployData(chainId);

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
    callWriteContractDeploy,
  } = useWriteContractDeploy();

  // Get current connected chain
  const { chainId: connectedChainId } = useAccount();
  
  // Only fetch balance if we're on the correct chain
  const { data: balanceData } = useBalance({
    address,
    chainId: connectedChainId === chainId ? chainId : undefined,
  });

  // Check cooldown status
  const checkCooldown = useCallback(async () => {
    if (!address || !chainId || !isDeploySupported || !isAuthorized) {
      setCooldownInfo({ canSend: true, timeRemaining: 0 });
      return;
    }

    try {
      const result = await canUserDeploy(address, chainId);

      if (!result.isError) {
        setCooldownInfo({
          canSend: result.data.canSend,
          timeRemaining: result.data.timeRemaining,
          lastDeploy: result.data.lastDeploy
            ? new Date(result.data.lastDeploy)
            : undefined,
        });
      } else {
        console.error("Failed to check Deploy cooldown:", result.error);
        setCooldownInfo({ canSend: true, timeRemaining: 0 });
      }
    } catch (error) {
      console.error("Error checking Deploy cooldown:", error);
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
    "Smart contract deployed successfully! ⚡",
    handleTransactionSuccess,
    reset,
    false // Don't show toast, we'll show modal instead
  );

  // Save to database when transaction is successful
  useEffect(() => {
    const saveDeployToDatabase = async () => {
      if (
        isSuccess &&
        receipt &&
        address &&
        chainId &&
        isDeploySupported &&
        isAuthorized
      ) {
        try {
          const result = await saveDeploy({
            walletAddress: address,
            dId: receipt.blockNumber.toString(),
            chainId: chainId,
          });

          if (!result.isError) {
            console.log("Deploy record saved to database successfully");

            // Update referral earnings if there's a valid referrer
            if (refer !== defaultAddressReferral) {
              await updateDeployReferral(refer, fee, chainId);
            }

            // Trigger success callback again after database save to refresh UI
            if (successCallback) {
              successCallback();
            }
            // Refresh cooldown status after successful deploy
            checkCooldown();
          } else {
            console.error("Failed to save Deploy to database:", result.error);
          }
        } catch (error) {
          console.error("Error saving Deploy to database:", error);
        }
      }
    };

    saveDeployToDatabase();
  }, [isSuccess, receipt, address, chainId, isAuthorized]);

  useEffect(() => {
    if (isError) {
      console.error("Error deploying contract:", error);
      toast.error("Failed to deploy contract. Please try again.");
    }
  }, [isError, error]);

  // Check cooldown when component mounts or dependencies change
  useEffect(() => {
    if (address && chainId && isDeploySupported && isAuthorized) {
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

  const canDeploy = useMemo(() => {
    return (
      !isProcessing &&
      isEnoughBalance &&
      cooldownInfo.canSend &&
      isDeploySupported
    );
  }, [isProcessing, isEnoughBalance, cooldownInfo.canSend, isDeploySupported]);

  const onDeploy = useCallback(async () => {
    // Check authorization first - if not authorized, the button should show "Sign Message"
    // and this function shouldn't be called
    if (!isAuthorized) {
      console.warn("onDeploy called without authorization");
      return;
    }

    if (!canDeploy) {
      if (!isDeploySupported) {
        toast.error("Deploy is not supported on this chain");
        return;
      }
      if (!isEnoughBalance) {
        toast.error("Insufficient balance.");
        return;
      }
      if (!cooldownInfo.canSend) {
        toast.error(
          `Please wait ${cooldownInfo.timeRemaining} more hours before deploying another contract`
        );
      }
      return;
    }

    try {
      await callWriteContractDeploy(
        {
          contract: CONTRACTS_DEPLOY.DEPLOY,
          functionName: "deploy",
          value: fee,
        },
        chainId,
        refer
      );
    } catch (error) {
      console.error("Error calling deploy:", error);
      toast.error("Failed to deploy contract");
    }
  }, [
    isAuthorized,
    canDeploy,
    cooldownInfo,
    callWriteContractDeploy,
    fee,
    chainId,
    refer,
    isDeploySupported,
    isEnoughBalance,
  ]);

  // Fetch actual fee from contract
  useEffect(() => {
    const fetchFee = async () => {
      try {
        if (isDeploySupported) {
          const feeString = await fetchDeployFee();
          const feeInWei = parseEther(feeString);
          setFee(feeInWei);
        } else {
          setFee(parseEther("0")); // Set to 0 for unsupported chains or unauthorized users
        }
      } catch (error) {
        console.error("Error fetching deploy fee:", error);
        // Fallback to default fee if contract call fails
        setFee(parseEther("0.005")); // 0.005 ETH
      }
    };

    if (chainId && isAuthorized) {
      fetchFee();
    }
  }, [chainId, isAuthorized]);

  return {
    isEnoughBalance,
    isProcessing,
    onDeploy,
    fee,
    hash,
    isError,
    error,
    canDeploy,
    cooldownInfo,
    isDeploySupported,
    showSuccessModal,
    setShowSuccessModal,
  };
};
