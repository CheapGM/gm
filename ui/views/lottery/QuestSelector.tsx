'use client';

import { useState } from 'react';
import { SoundManager } from '@/lib/utils/sound';

export type QuestType = 'bronze' | 'silver' | 'gold' | 'crystal';

interface QuestSelectorProps {
  selected: QuestType;
  onSelect: (quest: QuestType) => void;
}

const quests = [
  {
    id: 'bronze' as QuestType,
    name: 'Bronze Quest',
    iconBg: '#EDA94D',
    icon: '',
    disabled: false,
  },
  {
    id: 'silver' as QuestType,
    name: 'Silver Quest',
    iconBg: '#D2D2D2',
    icon: '',
    disabled: true,
  },
  {
    id: 'gold' as QuestType,
    name: 'Gold Quest',
    iconBg: '#F9C928',
    icon: '',
    disabled: true,
  },
  {
    id: 'crystal' as QuestType,
    name: 'Crystal Quest',
    iconBg: '#54C3EE',
    icon: '',
    disabled: true,
  },
];

export function QuestSelector({ selected, onSelect }: QuestSelectorProps) {
  const handleQuestClick = (questId: QuestType, disabled: boolean) => {
    if (disabled) return;
    SoundManager.playButtonClick();
    onSelect(questId);
  };

  return (
    <div className="flex flex-col tablet:flex-row tablet:flex-wrap justify-center gap-[17px] tablet:gap-2">
      {quests.map((quest) => (
        <button
          key={quest.id}
          onClick={() => handleQuestClick(quest.id, quest.disabled)}
          disabled={quest.disabled}
          className={`
            flex flex-row items-center gap-[4px]
            w-[159px] tablet:flex-1 tablet:min-w-[140px] h-[42px] tablet:h-[38px] px-[14px] tablet:px-3 py-[7px] tablet:py-1.5 rounded-xl tablet:rounded-lg
            transition-all duration-200
            ${
              quest.disabled
                ? 'bg-[#F1F1F1] border border-[#E6E6E6] opacity-40 cursor-not-allowed'
                : selected === quest.id
                ? 'bg-[rgba(169,213,255,0.43)] border-2 border-[#0177E7]'
                : 'bg-[#F1F1F1] border border-[#E6E6E6] hover:bg-[rgba(169,213,255,0.2)]'
            }
          `}
        >
          <div
            className="w-[22px] h-[22px] tablet:w-[18px] tablet:h-[18px] rounded-full flex items-center justify-center text-xs"
            style={{ backgroundColor: quest.iconBg }}
          >
            {quest.icon}
          </div>
          <span className="text-sm tablet:text-xs text-[#030303]">{quest.name}</span>
        </button>
      ))}
    </div>
  );
}
