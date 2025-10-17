"use client";
import { useMemo, useRef, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { AuthenticationStatus } from "@rainbow-me/rainbowkit";

const useAuth = () => {
  const { address, isConnected } = useAccount();
  const { data: session, status: sessionStatus } = useSession();

  // Track initial load state to give session time to hydrate on first render
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const initialLoadTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Give 800ms for initial session hydration on slow mobile networks
    // After this, we'll show the modal if still unauthenticated
    if (isInitialLoad && sessionStatus !== "loading") {
      initialLoadTimer.current = setTimeout(() => {
        setIsInitialLoad(false);
      }, 800);
    }

    return () => {
      if (initialLoadTimer.current) {
        clearTimeout(initialLoadTimer.current);
      }
    };
  }, [isInitialLoad, sessionStatus]);

  // Reset initial load state when session is found
  useEffect(() => {
    if (session?.user?.address) {
      setIsInitialLoad(false);
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

    // During initial load (first 800ms), don't show modal yet
    // This prevents premature modal on mobile where session loads slowly
    if (isInitialLoad) return false;

    // If we have a session but addresses don't match, need to re-sign
    if (session?.user?.address && session.user.address !== address) {
      return true;
    }

    // If no session, need to sign
    if (!session?.user?.address) {
      return true;
    }

    return false;
  }, [isLoading, isConnected, address, session?.user?.address, isInitialLoad]);

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
