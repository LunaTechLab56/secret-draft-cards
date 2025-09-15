import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle } from "lucide-react";
import { useAccount } from 'wagmi';

const WalletConnect = () => {
  const { isConnected, address } = useAccount();

  if (isConnected && address) {
    return (
      <Card className="bg-card/50 backdrop-blur border-primary/20">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-secondary" />
            <Shield className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Wallet Connected</p>
            <p className="text-xs text-muted-foreground">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
          <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <ConnectButton
                    label="Connect Wallet"
                    className="bg-primary/10 border-primary/30 hover:bg-primary/20 text-foreground"
                  />
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletConnect;