"use client";

import Image from 'next/image';

export function HeroSection() {
    const scrollToSpinButton = () => {
        // Find the spin button element and scroll to it
        const spinButton = document.querySelector('[data-spin-button]');
        if (spinButton) {
            spinButton.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    };

    return (
        <div className="hidden tablet:block w-full rounded-2xl overflow-hidden relative min-h-[281px]">
            {/* Background image */}
            <Image
                src="/img/heroSectionMobile.png"
                alt="Hero background"
                fill
                className="object-cover"
                priority
            />
            
            <div className="relative z-10 min-h-[281px] flex items-center justify-center p-[10px] py-[13px]">
                <div className="w-full flex flex-col justify-between gap-[18px]">
                    <div 
                        className="w-full flex items-center justify-center rounded-2xl p-4 backdrop-blur-[2px] bg-black/30 border border-white/10"
                    >
                        <p className="text-[#F7F9FA] text-[14px] leading-[1.35em] tracking-[0.02em] text-center">
                            🧩 Quick Rules<br />
                            • Min players: 2 | Max: 20<br />
                            • Round time: 10 min<br />
                            • 95% of pool → winners<br />
                            • 5% → XP & ecosystem rewards<br />
                            <br />
                            • 🥇 50%  🥈 20% 🥉 15% 🏅 10%<br />
                            • Randomness: Chainlink VRF
                        </p>
                    </div>

                    <div 
                        className="w-full flex items-center justify-between rounded-full px-[18px] py-4 gap-8 backdrop-blur-[2px] bg-black/30 border border-white/10"
                    >
                        <span className="text-[rgba(241,241,241,0.8)] text-[14px] leading-[1.5em] flex-shrink-0">
                            No backend. Fully on-chain.
                        </span>
                        <button 
                            onClick={scrollToSpinButton}
                            className="bg-[#0177E7] text-white w-[94px] h-[35px] rounded-full text-[14px] font-medium leading-[1.5em] hover:bg-[#0165CC] transition-colors flex items-center justify-center flex-shrink-0"
                        >
                            Play now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
