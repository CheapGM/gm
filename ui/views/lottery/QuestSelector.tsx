'use client';

import { useState } from 'react';

export type QuestType = 'bronze' | 'silver' | 'gold' | 'crystal';

interface QuestSelectorProps {
  selected: QuestType;
  onSelect: (quest: QuestType) => void;
}

const quests = [
  {
    id: 'bronze' as QuestType,
    name: 'Bronze Quest',
    iconBg: '#B76230',
    icon: '',
  },
  {
    id: 'silver' as QuestType,
    name: 'Silver Quest',
    iconBg: '#84ACC4',
    icon: '',
  },
  {
    id: 'gold' as QuestType,
    name: 'Gold Quest',
    iconBg: '#FFA013',
    icon: '',
  },
  {
    id: 'crystal' as QuestType,
    name: 'Crystal Quest',
    iconBg: '#54C3EE',
    icon: '',
  },
];

export function QuestSelector({ selected, onSelect }: QuestSelectorProps) {
  return (
    <div className="flex flex-col justify-center gap-[17px]">
      {quests.map((quest) => (
        <button
          key={quest.id}
          onClick={() => onSelect(quest.id)}
          className={`
            flex flex-row items-center gap-[4px]
            w-[159px] h-[42px] px-[14px] py-[7px] rounded-xl
            transition-all duration-200
            ${
              selected === quest.id
                ? 'bg-[rgba(169,213,255,0.43)] border-2 border-[#0177E7]'
                : 'bg-[#F1F1F1] border border-[#E6E6E6] hover:bg-[rgba(169,213,255,0.2)]'
            }
          `}
        >
          <div
            className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-xs"
            style={{ backgroundColor: quest.iconBg }}
          >
            {quest.icon}
          </div>
          <span className="text-sm text-[#030303]">{quest.name}</span>
        </button>
      ))}
    </div>
  );
}
