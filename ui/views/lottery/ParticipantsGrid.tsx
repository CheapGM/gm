"use client";

interface ParticipantsGridProps {
    participants: string[];
    currentUser?: string;
}

export function ParticipantsGrid({ participants, currentUser }: ParticipantsGridProps) {
    const MAX_PARTICIPANTS = 20;
    
    // Fill empty slots
    const allSlots = Array.from({ length: MAX_PARTICIPANTS }, (_, i) => 
        participants[i] || null
    );
    
    // Split into two columns
    const leftColumn = allSlots.slice(0, 10);
    const rightColumn = allSlots.slice(10, 20);
    
    const formatAddress = (address: string | null) => {
        if (!address) return "—";
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };
    
    const isCurrentUser = (address: string | null) => {
        if (!address || !currentUser) return false;
        return address.toLowerCase() === currentUser.toLowerCase();
    };
    
    return (
        <div className="hidden tablet:flex gap-2 w-full">
            {/* Left Column (1-10) */}
            <div className="flex-1 flex gap-2">
                {/* Numbers */}
                <div className="flex flex-col gap-3">
                    {leftColumn.map((address, index) => (
                        <div
                            key={`num-${index}`}
                            className={`text-sm font-semibold ${
                                isCurrentUser(address)
                                    ? 'text-[rgba(3,3,3,0.6)] border border-[#1C96FD] rounded-lg px-2 py-1'
                                    : 'text-[rgba(3,3,3,0.6)]'
                            }`}
                        >
                            {index + 1}.
                        </div>
                    ))}
                </div>
                
                {/* Addresses */}
                <div className="flex-1 flex flex-col gap-3">
                    {leftColumn.map((address, index) => (
                        <div
                            key={`addr-${index}`}
                            className={`text-sm ${
                                isCurrentUser(address)
                                    ? 'font-medium text-[rgba(3,3,3,0.6)] border border-[#1C96FD] rounded-lg px-2 py-1'
                                    : 'text-[rgba(3,3,3,0.6)]'
                            }`}
                        >
                            {formatAddress(address)}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Right Column (11-20) */}
            <div className="flex-1 flex gap-2">
                {/* Numbers */}
                <div className="flex flex-col gap-3">
                    {rightColumn.map((address, index) => (
                        <div
                            key={`num-${index + 10}`}
                            className={`text-sm font-semibold ${
                                isCurrentUser(address)
                                    ? 'text-[rgba(3,3,3,0.6)] border border-[#1C96FD] rounded-lg px-2 py-1'
                                    : 'text-[rgba(3,3,3,0.6)]'
                            }`}
                        >
                            {index + 11}.
                        </div>
                    ))}
                </div>
                
                {/* Addresses */}
                <div className="flex-1 flex flex-col gap-3">
                    {rightColumn.map((address, index) => (
                        <div
                            key={`addr-${index + 10}`}
                            className={`text-sm ${
                                isCurrentUser(address)
                                    ? 'font-medium text-[rgba(3,3,3,0.6)] border border-[#1C96FD] rounded-lg px-2 py-1'
                                    : 'text-[rgba(3,3,3,0.6)]'
                            }`}
                        >
                            {formatAddress(address)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
