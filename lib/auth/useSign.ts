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

      const result = await signIn("credentials", {
        message,
        signature,
        address,
        redirect: false,
      });

      if (result?.ok) {
        toast.success("Successfully signed in!");
        // Give time for session to update
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        throw new Error(result?.error || "Failed to sign in");
      }
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
