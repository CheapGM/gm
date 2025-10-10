'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatEther, formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import Image from 'next/image';

interface Winner {
  id: number;
  roundId: number;
  walletAddress?: string;
  prizeWei: string;
  rank: number;
  chainId?: number;
  poolWei?: string;
  questType?: string;
  settlementTxHash?: string;
  createdAt: string;
}

type ChainFilter = 'All chains' | 'Base' | 'Ink' | 'Soneium' | 'Unichain';
type QuestFilter =
  | 'All Quests'
  | 'Bronze Quest'
  | 'Silver Quest'
  | 'Crystal Quest'
  | 'Diamond Quest';

const chainFilters: { name: ChainFilter; icon?: string }[] = [
  { name: 'All chains', icon: '/images/chains/web-icon.svg' },
  { name: 'Base', icon: '/images/chains/base.png' },
  { name: 'Ink', icon: '/images/chains/ink.png' },
  { name: 'Soneium', icon: '/images/chains/soneium.png' },
  { name: 'Unichain', icon: '/images/chains/unichain.png' },
];

const questFilters: QuestFilter[] = [
  'All Quests',
  'Bronze Quest',
  'Silver Quest',
  'Crystal Quest',
  'Diamond Quest',
];

async function fetchWinners() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gm-lottery-api-production.up.railway.app';
  const res = await fetch(`${apiUrl}/winners/latest?limit=10`);
  if (!res.ok) throw new Error('Failed to fetch winners');
  return res.json();
}

async function fetchUserWinnings(walletAddress: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gm-lottery-api-production.up.railway.app';
  const res = await fetch(`${apiUrl}/winners/user/${walletAddress}`);
  if (!res.ok) throw new Error('Failed to fetch user winnings');
  return res.json();
}

// Map chainId to chain name
const getChainName = (chainId: number): string => {
  const chains: Record<number, string> = {
    1: 'Ethereum',
    137: 'Polygon',
    8453: 'Base',
    57073: 'Ink',
    1868: 'Soneium',
    1301: 'Unichain',
    11155111: 'Sepolia',
  };
  return chains[chainId] || `Chain ${chainId}`;
};

// Get block explorer URL for a chain
const getBlockExplorerUrl = (chainId: number, txHash: string): string => {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    137: 'https://polygonscan.com',
    8453: 'https://basescan.org',
    57073: 'https://explorer.inkonchain.com',
    1868: 'https://soneium.blockscout.com',
    1301: 'https://unichain-sepolia.blockscout.com',
    11155111: 'https://sepolia.etherscan.io',
  };
  const baseUrl = explorers[chainId] || 'https://etherscan.io';
  return `${baseUrl}/tx/${txHash}`;
};

export function WinnersFeed() {
  const { address } = useAccount();
  const [selectedChainFilter, setSelectedChainFilter] = useState<ChainFilter>('All chains');
  const [selectedQuestFilter, setSelectedQuestFilter] = useState<QuestFilter>('All Quests');
  const [selectedUserFilter, setSelectedUserFilter] = useState<'All Users' | 'My Quests'>(
    'All Users'
  );
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Fetch all winners or user-specific winners based on filter
  const { data, isLoading } = useQuery({
    queryKey: ['winners', selectedUserFilter, address],
    queryFn: () => {
      if (selectedUserFilter === 'My Quests' && address) {
        return fetchUserWinnings(address);
      }
      return fetchWinners();
    },
    refetchInterval: 10000,
    enabled: selectedUserFilter === 'All Users' || (selectedUserFilter === 'My Quests' && !!address),
  });

  // Get base winners list
  const baseWinners: Winner[] = selectedUserFilter === 'My Quests'
    ? (data?.recentWins || [])
    : (data?.winners || []);

  // Apply chain filter
  const filteredByChain = selectedChainFilter === 'All chains'
    ? baseWinners
    : baseWinners.filter(winner => {
        const chainName = winner.chainId ? getChainName(winner.chainId) : '';
        return chainName === selectedChainFilter;
      });

  // Apply quest filter
  const winners = selectedQuestFilter === 'All Quests'
    ? filteredByChain
    : filteredByChain.filter(winner => {
        const questType = (winner.questType || 'BRONZE').toUpperCase();
        const filterQuestType = selectedQuestFilter.replace(' Quest', '').toUpperCase();
        return questType === filterQuestType;
      });

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Title - centered */}
      <div className="flex justify-center">
        <h2 className="text-[32px] font-semibold leading-[1.5em] tracking-[-0.06em] text-[#030303] font-poppins">
          Winners
        </h2>
      </div>

      {/* Chain Filters - full width */}
      <div className="flex items-center gap-[6px] w-full px-5 justify-center">
        <div className="flex items-center gap-[6px]">
          {chainFilters.map((filter) => (
            <button
              key={filter.name}
              onClick={() => setSelectedChainFilter(filter.name)}
              className={`
                flex items-center gap-[11px] px-3 h-[44px] rounded-[14px] transition-all
                ${
                  selectedChainFilter === filter.name
                    ? 'bg-[#F1F1F1] border border-[#0177E7]'
                    : 'bg-[#F1F1F1] hover:bg-[rgba(241,241,241,0.8)]'
                }
              `}
            >
              {filter.icon && (
                <div
                  className={`flex items-center justify-center ${filter.name === 'All chains' ? 'w-[17px] h-[17px] rounded-full bg-[rgba(16,16,16,0.7)]' : 'w-[17px] h-[17px]'}`}
                >
                  <Image
                    src={filter.icon}
                    alt={filter.name}
                    width={17}
                    height={17}
                    className={filter.name === 'All chains' ? '' : 'rounded-full'}
                  />
                </div>
              )}
              <span className="text-sm font-medium text-[#030303] font-inter">{filter.name}</span>
            </button>
          ))}
        </div>
        {/* Dropdown arrow */}
        <Image
          src="/images/chains/dropdown-arrow.svg"
          alt="dropdown"
          width={12}
          height={6}
          className="ml-1"
        />
      </div>

      {/* Quest Tabs + User Filters + View Mode */}
      <div className="flex items-center justify-between h-[57px] border-b border-[rgba(230,230,230,0.8)] bg-white">
        {/* Quest Tabs - Left */}
        <div className="flex items-center gap-5 h-full">
          {questFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedQuestFilter(filter)}
              className={`
                flex items-center justify-center px-5 h-full transition-all font-poppins
                ${
                  selectedQuestFilter === filter
                    ? 'text-[#0177E7] border-b-2 border-[#0177E7] text-base font-medium'
                    : 'text-[#888888] text-base font-medium hover:text-[#030303]'
                }
              `}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* User Filters + View Mode - Right */}
        <div className="flex items-center gap-[10px] h-full">
          {/* All Users / My Quests */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setSelectedUserFilter('All Users')}
              className={`
                px-[10px] py-[10px] rounded-[9px] text-base font-medium font-poppins transition-all
                ${
                  selectedUserFilter === 'All Users'
                    ? 'bg-[rgba(1,119,231,0.1)] border border-[#0177E7] text-[#0177E7]'
                    : 'text-[#0177E7]'
                }
              `}
            >
              All Users
            </button>
            <button
              onClick={() => setSelectedUserFilter('My Quests')}
              className={`
                px-[10px] py-[10px] rounded-[9px] text-base font-medium font-poppins transition-all
                ${
                  selectedUserFilter === 'My Quests'
                    ? 'bg-[rgba(1,119,231,0.1)] border border-[#0177E7] text-[#0177E7]'
                    : 'text-[#0177E7] hover:bg-[rgba(1,119,231,0.05)]'
                }
              `}
            >
              My Quests
            </button>
          </div>

          {/* Divider */}
          <span className="text-[18px] font-normal text-[rgba(3,3,3,0.6)] font-poppins">|</span>

          {/* View Mode Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('list')}
              className={`
                w-[46px] h-[46px] rounded-[51px] flex items-center justify-center transition-all
                ${
                  viewMode === 'list'
                    ? 'bg-[rgba(1,119,231,0.1)] border border-[#0177E7]'
                    : 'hover:bg-[rgba(1,119,231,0.05)]'
                }
              `}
            >
              <div className="relative w-[26.5px] h-[26.5px]">
                <Image
                  src="/images/chains/list-icon-1.svg"
                  alt="list view"
                  width={9}
                  height={10}
                  className="absolute top-[6.94px] left-[10.73px]"
                />
                <Image
                  src="/images/chains/list-icon-2.svg"
                  alt="list view"
                  width={3}
                  height={13}
                  className="absolute top-[6.94px] left-[5.68px]"
                />
              </div>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`
                w-[47px] h-[46px] rounded-[51px] flex items-center justify-center transition-all
                ${
                  viewMode === 'grid'
                    ? 'bg-[rgba(1,119,231,0.1)] border border-[#0177E7]'
                    : 'hover:bg-[rgba(1,119,231,0.05)]'
                }
              `}
            >
              <div className="relative w-[23.83px] h-[23.83px]">
                <Image
                  src="/images/chains/grid-icon-1.svg"
                  alt="grid view"
                  width={18}
                  height={18}
                  className="absolute top-[2.73px] left-[2.73px]"
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full">
        {/* Table Headers */}
        <div className="flex items-center w-full border-b border-[rgba(230,230,230,0.8)] h-[80px]">
          <div className="flex items-center px-5 w-[297px]">
            <span className="text-sm text-[#888888]">Wallet</span>
          </div>
          <div className="flex items-center justify-end px-5 flex-1">
            <span className="text-sm text-[#888888]">Prize</span>
          </div>
          <div className="flex items-center px-5 flex-1">
            <span className="text-sm text-[#888888]">Chain</span>
          </div>
          <div className="flex items-center justify-end px-5 flex-1">
            <span className="text-sm text-[#888888]">Quest</span>
          </div>
          <div className="flex items-center px-5 w-[194px]">
            <span className="text-sm text-[#888888]">Round ID</span>
          </div>
          <div className="flex items-center justify-end px-5 w-[109px]">
            <span className="text-sm text-[#888888]">Total rewards</span>
          </div>
          <div className="flex items-center justify-end px-5 w-[207px]">
            <span className="text-sm text-[#888888]">Finished at</span>
          </div>
        </div>

        {/* Table Rows */}
        {isLoading ? (
          <div className="py-8 text-center text-[#888888]">Loading winners...</div>
        ) : selectedUserFilter === 'My Quests' && !address ? (
          <div className="py-8 text-center text-[#888888]">Connect wallet to see your quests</div>
        ) : winners.length === 0 ? (
          <div className="py-8 text-center text-[#888888]">
            {selectedUserFilter === 'My Quests' ? 'You have no wins yet. Join a quest!' : 'No winners yet. Be the first!'}
          </div>
        ) : (
          winners.map((winner) => (
            <div
              key={winner.id}
              className="flex items-center w-full border-t border-[rgba(230,230,230,0.8)] hover:bg-[rgba(241,241,241,0.3)] transition-colors"
            >
              <div className="flex items-center px-5 py-[37px] w-[297px]">
                <span className="text-base text-[#030303]">
                  {winner.walletAddress ? `${winner.walletAddress.slice(0, 6)}...${winner.walletAddress.slice(-4)}` : 'Unknown'}
                </span>
              </div>
              <div className="flex items-center justify-end px-5 py-5 flex-1">
                <span className="text-base font-medium text-[#030303]">
                  {formatUnits(BigInt(winner.prizeWei), 6)} USDT
                </span>
              </div>
              <div className="flex items-center px-5 py-5 flex-1">
                <span className="text-base text-[#888888]">{winner.chainId ? getChainName(winner.chainId) : 'Unknown'}</span>
              </div>
              <div className="flex items-center justify-end px-5 py-5 flex-1">
                <span className="text-base text-[#888888]">{winner.questType || 'Bronze'}</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-5 w-[194px]">
                <span className="text-base text-[#888888]">#{winner.roundId}</span>
                {winner.settlementTxHash && winner.chainId && (
                  <a
                    href={getBlockExplorerUrl(winner.chainId, winner.settlementTxHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-6 h-6 rounded hover:bg-[rgba(1,119,231,0.1)] transition-colors"
                    title="View settlement transaction"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 3C11 2.44772 11.4477 2 12 2H18C18.5523 2 19 2.44772 19 3V9C19 9.55228 18.5523 10 18 10C17.4477 10 17 9.55228 17 9V5.41421L9.70711 12.7071C9.31658 13.0976 8.68342 13.0976 8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929L15.5858 4H12C11.4477 4 11 3.55228 11 3Z"
                        fill="#0177E7"
                      />
                      <path
                        d="M5 7C3.89543 7 3 7.89543 3 9V15C3 16.1046 3.89543 17 5 17H11C12.1046 17 13 16.1046 13 15V12C13 11.4477 13.4477 11 14 11C14.5523 11 15 11.4477 15 12V15C15 17.2091 13.2091 19 11 19H5C2.79086 19 1 17.2091 1 15V9C1 6.79086 2.79086 5 5 5H8C8.55228 5 9 5.44772 9 6C9 6.55228 8.55228 7 8 7H5Z"
                        fill="#0177E7"
                      />
                    </svg>
                  </a>
                )}
              </div>
              <div className="flex items-center justify-end px-5 py-5 w-[109px]">
                <span className="text-base text-[#888888]">
                  {winner.poolWei ? formatUnits(BigInt(winner.poolWei), 6) : '0'}
                </span>
              </div>
              <div className="flex items-center justify-end px-5 py-5 w-[207px]">
                <span className="text-base text-[#888888]">
                  {new Date(winner.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
