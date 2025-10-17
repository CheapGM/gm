"use client";
import { useMemo, useRef, useEffect } from "react";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { AuthenticationStatus } from "@rainbow-me/rainbowkit";

const useAuth = () => {
  const { address, isConnected } = useAccount();
  const { data: session, status: sessionStatus } = useSession();

  // Track if we've ever completed initial load (persists across remounts)
  const hasCompletedInitialLoad = useRef(false);
  const initialLoadTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If we've already completed initial load, don't do it again
    if (hasCompletedInitialLoad.current) return;

    // Give 600ms for initial session hydration on slow mobile networks
    if (sessionStatus !== "loading") {
      initialLoadTimer.current = setTimeout(() => {
        hasCompletedInitialLoad.current = true;
      }, 600);
    }

    return () => {
      if (initialLoadTimer.current) {
        clearTimeout(initialLoadTimer.current);
      }
    };
  }, [sessionStatus]);

  // Immediately mark as loaded when session is found
  useEffect(() => {
    if (session?.user?.address) {
      hasCompletedInitialLoad.current = true;
      if (initialLoadTimer.current) {
        clearTimeout(initialLoadTimer.current);
      }
    }
  }, [session?.user?.address]);

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
    // Don't show modal while session is loading
    if (isLoading) return false;

    // If not connected, no need to sign
    if (!isConnected || !address) return false;

    // During initial load (first 600ms), don't show modal yet
    // This prevents premature modal on mobile where session loads slowly
    if (!hasCompletedInitialLoad.current) return false;

    // If we have a session but addresses don't match, need to re-sign
    if (session?.user?.address && session.user.address !== address) {
      return true;
    }

    // If no session, need to sign
    if (!session?.user?.address) {
      return true;
    }

    return false;
  }, [isLoading, isConnected, address, session?.user?.address]);

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
