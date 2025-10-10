"use server";

import prisma from "@/lib/db";
import { Chain } from "@prisma/client";
import { NETWORKS, getChainByID } from "@/config/chains";

export interface DeployRecord {
  walletAddress: string;
  dId: string;
  chainId: NETWORKS;
}

export const saveDeploy = async (data: DeployRecord) => {
  try {
    const chain = getChainByID(data.chainId).chain;

    const deployRecord = await prisma.deploy.create({
      data: {
        walletAddress: data.walletAddress,
        dId: data.dId,
        chain: chain as Chain,
      },
    });

    return { isError: false, error: null, data: deployRecord };
  } catch (e) {
    console.error("Error saving Deploy record:", e);
    return { isError: true, error: "Failed to save Deploy record", data: null };
  }
};

// Check if user can deploy (24-hour cooldown)
export const canUserDeploy = async (
  walletAddress: string,
  chainId: NETWORKS
) => {
  try {
    const chain = getChainByID(chainId).chain;

    // Get the last Deploy for this user on this chain
    const lastDeploy = await prisma.deploy.findFirst({
      where: {
        walletAddress,
        chain: chain as Chain,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!lastDeploy) {
      // No previous Deploy, user can deploy
      return {
        isError: false,
        error: null,
        data: { canSend: true, timeRemaining: 0 },
      };
    }

    // Check if 24 hours have passed
    const now = new Date();
    const hoursDiff =
      (now.getTime() - lastDeploy.createdAt.getTime()) / (1000 * 60 * 60);
    const canSend = hoursDiff >= 24;
    const timeRemaining = canSend ? 0 : Math.ceil(24 - hoursDiff);

    return {
      isError: false,
      error: null,
      data: {
        canSend,
        timeRemaining,
        lastDeploy: lastDeploy.createdAt,
      },
    };
  } catch (e) {
    console.error("Error checking Deploy cooldown:", e);
    return {
      isError: true,
      error: "Failed to check Deploy cooldown",
      data: { canSend: false, timeRemaining: 24 },
    };
  }
};

export const getUserDeployStats = async (
  walletAddress: string,
  chainId?: NETWORKS
) => {
  try {
    const whereClause: any = { walletAddress };

    if (chainId) {
      const chain = getChainByID(chainId).chain;
      whereClause.chain = chain;
    }

    // Get total count
    const totalCount = await prisma.deploy.count({
      where: whereClause,
    });

    // Get today's count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await prisma.deploy.count({
      where: {
        ...whereClause,
        createdAt: {
          gte: today,
        },
      },
    });

    // Get this week's count
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekCount = await prisma.deploy.count({
      where: {
        ...whereClause,
        createdAt: {
          gte: weekStart,
        },
      },
    });

    // Get last Deploy
    const lastDeploy = await prisma.deploy.findFirst({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      isError: false,
      error: null,
      data: {
        totalCount,
        todayCount,
        weekCount,
        lastDeploy: lastDeploy?.createdAt || null,
        todayStatus: todayCount > 0,
      },
    };
  } catch (e) {
    console.error("Error fetching Deploy stats:", e);
    return {
      isError: true,
      error: "Failed to fetch Deploy stats",
      data: {
        totalCount: 0,
        todayCount: 0,
        weekCount: 0,
        lastDeploy: null,
        todayStatus: false,
      },
    };
  }
};

export const getAllUserDeployStats = async (walletAddress: string) => {
  try {
    // Get stats across all chains
    const totalStats = await getUserDeployStats(walletAddress);

    return {
      isError: false,
      error: null,
      data: totalStats.data,
    };
  } catch (e) {
    console.error("Error fetching all Deploy stats:", e);
    return {
      isError: true,
      error: "Failed to fetch Deploy stats",
      data: {
        totalCount: 0,
        todayCount: 0,
        weekCount: 0,
        lastDeploy: null,
        todayStatus: false,
      },
    };
  }
};
