"use server";

import prisma from "@/lib/db";
import { Chain } from "@prisma/client";
import { NETWORKS, getChainByID } from "@/config/chains";

export interface GMRecord {
  walletAddress: string;
  dId: string;
  chainId: NETWORKS;
}

export const saveGM = async (data: GMRecord) => {
  try {
    const chain = getChainByID(data.chainId).chain;

    const gmRecord = await prisma.gM.create({
      data: {
        walletAddress: data.walletAddress,
        dId: data.dId,
        chain: chain as Chain,
      },
    });

    return { isError: false, error: null, data: gmRecord };
  } catch (e) {
    console.error("Error saving GM record:", e);
    return { isError: true, error: "Failed to save GM record", data: null };
  }
};

// Check if user can send GM (24-hour cooldown)
export const canUserSendGM = async (
  walletAddress: string,
  chainId: NETWORKS
) => {
  try {
    const chain = getChainByID(chainId).chain;

    // Get the last GM for this user on this chain
    const lastGM = await prisma.gM.findFirst({
      where: {
        walletAddress,
        chain: chain as Chain,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!lastGM) {
      // No previous GM, user can send
      return {
        isError: false,
        error: null,
        data: { canSend: true, timeRemaining: 0 },
      };
    }

    // Check if 24 hours have passed
    const now = new Date();
    const hoursDiff =
      (now.getTime() - lastGM.createdAt.getTime()) / (1000 * 60 * 60);
    const canSend = hoursDiff >= 24;
    const timeRemaining = canSend ? 0 : Math.ceil(24 - hoursDiff);

    return {
      isError: false,
      error: null,
      data: {
        canSend,
        timeRemaining,
        lastGM: lastGM.createdAt,
      },
    };
  } catch (e) {
    console.error("Error checking GM cooldown:", e);
    return {
      isError: true,
      error: "Failed to check GM cooldown",
      data: { canSend: false, timeRemaining: 24 },
    };
  }
};

// Helper function to calculate GM streak
const calculateGMStreak = async (whereClause: any): Promise<number> => {
  try {
    // Get all GMs for the user, ordered by date descending
    const gms = await prisma.gM.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    });

    if (gms.length === 0) return 0;

    // Helper function to get date string in YYYY-MM-DD format (UTC)
    const getDateString = (date: Date): string => {
      return date.toISOString().split("T")[0];
    };

    // Get unique days when GMs were sent (in UTC to avoid timezone issues)
    const gmDays = new Set<string>();
    for (const gm of gms) {
      gmDays.add(getDateString(gm.createdAt));
    }

    // Convert to sorted array (most recent first)
    const uniqueDays = Array.from(gmDays).sort().reverse();

    if (uniqueDays.length === 0) return 0;

    const today = getDateString(new Date());

    // Calculate previous day
    const getPreviousDay = (dateStr: string): string => {
      const date = new Date(dateStr + "T00:00:00.000Z");
      date.setUTCDate(date.getUTCDate() - 1);
      return getDateString(date);
    };

    const yesterday = getPreviousDay(today);

    let streak = 0;
    let expectedDay = today;

    // Check if streak should start from today or yesterday
    if (gmDays.has(today)) {
      expectedDay = today;
    } else if (gmDays.has(yesterday)) {
      expectedDay = yesterday;
    } else {
      // No recent GM, streak is 0
      return 0;
    }

    // Count consecutive days backwards
    for (const gmDay of uniqueDays) {
      if (gmDay === expectedDay) {
        streak++;
        expectedDay = getPreviousDay(expectedDay);
      } else if (gmDay < expectedDay) {
        // Found a gap, streak ends
        break;
      }
      // If gmDay > expectedDay, keep looking for the expected day
    }

    return streak;
  } catch (e) {
    console.error("Error calculating GM streak:", e);
    return 0;
  }
};

export const getUserGMStats = async (
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
    const totalCount = await prisma.gM.count({
      where: whereClause,
    });

    // Get today's count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await prisma.gM.count({
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
    const weekCount = await prisma.gM.count({
      where: {
        ...whereClause,
        createdAt: {
          gte: weekStart,
        },
      },
    });

    // Get last GM
    const lastGM = await prisma.gM.findFirst({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate streak
    const gmStreak = await calculateGMStreak(whereClause);

    return {
      isError: false,
      error: null,
      data: {
        totalCount,
        todayCount,
        weekCount,
        lastGM: lastGM?.createdAt || null,
        todayStatus: todayCount > 0,
        gmStreak,
      },
    };
  } catch (e) {
    console.error("Error fetching GM stats:", e);
    return {
      isError: true,
      error: "Failed to fetch GM stats",
      data: {
        totalCount: 0,
        todayCount: 0,
        weekCount: 0,
        lastGM: null,
        todayStatus: false,
        gmStreak: 0,
      },
    };
  }
};

export const getAllUserGMStats = async (walletAddress: string) => {
  try {
    // Get stats across all chains
    const totalStats = await getUserGMStats(walletAddress);

    return {
      isError: false,
      error: null,
      data: totalStats.data,
    };
  } catch (e) {
    console.error("Error fetching all GM stats:", e);
    return {
      isError: true,
      error: "Failed to fetch GM stats",
      data: {
        totalCount: 0,
        todayCount: 0,
        weekCount: 0,
        lastGM: null,
        todayStatus: false,
        gmStreak: 0,
      },
    };
  }
};
