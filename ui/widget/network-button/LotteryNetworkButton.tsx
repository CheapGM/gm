import React, { useState } from "react";
import Image from "@/ui/components/image";
import { LuSettings2 } from "react-icons/lu";
import { SwitchNetworkIcon } from "@/ui/components/icon/SwitchNetworkIcon";
import { useSwitchChain, useAccount } from "wagmi";
import { CHAINS } from "@/config/chains";

interface LotteryNetworkButtonProps {
  allowedChainIds?: number[];
}

export const LotteryNetworkButton = ({ allowedChainIds }: LotteryNetworkButtonProps = {}) => {
  const { switchChain } = useSwitchChain();
  const { chain } = useAccount();
  const [isOpen, setIsOpen] = useState(false);

  const isUnsupported = allowedChainIds && chain && !allowedChainIds.includes(chain.id);

  // Filter available chains to only show allowed ones
  const availableChains = CHAINS.filter(c =>
    allowedChainIds?.includes(c.id)
  );

  const handleNetworkClick = (chainId: number) => {
    switchChain?.({ chainId });
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  if (isUnsupported) {
    return (
      <div className="w-full">
        <div
          onClick={() => allowedChainIds?.[0] && handleNetworkClick(allowedChainIds[0])}
          className="flex items-center justify-between px-4 py-3 bg-light_bg2/40 rounded-xl space-x-3 cursor-pointer text-text3/60 hover:text-primary"
        >
          <div className="flex items-center space-x-3">
            <LuSettings2 className="w-6 h-6 text-text2" />
            <p className="text-sm font-medium text-error">
              Wrong Network
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get current chain info from CHAINS
  const currentChainInfo = CHAINS.find(c => c.id === chain?.id);

  return (
    <div className="w-full relative">
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`
          flex items-center justify-between px-5 h-[42px] rounded-xl cursor-pointer
          transition-all duration-200
          ${
            isOpen
              ? 'bg-[rgba(169,213,255,0.43)] border-2 border-[#0177E7]'
              : 'bg-[#F1F1F1] border border-[#E6E6E6] hover:bg-[rgba(169,213,255,0.2)]'
          }
        `}
      >
        <div className="flex items-center gap-2.5">
          <SwitchNetworkIcon />
          <span className="text-sm text-[#030303]">{chain?.name}</span>
        </div>
        {currentChainInfo?.iconUrl && (
          <div
            className="w-[22px] h-[22px] rounded-full overflow-hidden"
          >
            <Image
              width={22}
              height={22}
              alt={chain?.name ?? "Chain icon"}
              src={currentChainInfo.iconUrl}
            />
          </div>
        )}
      </div>

      {/* Custom dropdown with only allowed networks */}
      {isOpen && availableChains.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-[#F1F1F1] border border-[#E6E6E6] rounded-xl overflow-hidden z-50 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {availableChains.map((c) => (
            <button
              key={c.id}
              onClick={() => handleNetworkClick(c.id)}
              className="w-full px-5 h-[42px] flex items-center justify-between hover:bg-[#E9E9E9] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <SwitchNetworkIcon />
                <span className="text-sm text-[#030303]">{c.name}</span>
              </div>
              {c.iconUrl && (
                <div
                  className="w-[22px] h-[22px] rounded-full overflow-hidden"
                >
                  <Image
                    width={22}
                    height={22}
                    alt={c.name ?? "Chain icon"}
                    src={c.iconUrl}
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
export default LotteryNetworkButton;
