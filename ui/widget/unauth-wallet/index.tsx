"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/ui/components/modal";
import useAuth from "@/lib/auth/useAuth";
import useSign from "@/lib/auth/useSign";
import InteractionButton from "../interaction-button";
import { useClientRender } from "@/utils/hooks/useClientRender";
import { useAccount } from "wagmi";

const UnAuthWallet = () => {
  const { isNeedToResign, isLoading, isAuthorized } = useAuth();
  const { address } = useAccount();
  const isClient = useClientRender();
  const { isPending, signUser } = useSign();
  const [hasSignedRecently, setHasSignedRecently] = useState(false);

  // Check if user has signed recently (within last 5 seconds)
  useEffect(() => {
    if (!address || !isClient) return;

    const key = `signed_${address}`;
    const signedTime = localStorage.getItem(key);
    
    if (signedTime) {
      const timeSinceSigned = Date.now() - parseInt(signedTime);
      // If signed within last 5 seconds, don't show modal
      if (timeSinceSigned < 5000) {
        setHasSignedRecently(true);
        // Clear after 5 seconds
        setTimeout(() => {
          setHasSignedRecently(false);
          localStorage.removeItem(key);
        }, 5000 - timeSinceSigned);
      } else {
        localStorage.removeItem(key);
      }
    }
  }, [address, isClient]);

  // Clear flag when authorized
  useEffect(() => {
    if (isAuthorized && address && isClient) {
      localStorage.removeItem(`signed_${address}`);
      setHasSignedRecently(false);
    }
  }, [isAuthorized, address, isClient]);

  // Don't show modal if:
  // - Session is loading
  // - Already authorized
  // - User just signed (within 5 seconds)
  const shouldShowModal = !!isNeedToResign && isClient && !isLoading && !isAuthorized && !hasSignedRecently;

  const handleSignIn = async () => {
    if (address && isClient) {
      // Mark that user is signing
      localStorage.setItem(`signed_${address}`, Date.now().toString());
      setHasSignedRecently(true);
    }
    await signUser();
  };

  return (
    <div>
      <Modal
        isOpen={shouldShowModal}
        handleClose={() => {}}
        hideCloseButton
        backdropClassName="bg-black/80"
      >
        <div className="flex flex-col justify-between space-y-5 px-3 mobile:text-center">
          <div className="font-medium">
            Please <span className="text-verified">Sign in</span> our platform
            using your wallet
          </div>

          <InteractionButton
            isPending={isPending}
            onClick={handleSignIn}
            className="font-medium text-white"
          >
            Sign In
          </InteractionButton>
        </div>
      </Modal>
    </div>
  );
};

export default UnAuthWallet;
