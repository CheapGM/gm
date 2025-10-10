import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "@/ui/components/image";
import { LuSettings2 } from "react-icons/lu";
import { SwitchNetworkIcon } from "@/ui/components/icon/SwitchNetworkIcon";

interface NetworkButtonProps {
  allowedChainIds?: number[];
}

export const NetworkButton = ({ allowedChainIds }: NetworkButtonProps = {}) => {
  return (
    <ConnectButton.Custom>
      {({ chain, openChainModal }) => {
        const isUnsupported = chain?.unsupported ||
          (allowedChainIds && chain && !allowedChainIds.includes(chain.id));

        return (
          <div className="w-full">
            {(() => {
              if (isUnsupported) {
                return (
                  <div
                    onClick={openChainModal}
                    className="flex items-center justify-between px-4 py-3 bg-light_bg2/40 rounded-xl space-x-3 cursor-pointer text-text3/60 hover:text-primary"
                  >
                    <div className="flex items-center space-x-3">
                      <LuSettings2 className="w-6 h-6 text-text2" />
                      <p className="text-sm font-medium text-error">
                        Wrong Network
                      </p>
                    </div>
                  </div>
                );
              }
              return (
                <div
                  onClick={openChainModal}
                  className="flex items-center justify-between px-5 h-[42px] bg-light_bg1 rounded-xl space-x-3 cursor-pointer text-text3/60 hover:text-primary group border border-light_gray"
                >
                  <div className="flex items-center space-x-2.5">
                    <SwitchNetworkIcon />
                    <span className="text-sm">{chain?.name}</span>
                  </div>
                  {chain?.hasIcon && (
                    <div
                      style={{
                        background: chain?.iconBackground,
                        width: 25,
                        height: 25,
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      {chain.iconUrl && (
                        <Image
                          width={25}
                          height={25}
                          alt={chain.name ?? "Chain icon"}
                          src={chain.iconUrl}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
export default NetworkButton;
