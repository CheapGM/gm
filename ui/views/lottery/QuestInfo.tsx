'use client';

import type { QuestType } from './QuestSelector';

interface QuestInfoProps {
  questType: QuestType;
  network?: string;
  networkConnected?: boolean;
  walletConnected?: boolean;
  roundValue?: string;
  vrfFee?: string;
  randomEstimation?: string;
  probability?: number;
  onQuest?: () => void;
}

export function QuestInfo({
  questType,
  network = 'Polygon',
  networkConnected = true,
  walletConnected = false,
  roundValue = '1 USDT',
  vrfFee = '1 USDT',
  randomEstimation = '5% (Supports API & Keepers)',
  probability = 50,
  onQuest,
}: QuestInfoProps) {
  const questNames = {
    bronze: 'Bronze Quest',
    silver: 'Silver Quest',
    gold: 'Gold Quest',
    crystal: 'Crystal Quest',
  };

  return (
    <div className="bg-[#F7F9FA] rounded-xl p-5 space-y-3">
      {/* Current Network */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#888888]">Current network</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#030303]">{network}</span>
          <div className={`w-2 h-2 rounded-full ${networkConnected ? 'bg-purple-500' : 'bg-gray-400'}`} />
        </div>
      </div>

      {/* Choose Quest Status */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#888888]">Choose Quest</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#030303]">
            {walletConnected ? 'Connected' : 'Not Connected'}
          </span>
          <div className={`w-2 h-2 rounded-full ${walletConnected ? 'bg-cyan-400' : 'bg-gray-400'}`} />
        </div>
      </div>

      {/* Quest Name and Round Value */}
      <div className="bg-white rounded-lg p-3 border border-[rgba(230,230,230,0.5)]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#030303]">
            {questNames[questType]}
          </span>
          <span className="text-sm text-[#888888]">{roundValue} round</span>
        </div>
      </div>

      {/* VRF Verification */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#888888]">VRF verification</span>
        <span className="text-sm font-medium text-[#030303]">{vrfFee}</span>
      </div>

      {/* Random Estimation */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#888888]">Random estimation</span>
        <span className="text-sm font-medium text-[#030303]">{randomEstimation}</span>
      </div>

      {/* Estimated Probability */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#888888]">Estimated Probability (dynamic)</span>
        <span className="text-sm font-medium text-[#030303]">{probability}%</span>
      </div>

      {/* QUEST Button */}
      <button
        onClick={onQuest}
        className="w-full mt-4 relative group"
        disabled={!walletConnected}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-red-400 to-red-600 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition" />
        <div className={`relative bg-gradient-to-b from-red-500 to-red-700 rounded-2xl px-8 py-4 shadow-lg transform transition ${walletConnected ? 'hover:scale-105 active:scale-95' : 'opacity-50 cursor-not-allowed'}`}>
          <div className="text-white font-bold text-xl tracking-wider">QUEST</div>
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl" />
        </div>
      </button>
    </div>
  );
}