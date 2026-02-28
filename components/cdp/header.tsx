import { useState, useEffect } from "react";
import { ScanLine, Badge } from "./utils";
import WalletButton from "./wallet-connect";

export function Header({
  address,
  onConnect,
  onDisconnect,
  connecting,
  btcPrice,
}: any) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="relative border-b border-white/15 bg-black">
      <ScanLine />
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 13,
              letterSpacing: "0.35em",
            }}
            className="text-white font-bold"
          >
            ENIGMA
          </div>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-3">
            <Badge>STARKNET</Badge>
            <Badge>ZK-PROOF</Badge>
            <Badge dim>DEVNET</Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {btcPrice && (
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: "0.12em",
              }}
              className="text-white/40 flex items-center gap-2"
            >
              <span className="text-white/20">BTC/USD</span>
              <span className="text-white/70">
                ${btcPrice.toLocaleString()}
              </span>
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          )}
          <WalletButton
            address={address}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
            connecting={connecting}
          />
        </div>
      </div>
    </header>
  );
}
