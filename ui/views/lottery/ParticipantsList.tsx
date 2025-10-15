'use client';

interface ParticipantsListProps {
  participants?: string[];
}

export function ParticipantsList({ participants = [] }: ParticipantsListProps) {
  const hasParticipants = participants.length > 0;

  return (
    <div className="flex flex-row gap-[22px] tablet:gap-3 w-[180px] tablet:w-full tablet:max-h-[200px] tablet:overflow-y-auto tablet:px-2">
      {!hasParticipants ? (
        <div className="flex flex-col items-center justify-center w-full py-8 tablet:py-4">
          <p className="text-base tablet:text-sm text-[rgba(3,3,3,0.4)]">No participants yet</p>
        </div>
      ) : (
        <>
          {/* Numbers Column */}
          <div className="flex flex-col items-center gap-3 tablet:gap-2 w-[40px] tablet:w-[30px]">
            {participants.map((_, index) => {
              const isLast = index === participants.length - 1;
              return isLast ? (
                <div
                  key={index}
                  className="text-base tablet:text-sm font-semibold text-[rgba(3,3,3,0.6)] border border-[#1C96FD] rounded-xl tablet:rounded-lg px-2 tablet:px-1.5 py-[3px] tablet:py-[2px] flex items-center justify-center w-full"
                >
                  {index + 1}
                </div>
              ) : (
                <div key={index} className="text-base tablet:text-sm font-semibold text-[rgba(3,3,3,0.6)]">
                  {index + 1}
                </div>
              );
            })}
          </div>

          {/* Addresses Column */}
          <div className="flex flex-col items-center gap-3 tablet:gap-2 w-[118px] tablet:flex-1">
            {participants.map((address, index) => {
              const isLast = index === participants.length - 1;
              const displayAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

              return isLast ? (
                <div
                  key={index}
                  className="text-base tablet:text-sm font-semibold text-[rgba(3,3,3,0.6)] font-sans border border-[#1C96FD] rounded-xl tablet:rounded-lg px-2 tablet:px-1.5 py-[3px] tablet:py-[2px] flex items-center justify-center w-full"
                >
                  {displayAddress}
                </div>
              ) : (
                <div key={index} className="text-base tablet:text-sm font-semibold text-[rgba(3,3,3,0.6)] font-sans">
                  {displayAddress}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
