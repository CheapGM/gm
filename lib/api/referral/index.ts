"use server";
import { formatEther } from "viem";
import prisma from "@/lib/db";
import { Chain } from "@prisma/client";
import { NETWORKS, getChainByID } from "@/config/chains";
import { getUserConfigByAddress } from "@/lib/web3/service/domain";

export const updateRefer = async (refer: string, chainId: NETWORKS) => {
  const chain = getChainByID(chainId).chain;
  const updateData = await getUserConfigByAddress(refer, chainId);

  if (updateData) {
    const totalEarnings = Number(updateData.totalEarnings);
    const numberOfReferrals = Number(updateData.numberOfReferrals);

    if (numberOfReferrals > 0 || totalEarnings > 0) {
      const referItem = await prisma.referral.findFirst({
        where: { walletAddress: refer, chain: chain as Chain },
      });

      const data = {
        chain: chain as Chain,
        walletAddress: refer,
        totalEarnings: Number(formatEther(updateData.totalEarnings)),
        numberOfReferrals: Number(updateData.numberOfReferrals),
      };
      if (referItem) {
        await prisma.referral.update({ data, where: { id: referItem.id } });
      } else {
        await prisma.referral.create({ data });
      }
    }
  }
};

export const updateGMReferral = async (
  refer: string,
  gmFee: bigint,
  chainId: NETWORKS
) => {
  const chain = getChainByID(chainId).chain;

  // First find the referral item to get its ID
  const referralItem = await prisma.referral.findFirst({
    where: {
      walletAddress: refer,
      chain: chain as Chain,
    },
  });

  // Convert bigint to number with 18 decimal places
  const gmFeeNumber = Number(gmFee) / Math.pow(10, 18);
  const referralAmount = gmFeeNumber * 0.25; // 25% of the GM fee

  if (!referralItem) {
    // Create new referral if not found
    const newReferral = await prisma.referral.create({
      data: {
        chain: chain as Chain,
        walletAddress: refer,
        numberOfReferrals: 1,
        totalEarnings: referralAmount,
      },
    });
    return newReferral.id;
  } else {
    await prisma.referral.update({
      data: {
        totalEarnings: {
          increment: referralAmount,
        },
      },
      where: {
        id: referralItem.id,
      },
    });

    return referralItem.id;
  }
};

export const updateDeployReferral = async (
  refer: string,
  deployFee: bigint,
  chainId: NETWORKS
) => {
  const chain = getChainByID(chainId).chain;

  // First find the referral item to get its ID
  const referralItem = await prisma.referral.findFirst({
    where: {
      walletAddress: refer,
      chain: chain as Chain,
    },
  });

  // Convert bigint to number with 18 decimal places
  const deployFeeNumber = Number(deployFee) / Math.pow(10, 18);
  const referralAmount = deployFeeNumber * 0.25; // 25% of the deploy fee

  if (!referralItem) {
    // Create new referral if not found
    const newReferral = await prisma.referral.create({
      data: {
        chain: chain as Chain,
        walletAddress: refer,
        numberOfReferrals: 1,
        totalEarnings: referralAmount,
      },
    });
    return newReferral.id;
  } else {
    await prisma.referral.update({
      data: {
        totalEarnings: {
          increment: referralAmount,
        },
      },
      where: {
        id: referralItem.id,
      },
    });

    return referralItem.id;
  }
};

export const getReferrals = async (chainId: NETWORKS, address?: string) => {
  const my_earnings = await prisma.referral.findMany({
    where: { walletAddress: address },
  });
  const totalEarnings = my_earnings.reduce(
    (prev, cur) => prev + cur.totalEarnings,
    0
  );
  const my_referrals = await prisma.user.findMany({
    where: { refer: address },
    select: { walletAddress: true },
  });
  const numberOfReferrals = my_referrals.length;

  const chain = getChainByID(chainId).chain;
  const referrals = await prisma.referral.findMany({
    orderBy: { totalEarnings: "desc" },
    where: { chain: chain as Chain, numberOfReferrals: { gt: 0 } },
  });

  const lead = referrals ? referrals : [];
  const my = my_referrals ? my_referrals : [];
  return { lead, my, totalEarnings, numberOfReferrals };
};
