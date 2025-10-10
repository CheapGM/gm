"use client";
import React from "react";
import useUserUpdater from "@store/hooks/useUserUpdater";
import UnAuthWallet from "@/ui/widget/unauth-wallet";

const Updaters = () => {
  // user
  useUserUpdater();

  return <UnAuthWallet />;
};

export default Updaters;
