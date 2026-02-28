import { useEffect, useState } from "react";

export default function Footer() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 800);
    return () => clearInterval(id);
  }, []);
  const bars = [4, 8, 5, 12, 7, 10, 6, 9, 4, 11, 7, 8];

  return (
    <footer className="fixed bottom-0 inset-x-0 border-t border-white/10 bg-black z-20">
      <div className="max-w-5xl mx-auto px-6 py-2.5 flex items-center justify-between">
        <div
          className="flex items-center gap-4"
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            letterSpacing: "0.12em",
          }}
        >
          <span className="text-white/25">SYSTEM.ACTIVE</span>
          <div className="flex items-end gap-0.5 h-3">
            {bars.map((h, i) => (
              <div
                key={i}
                className="w-0.5 bg-white/25 transition-all duration-300"
                style={{
                  height: `${t % 2 === 0 ? h : bars[(i + 3) % bars.length]}px`,
                }}
              />
            ))}
          </div>
          <span className="text-white/15">STARKNET DEVNET v0.7.x</span>
        </div>
        <div
          className="flex items-center gap-3"
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            letterSpacing: "0.12em",
          }}
        >
          <span className="text-white/20">ZK-PROOF ENGINE</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-white/40 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
