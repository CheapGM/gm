"use client";

export function RewardDistribution() {
    const rewards = [
        { place: "1st", percentage: "50%", color: "#12694A" },
        { place: "2nd", percentage: "20%", color: "#12694A" },
        { place: "3rd", percentage: "15%", color: "#12694A" },
        { place: "4th", percentage: "10%", color: "#12694A" },
    ];
    
    return (
        <div className="hidden tablet:block w-full">
            {/* Section Header */}
            <div className="bg-[rgba(169,213,255,0.19)] border border-[#05ABFF] rounded-xl px-4 py-2 mb-3">
                <span className="text-sm text-[rgba(3,3,3,0.6)]">
                    🏆 Reward Distribution
                </span>
            </div>
            
            {/* Reward Cards */}
            <div className="grid grid-cols-2 gap-2">
                {rewards.map((reward) => (
                    <div
                        key={reward.place}
                        className="bg-[rgba(241,241,241,0.6)] rounded-2xl p-3 flex flex-col gap-3"
                    >
                        <div className="flex items-center justify-between">
                            <span
                                className="text-sm font-semibold"
                                style={{ color: reward.color }}
                            >
                                {reward.place}
                            </span>
                        </div>
                        <div className="bg-[#F1F1F1] border border-[#E6E6E6] rounded-xl px-4 py-2 flex items-center justify-center">
                            <span className="text-xs font-semibold text-[#0177E7]">
                                {reward.percentage}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
