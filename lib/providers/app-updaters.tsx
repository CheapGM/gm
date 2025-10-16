"use client";
import React from "react";
import useUserUpdater from "@store/hooks/useUserUpdater";

const Updaters = () => {
  // user
  useUserUpdater();

  return null;
};

export default Updaters;
