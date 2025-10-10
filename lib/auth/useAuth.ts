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
    if (!isLoading && isConnected) {
      if (
        !session?.user?.address ||
        (address && session?.user.address !== address)
      ) {
        return true;
      }
    } else {
      return false;
    }
  }, [isLoading, isConnected, status, session, address]);

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
