'use client';

import { RewardCard } from './RewardCard';

const rewardsData = [
  {
    position: '1st Position',
    reward: '50% from the quest',
    questsCount: 4,
    positionColor: '#12694A',
    icon: '/rewards/reward-badge.png',
  },
  {
    position: '2nd Position',
    reward: '20% from the quest',
    questsCount: 4,
    positionColor: '#0A4E58',
    icon: '/rewards/reward-badge.png',
  },
  {
    position: '3rd Position',
    reward: '15% from the quest',
    questsCount: 4,
    positionColor: '#192973',
    icon: '/rewards/reward-badge.png',
  },
  {
    position: '4th Positions',
    reward: '10% from the quest',
    questsCount: 4,
    positionColor: '#480E5D',
    icon: '/rewards/reward-badge.png',
  },
  {
    position: '5th-20th Positions',
    reward: 'NFT reward Badge',
    questsCount: 4,
    positionColor: '#574B0C',
    icon: '/rewards/reward-badge.png',
  },
];

export function RewardsRow() {
  return (
    <div className="flex flex-row justify-stretch items-stretch gap-[9px] w-full">
      {rewardsData.map((reward, index) => (
        <RewardCard key={index} {...reward} />
      ))}
    </div>
  );
}
