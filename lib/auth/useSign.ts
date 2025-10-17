import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { useAccount, useSignMessage } from "wagmi";
import { toast } from "sonner";
import { getNonce } from "./nonce";

const useSign = () => {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isPending, setIsPending] = useState(false);

  const signUser = useCallback(async () => {
    if (!address || !chainId) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsPending(true);
    try {
      const nonce = await getNonce();
      if (!nonce) {
        throw new Error("Failed to get nonce");
      }

      // Create a simple message for wallet authentication
      const message = `Sign in to gm.cheap\n\nWallet: ${address}\nChain ID: ${chainId}\nNonce: ${nonce}\n\nThis signature will be used to authenticate you on our platform.`;

      const signature = await signMessageAsync({
        message,
      });

      await signIn("credentials", {
        message,
        signature,
        address,
        redirect: false,
      });
    } catch (error: any) {
      console.error("Signing error:", error);
      if (error?.message?.includes("User rejected the request")) {
        toast.error(
          "You rejected the request. Please sign the message to continue."
        );
      } else {
        console.error("An unexpected error occurred:", error);
        toast.error(
          error?.message || "An unexpected error occurred during signing"
        );
      }
    } finally {
      setIsPending(false);
    }
  }, [address, chainId, signMessageAsync]);

  return { signUser, isPending };
};

export default useSign;
