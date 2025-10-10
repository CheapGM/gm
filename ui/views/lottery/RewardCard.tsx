'use client';

interface RewardCardProps {
  position: string;
  reward: string;
  questsCount: number;
  icon?: string;
  positionColor: string;
}

export function RewardCard({ position, reward, questsCount, icon, positionColor }: RewardCardProps) {
  return (
    <div className="flex flex-col justify-center gap-5 py-3 px-[10px] rounded-2xl bg-[rgba(241,241,241,0.6)] flex-1">
      {/* Title Container */}
      <div className="flex flex-col gap-3 w-full">
        <div className="flex justify-between items-center gap-2 w-full">
          <span
            className="text-base font-semibold leading-[1.5em] flex-1"
            style={{ color: positionColor }}
          >
            {position}
          </span>
          {icon && (
            <div className="w-[22px] h-[22px] flex-shrink-0">
              <img src={icon} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Info Block */}
        <div className="flex flex-col justify-center gap-[18px] px-[14px] py-[7px] h-[42px] bg-[#F1F1F1] border border-[#E6E6E6] rounded-xl w-full">
          <div className="flex justify-between items-center w-full">
            <span className="text-xs font-semibold leading-[1.5em] text-[#0177E7]">
              {reward}
            </span>
            <span className="text-xs leading-[1.5em] text-[#888888]">
              {questsCount} quests
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
