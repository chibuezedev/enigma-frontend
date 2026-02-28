export function RiskMeter({ ratio }: any) {
  const pct = ratio
    ? Math.min(Math.max(((parseFloat(ratio) - 100) / 200) * 100, 0), 100)
    : 50;
  const label = !ratio
    ? "NO POSITION"
    : parseFloat(ratio) >= 200
      ? "LOW RISK"
      : parseFloat(ratio) >= 150
        ? "MODERATE"
        : "HIGH RISK";
  const color = !ratio
    ? "text-white/30"
    : parseFloat(ratio) >= 200
      ? "text-emerald-400"
      : parseFloat(ratio) >= 150
        ? "text-amber-400"
        : "text-red-400";

  return (
    <div className="border border-white/10 p-4">
      <div
        className="text-white/30 mb-3"
        style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em" }}
      >
        RISK MONITOR
      </div>
      <div className="flex items-end gap-1 h-16">
        {Array.from({ length: 20 }).map((_, i) => {
          const filled = (i / 19) * 100 < pct;
          return (
            <div
              key={i}
              className="flex-1 transition-all duration-300"
              style={{
                height: `${30 + i * 3}%`,
                background: filled
                  ? i < 7
                    ? "rgba(239,68,68,0.7)"
                    : i < 14
                      ? "rgba(251,191,36,0.7)"
                      : "rgba(52,211,153,0.7)"
                  : "rgba(255,255,255,0.06)",
              }}
            />
          );
        })}
      </div>
      <div
        className={`mt-2 ${color}`}
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          letterSpacing: "0.15em",
        }}
      >
        {label}
      </div>
      {ratio && (
        <div
          className="text-white/25 mt-0.5"
          style={{ fontFamily: "monospace", fontSize: 9 }}
        >
          RATIO: {ratio}%
        </div>
      )}
    </div>
  );
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function SectionHeader({ index, label }: any) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <span
        style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em" }}
        className="text-white/20"
      >
        {index}
      </span>
      <div className="w-px h-4 bg-white/20" />
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          letterSpacing: "0.25em",
        }}
        className="text-white/60"
      >
        {label}
      </span>
    </div>
  );
}

export function Field({ label, children }: any) {
  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      {children}
    </div>
  );
}

export function FieldLabel({ children }: any) {
  return (
    <div
      style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em" }}
      className="text-white/40"
    >
      {children}
    </div>
  );
}

export function ActionButton({ onClick, loading, disabled, label }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="relative w-full border border-white text-white hover:bg-white hover:text-black transition-all duration-150 py-3.5 disabled:opacity-30 disabled:cursor-not-allowed group"
      style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.2em" }}
    >
      <CornerFrame pos="tl" />
      <CornerFrame pos="br" />
      {loading && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1 h-1 rounded-full bg-current animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
      )}
      {label}
    </button>
  );
}

export function CornerFrame({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const map = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  };
  return (
    <span
      className={`absolute w-3 h-3 ${map[pos]} border-white/50 pointer-events-none`}
    />
  );
}

export function Badge({ children, dim }: any) {
  return (
    <span
      style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.15em" }}
      className={`px-2 py-0.5 border ${dim ? "border-white/20 text-white/30" : "border-white/40 text-white/60"}`}
    >
      {children}
    </span>
  );
}

export function ScanLine({ className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
      }}
    />
  );
}
