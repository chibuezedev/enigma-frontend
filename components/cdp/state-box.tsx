import { CornerFrame } from "./utils";

export default function StatBox({ label, value, accent }: any) {
  return (
    <div className="relative border border-white/15 p-4 group hover:border-white/30 transition-colors duration-300">
      <CornerFrame pos="tl" />
      <CornerFrame pos="br" />
      <div
        style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em" }}
        className="text-white/40 mb-2"
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 18,
          letterSpacing: "0.05em",
        }}
        className={accent ? "text-emerald-400" : "text-white"}
      >
        {value}
      </div>
    </div>
  );
}
