import { useState } from "react";
import { CornerFrame } from "./utils";

export default function WalletButton({
  address,
  onConnect,
  onDisconnect,
  connecting,
}: any) {
  const [hover, setHover] = useState(false);

  if (address) {
    const short = address.slice(0, 6) + "…" + address.slice(-4);
    return (
      <button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onDisconnect}
        className="relative flex items-center gap-2 border border-white/30 hover:border-white/60 transition-all duration-200 px-4 py-2 group"
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          letterSpacing: "0.1em",
        }}
      >
        <CornerFrame pos="tl" />
        <CornerFrame pos="br" />
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-white/70 group-hover:text-white transition-colors">
          {hover ? "DISCONNECT" : short}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={connecting}
      className="relative border border-white/40 hover:border-white px-4 py-2 text-white/70 hover:text-white transition-all duration-200 group"
      style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em" }}
    >
      <CornerFrame pos="tl" />
      <CornerFrame pos="br" />
      {connecting ? (
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-ping" />
          CONNECTING…
        </span>
      ) : (
        "CONNECT WALLET"
      )}
    </button>
  );
}
