'use client';

interface ParticipantsListProps {
  participants?: string[];
}

export function ParticipantsList({ participants = [] }: ParticipantsListProps) {
  const hasParticipants = participants.length > 0;

  return (
    <div className="flex flex-row gap-[22px] w-[180px]">
      {!hasParticipants ? (
        <div className="flex flex-col items-center justify-center w-full py-8">
          <p className="text-base text-[rgba(3,3,3,0.4)]">No participants yet</p>
        </div>
      ) : (
        <>
          {/* Numbers Column */}
          <div className="flex flex-col items-center gap-3 w-[40px]">
            {participants.map((_, index) => {
              const isLast = index === participants.length - 1;
              return isLast ? (
                <div
                  key={index}
                  className="text-base font-semibold text-[rgba(3,3,3,0.6)] border border-[#1C96FD] rounded-xl px-2 py-[3px] flex items-center justify-center w-full"
                >
                  {index + 1}
                </div>
              ) : (
                <div key={index} className="text-base font-semibold text-[rgba(3,3,3,0.6)]">
                  {index + 1}
                </div>
              );
            })}
          </div>

          {/* Addresses Column */}
          <div className="flex flex-col items-center gap-3 w-[118px]">
            {participants.map((address, index) => {
              const isLast = index === participants.length - 1;
              const displayAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

              return isLast ? (
                <div
                  key={index}
                  className="text-base font-semibold text-[rgba(3,3,3,0.6)] font-sans border border-[#1C96FD] rounded-xl px-2 py-[3px] flex items-center justify-center w-full"
                >
                  {displayAddress}
                </div>
              ) : (
                <div key={index} className="text-base font-semibold text-[rgba(3,3,3,0.6)] font-sans">
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
