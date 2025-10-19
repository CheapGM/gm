"use client";
import React, { FC, PropsWithChildren } from "react";
import {
  RainbowKitProvider,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
} from "@rainbow-me/rainbowkit";
import { signIn, signOut } from "next-auth/react";
import { getNonce } from "../auth/nonce";
import useAuth from "../auth/useAuth";

const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    try {
      const nonce = await getNonce();
      return nonce;
    } catch (error) {
      console.error("Failed to get nonce:", error);
      throw new Error("Failed to get authentication nonce");
    }
  },
  createMessage: ({ nonce, address, chainId }) => {
    return `Sign in to gm.cheap\n\nWallet: ${address}\nChain ID: ${chainId}\nNonce: ${nonce}\n\nThis signature will be used to authenticate you on our platform.`;
  },
  verify: async ({ message, signature }) => {
    try {
      // Extract address from the message
      const addressMatch = (message as string).match(
        /Wallet: (0x[a-fA-F0-9]{40})/
      );
      const address = addressMatch ? addressMatch[1] : "";

      if (!address) {
        console.error("Failed to extract address from message");
        return false;
      }

      const verifyResult = await signIn("credentials", {
        message,
        signature,
        address,
        redirect: false,
      });

      return Boolean(verifyResult?.ok);
    } catch (error) {
      console.error("Verification failed:", error);
      return false;
    }
  },
  signOut: async () => {
    try {
      await signOut({ redirect: false });
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  },
});

const RainbowProvider: FC<PropsWithChildren> = ({ children }) => {
  const { status } = useAuth();
  return (
    <>
      <RainbowKitAuthenticationProvider
        adapter={authenticationAdapter}
        status={status}
      >
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </>
  );
};

export default RainbowProvider;
