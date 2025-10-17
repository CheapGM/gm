"use client";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { AuthenticationStatus } from "@rainbow-me/rainbowkit";

const useAuth = () => {
  const { address, isConnected } = useAccount();
  const { data: session, status: sessionStatus } = useSession();

  const isLoading = useMemo(() => sessionStatus === "loading", [sessionStatus]);
  const status = useMemo(
    () =>
      isLoading
        ? "loading"
        : session?.user.address
        ? "authenticated"
        : "unauthenticated",
    [isLoading, session]
  );
  const isAuthorized = useMemo(
    () => !!(isConnected && address && session?.user.address === address),
    [isConnected, address, session]
  );

  const isNeedToResign = useMemo(() => {
    // Don't show modal while loading
    if (isLoading) return false;
    
    // Only show if connected but not authorized
    if (isConnected && address) {
      // Need to sign if no session or address mismatch
      return !session?.user?.address || session.user.address !== address;
    }
    
    return false;
  }, [isLoading, isConnected, session, address]);

  return {
    isLoading,
    isAuthorized,
    isNeedToResign,
    status: status as AuthenticationStatus,
    user: session?.user,
    connectedWallet: address,
  };
};

export default useAuth;
