import { CHAINS, NETWORKS } from "@/config/chains";
import { PublicClient, createPublicClient, http } from "viem";

export type CreatePublicClientParams = {
  transportSignal?: AbortSignal;
};

export function createViemPublicClients() {
  return CHAINS.reduce((prev, cur) => {
    return {
      ...prev,
      [cur.id]: createPublicClient({
        chain: cur,
        transport: http(cur.rpcUrls?.default?.http?.[0]),
        batch: {
          multicall: {
            batchSize: 1024 * 200,
            wait: 16,
          },
        },
        pollingInterval: 6_000,
      }),
    };
  }, {} as Record<NETWORKS, PublicClient>);
}

export const viemClients = createViemPublicClients();

export const getViemClients = createViemPublicClientGetter({ viemClients });

type CreateViemPublicClientGetterParams = {
  viemClients?: Record<NETWORKS, PublicClient>;
} & CreatePublicClientParams;

export function createViemPublicClientGetter({
  viemClients: viemClientsOverride,
}: CreateViemPublicClientGetterParams = {}) {
  const clients = viemClientsOverride || createViemPublicClients();

  return function getClients({
    chainId,
  }: {
    chainId?: NETWORKS;
  }): PublicClient {
    return clients[chainId as NETWORKS];
  };
}

export const CLIENT_CONFIG = {
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
};

export const publicClient = (chainId: NETWORKS = NETWORKS.DEFAULT) => {
  if (chainId && viemClients[chainId]) {
    return viemClients[chainId];
  }

  const chain = CHAINS.find((c) => c.id === chainId);
  return createPublicClient({
    chain,
    transport: http(chain?.rpcUrls?.default?.http?.[0]),
    ...CLIENT_CONFIG,
  });
};
