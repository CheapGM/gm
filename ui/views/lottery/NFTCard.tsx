'use client';

import Image from 'next/image';

interface NFTCardProps {
  imageUrl: string;
  address: string;
  price: string;
  roundId?: number;
  chainId?: number;
}

// Map chainId to chain icon
const getChainIcon = (chainId: number): string => {
  const chainIcons: Record<number, string> = {
    8453: '/img/chainLogos/base.jpg',
    57073: '/img/chainLogos/ink.jpg',
    1868: '/img/chainLogos/soneium.jpg',
    1301: '/img/chainLogos/unichain.jpg',
    11155111: '/img/chainLogos/eth.svg', // Sepolia (Ethereum testnet)
  };
  return chainIcons[chainId] || '/images/chains/web-icon.svg';
};

export function NFTCard({ imageUrl, address, price, roundId, chainId = 11155111 }: NFTCardProps) {
  const chainIcon = getChainIcon(chainId);
  return (
    <div className="relative w-[188px] h-[164px] bg-white border border-[rgba(230,230,230,0.5)] rounded-[11.38px] flex-shrink-0">
      {/* Round ID Badge */}
      {roundId && (
        <div className="absolute top-[9.77px] right-[9.77px] bg-[rgba(201,252,1,0.3)] rounded-[5.43px] px-[6.52px] py-[5.43px] h-[20.09px] flex items-center justify-center">
          <span className="text-[9.77px] font-semibold leading-[1.5em] text-[#C9FC01]">#{roundId}</span>
        </div>
      )}

      {/* Content */}
      <div className="absolute top-[7.13px] left-[6.8px] w-[175.4px] flex flex-col gap-[7px]">
        {/* NFT Image */}
        <div className="w-full h-[115.91px] rounded-[11.38px] overflow-hidden relative bg-gray-100">
          <img
            src={imageUrl}
            alt="Quest badge"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Container */}
        <div className="bg-[rgba(241,241,241,0.8)] rounded-[8.53px] px-[10.67px] py-[4.34px] h-[27px] flex flex-col justify-center">
          <div className="flex justify-between items-center gap-[5.69px]">
            {/* Address with chain icon */}
            <div className="flex items-center gap-1">
              <img
                src={chainIcon}
                alt=""
                className="w-[16.36px] h-[16.36px] rounded-full object-cover"
              />
              <span className="text-[9.96px] font-semibold leading-[1.5em] text-[rgba(3,3,3,0.6)]">
                {address}
              </span>
            </div>

            {/* Price */}
            <span className="text-[9.96px] font-semibold leading-[1.5em] text-[#0177E7]">
              {price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
