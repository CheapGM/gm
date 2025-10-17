"use client";
import { useMemo, useRef, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { AuthenticationStatus } from "@rainbow-me/rainbowkit";

const LAST_SIGN_KEY = "gm_last_sign_time";
const INITIAL_LOAD_KEY = "gm_initial_load_completed";
const SIGN_COOLDOWN_MS = 8000; // Don't show modal for 8 seconds after signing

const useAuth = () => {
  const { address, isConnected } = useAccount();
  const { data: session, status: sessionStatus } = useSession();
  const [isClient, setIsClient] = useState(false);

  // Track if we've ever completed initial load (persists across page reloads via localStorage)
  const hasCompletedInitialLoad = useRef(false);
  const initialLoadTimer = useRef<NodeJS.Timeout | null>(null);

  // Client-side only
  useEffect(() => {
    setIsClient(true);

    // Check if initial load was already completed (from localStorage)
    if (typeof window !== "undefined") {
      const completed = localStorage.getItem(INITIAL_LOAD_KEY);
      if (completed === "true") {
        hasCompletedInitialLoad.current = true;
      }
    }
  }, []);

  useEffect(() => {
    // If we've already completed initial load, don't do it again
    if (hasCompletedInitialLoad.current) return;

    // Give 1000ms for initial session hydration on slow mobile networks
    if (sessionStatus !== "loading") {
      initialLoadTimer.current = setTimeout(() => {
        hasCompletedInitialLoad.current = true;
        if (typeof window !== "undefined") {
          localStorage.setItem(INITIAL_LOAD_KEY, "true");
        }
      }, 1000);
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
      if (typeof window !== "undefined") {
        localStorage.setItem(INITIAL_LOAD_KEY, "true");
      }
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

    // During initial load, don't show modal yet
    // This prevents premature modal on mobile where session loads slowly
    if (!hasCompletedInitialLoad.current) return false;

    // Check if user signed recently (within cooldown period)
    // This prevents modal showing right after signing on mobile
    if (isClient && typeof window !== "undefined") {
      const lastSignTime = localStorage.getItem(LAST_SIGN_KEY);
      if (lastSignTime) {
        const timeSinceSign = Date.now() - parseInt(lastSignTime);
        if (timeSinceSign < SIGN_COOLDOWN_MS) {
          return false; // Don't show modal if signed recently
        }
      }
    }

    // If we have a session but addresses don't match, need to re-sign
    if (session?.user?.address && session.user.address !== address) {
      return true;
    }

    // If no session, need to sign
    if (!session?.user?.address) {
      return true;
    }

    return false;
  }, [isLoading, isConnected, address, session?.user?.address, isClient]);

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
