"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IoMdRefresh } from "react-icons/io";
import { toast } from "react-toastify";
import Image from "@/ui/components/image";
import Icon from "@/ui/components/icon";
import React, { useMemo } from "react";
import { useAccount } from "wagmi";
import { copyToClipboard } from "@/utils";
import { useAppSelector } from "@/lib/store";
import { useClientRender } from "@/utils/hooks/useClientRender";
import { Button } from "@/ui/components/button";
import CopyLinkIcon from "@/ui/components/icon/CopyLinkIcon";
import ShareLinkIcon from "@/ui/components/icon/referral/ShareLinkIcon";
import TooltipIcon from "../icon/TooltipIcon";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "gm" | "deploy";
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  type = "gm",
}) => {
  const router = useRouter();
  const { isConnected } = useAccount();
  const isClient = useClientRender();
  const { user } = useAppSelector((state) => state.user);

  // Get referral URL
  const referUrl = useMemo(
    () =>
      isClient
        ? user && user.referralCode
          ? `${window.location.origin}?ref=${user.referralCode}`
          : `${window.location.origin}`
        : "",
    [user, isClient]
  );

  const onCopy = () => {
    if (user) {
      copyToClipboard(referUrl);
      toast.success("Copied to clipboard");
    }
  };

  const onShare = () => {
    let description =
      "🌞 Big GM energy for @gmcheap!\n" +
      "\n" +
      "Mint your onchain GM now and earn up to 25% forever from your referrals 🪙\n" +
      "\n" +
      "Start here →";

    let url = referUrl;
    let hashtags = "GM,CheapGM";
    const encodedText = encodeURIComponent(description);
    const encodedUrl = encodeURIComponent(url);
    const encodedHashtags = encodeURIComponent(hashtags);

    window.open(
      `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=${encodedHashtags}`,
      "_blank"
    );
  };

  const onRedirectToQuest = () => {
    router.push("/quest");
  };

  const handleSocialShare = (platform: string) => {
    const shareUrls = {
      twitter: `https://x.com/gmcheap`,
      telegram: `https://t.me/gmcheap`,
    };

    const shareUrl = shareUrls[platform as keyof typeof shareUrls];
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-light_gray1/20 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative bg-white rounded-[32px] p-[56px] shadow-lgtablet:px-4 tablet:py-6 max-w-xl w-full mx-4 text-text3"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-3.5 right-3.5">
          <Image
            src="/img/close-circle.svg"
            alt="Close"
            width={22}
            height={22}
          />
        </button>

        {/* Success Icon */}
        <div className="flex flex-col items-center space-y-2">
          <Image
            src="/img/success-group.svg"
            alt="Success"
            width={102}
            height={85}
          />

          <h2 className="text-2xl tablet:text-lg font-bold text-center">
            {type === "deploy" ? "Contract Deployed!" : "GM Successfully Sent!"}
          </h2>

          <div className="w-[76px] h-[2px] bg-success1 mx-auto" />
        </div>

        {/* Action Buttons */}
        <div className="space-y-[18px] mt-6">
          <button
            onClick={onClose}
            className="w-full bg-primary/20 text-primary text-sm font-medium flex items-center justify-center gap-2 rounded-xl px-2.5 py-3"
          >
            {type === "deploy" ? "Deploy more contracts" : "Say more GM today"}
            <div className="w-6 h-6 border rounded-full border-primary flex items-center justify-center">
              <ShareLinkIcon className="w-[9px] h-[9px] text-primary" />
            </div>
          </button>
          <button
            onClick={onRedirectToQuest}
            className="w-full bg-primary text-white text-sm font-medium flex items-center justify-center gap-2 rounded-xl px-2.5 py-3"
          >
            Play Quest and win up to X10 from your investment
          </button>
        </div>

        {/* Divider */}
        <div className="bg-gradient_divider h-[1px] w-full max-w-[412px] mx-auto my-8" />

        {/* Invite & Earn Section */}
        <div className="flex flex-col gap-5 items-center">
          <div className="w-full flex flex-col gap-3.5 items-center">
            <div className="flex flex-col items-center gap-1">
              <h3 className="font-bold text-lg">Invite & Earn</h3>
              <span className="text-text2 text-sm text-center">
                Get up to <span className="text-text3/60">25% commission</span>{" "}
                on every {type === "deploy" ? "deployment" : "GM"}
              </span>
            </div>

            {/* Referral Link */}
            {isConnected && (
              <div className="bg-light_bg1/20 rounded-[18px] pl-5 pr-1.5 py-1.5 border border-light_gray w-full max-w-md">
                <div className="flex items-center gap-2">
                  <div className="flex items-center flex-1 h-8 w-full">
                    <p className="text-text2 text-xs truncate max-w-[195px]">
                      {referUrl}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      className="flex-1 bg-primary/20 text-primary rounded-xl py-2.5 px-3 gap-2 font-medium text-sm h-10"
                      onClick={onShare}
                      disabled={!user}
                    >
                      <ShareLinkIcon className="w-4 h-4" />
                      <span className="tablet:hidden">Share</span>
                    </Button>
                    <Button
                      className="bg-primary text-white rounded-xl py-2.5 px-3 min-w-[50px] tablet:min-w-auto h-10"
                      onClick={onCopy}
                    >
                      <CopyLinkIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <p className="text-text3/60 font-medium text-center">
            {type === "deploy"
              ? "Share your deployment success with the community!"
              : "Share your daily GM ritual with the community!"}
          </p>
          <div className="flex justify-center gap-3">
            {["twitter", "telegram"].map((item) => (
              <button
                key={item}
                onClick={() => handleSocialShare(item)}
                className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center transition-colors text-primary"
              >
                <Icon name={item as keyof typeof Icon} size={18} />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SuccessModal;
