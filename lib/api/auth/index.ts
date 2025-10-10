"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { getUserConfigByAddress } from "@/lib/web3/service/domain";
import { getChainByChain, NETWORKS, ChainId } from "@/config/chains";
import prisma from "@/lib/db";

export const getAuthenticatedUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};

export const isDomainOwner = async (dId: string, chainId: NETWORKS) => {
  const user = await getAuthenticatedUser();
  if (user?.address) {
    const configData = await getUserConfigByAddress(user?.address, chainId);
    return (
      (configData?.allOwnedDomains.findIndex(
        (item) => item.toString() === dId
      ) ?? -1) > -1
    );
  }
  return false;
};

export const isDomainOwnerBySpecificAddress = async (
  dId: string,
  chainId: NETWORKS,
  address: string
) => {
  if (address) {
    const configData = await getUserConfigByAddress(address, chainId);
    return (
      (configData?.allOwnedDomains.findIndex(
        (item) => item.toString() === dId
      ) ?? -1) > -1
    );
  }
  return false;
};

export const isDomainOwnerByDBID = async (profileId: string) => {
  const user = await getAuthenticatedUser();
  const currentDomain = await prisma.domain.findFirst({
    where: {
      id: profileId,
    },
  });
  if (currentDomain) {
    const chainId = getChainByChain(currentDomain.chain as ChainId).id;
    if (user?.address) {
      const configData = await getUserConfigByAddress(user?.address, chainId);
      return (
        (configData?.allOwnedDomains.findIndex(
          (item) => item.toString() === currentDomain.dId
        ) ?? -1) > -1
      );
    }
  }
  return false;
};

export const isHIPOwnerByDBID = async (profileId: string) => {
  console.log(profileId);
  const user = await getAuthenticatedUser();
  const currentHIP = await prisma.hIP.findFirst({
    where: {
      id: profileId,
    },
  });
  if (currentHIP) {
    if (user?.address) {
      return currentHIP.walletAddress === user.address;
    }
  }
  return false;
};

export const isDomainOwnerByAddress = async (
  profileId: string,
  address: string
) => {
  const currentDomain = await prisma.domain.findFirst({
    where: {
      id: profileId,
    },
  });

  if (currentDomain) {
    const chainId = getChainByChain(currentDomain.chain as ChainId).id;
    if (address) {
      const configData = await getUserConfigByAddress(address, chainId);
      return (
        (configData?.allOwnedDomains.findIndex(
          (item) => item.toString() === currentDomain.dId
        ) ?? -1) > -1
      );
    }
  }
  return false;
};

export const isHIPOwnerByAddress = async (
  profileId: string,
  address: string
) => {
  const currentHIP = await prisma.hIP.findFirst({
    where: {
      id: profileId,
    },
  });

  if (currentHIP) {
    if (address) {
      return currentHIP.walletAddress === address;
    }
  }
  return false;
};
