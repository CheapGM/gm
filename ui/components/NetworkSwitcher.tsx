'use client';

import { useEffect } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';

interface NetworkSwitcherProps {
  targetChainId?: number;
  autoSwitch?: boolean;
}

export function NetworkSwitcher({
  targetChainId,
  autoSwitch = false
}: NetworkSwitcherProps = {}) {
  const { chainId, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    // Only auto-switch if enabled and target chain is specified
    if (autoSwitch && targetChainId && isConnected && chainId && chainId !== targetChainId) {
      switchChain?.({ chainId: targetChainId });
    }
  }, [autoSwitch, targetChainId, isConnected, chainId, switchChain]);

  return null;
}
