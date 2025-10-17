"use client";
import { useMemo, useRef, useEffect } from "react";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { AuthenticationStatus } from "@rainbow-me/rainbowkit";

const useAuth = () => {
  const { address, isConnected } = useAccount();
  const { data: session, status: sessionStatus } = useSession();

  // Track if we've ever seen a session to avoid premature triggers
  const hasSeenSession = useRef(false);
  const prevAddress = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (session?.user?.address) {
      hasSeenSession.current = true;
    }
  }, [session?.user?.address]);

  useEffect(() => {
    prevAddress.current = address;
  }, [address]);

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

    // If we haven't seen a session yet and session is still undefined,
    // wait a bit longer to avoid premature triggers on mobile
    if (!hasSeenSession.current && !session?.user?.address) {
      // Give session a chance to load on slow mobile networks
      return false;
    }

    // Only trigger if:
    // 1. We have a session but addresses don't match (user switched wallet)
    // 2. We had a session before but now it's gone (expired)
    if (session?.user?.address) {
      return session.user.address !== address;
    }

    // If we've seen a session before but now it's gone, need to re-sign
    if (hasSeenSession.current && !session?.user?.address) {
      return true;
    }

    // Otherwise, need to sign if connected but no session
    return true;
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
