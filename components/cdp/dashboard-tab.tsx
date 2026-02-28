"use client";

import { useState, useEffect } from "react";
import { SectionHeader, CornerFrame } from "./utils";
import { api, fromHex } from "@/lib/api";
import StatBox from "./state-box";

interface Position {
  id: string;
  collateral: number;
  debt: number;
  healthFactor: number;
  liquidationPrice: number;
  revealed: boolean;
}

export function DashboardTab({ address }: any) {
  const [positions, setPositions] = useState<any[]>([]);
  const [repaying, setRepaying] = useState(null);

  useEffect(() => {
    if (!address) return;

    api.getPosition(address).then((data) => {
      if (data.collateral === "0x0" && data.debt === "0x0") return;
      setPositions([
        {
          id: address.slice(0, 6),
          collateral: Number(fromHex(data.collateral, 8)),
          debt: Number(fromHex(data.debt, 18)),
          healthFactor: Number(BigInt(data.healthFactor) / BigInt(1e18)),
          liqPrice: 0,
          revealed: false,
        },
      ]);
    });
  }, [address]);

  const toggle = (id: string) =>
    setPositions((ps: any) =>
      ps.map((p: Position) =>
        p.id === id ? { ...p, revealed: !p.revealed } : p,
      ),
    );

  const handleRepay = async (id: any) => {
    setRepaying(id);
    try {
      const pos = positions.find((p) => p.id === id);
      const raw = BigInt(Math.floor(pos.debt * 1e18)).toString();
      await api.approveDebt(raw); // approve first
      await api.repay(raw);
      setPositions((ps) =>
        ps.map((p) => (p.id === id ? { ...p, debt: 0, healthFactor: 999 } : p)),
      );
    } catch (e: any) {
      alert(e.message);
    }
    setRepaying(null);
  };

  const totalCollateral = positions.reduce((s, p) => s + p.collateral, 0);
  const totalDebt = positions.reduce((s, p) => s + p.debt, 0);

  const avgHealth =
    positions.length === 0
      ? "0.00"
      : (
          positions.reduce((s, p) => s + Math.min(p.healthFactor, 9.99), 0) /
          positions.length
        ).toFixed(2);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <SectionHeader index="03" label="OPEN POSITIONS" />
        {address && (
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.12em",
            }}
            className="text-white/30"
          >
            WALLET: {address.slice(0, 8)}…{address.slice(-6)}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {positions.map((pos) => (
          <PositionCard
            key={pos.id}
            pos={pos}
            onToggle={toggle}
            onRepay={handleRepay}
            repaying={repaying === pos.id}
          />
        ))}
      </div>

      <div className="border-t border-white/10 pt-6">
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            letterSpacing: "0.2em",
          }}
          className="text-white/30 mb-4"
        >
          AGGREGATE STATS
        </div>
        <div className="grid grid-cols-3 gap-3">
          <StatBox
            label="TOTAL COLLATERAL"
            value={`${totalCollateral.toFixed(5)} BTC`}
          />
          <StatBox
            label="TOTAL DEBT"
            value={`$${totalDebt.toLocaleString()}`}
          />
          <StatBox
            label="AVG HEALTH FACTOR"
            value={avgHealth}
            accent={parseFloat(avgHealth) > 2}
          />
        </div>
      </div>
    </div>
  );
}

function ScanLine({ className = "" }) {
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

function PositionCard({ pos, onToggle, onRepay, repaying }: any) {
  const health = pos.healthFactor;
  const healthColor =
    health > 2
      ? "text-emerald-400"
      : health > 1.4
        ? "text-amber-400"
        : "text-red-400";
  const barPct = Math.min((health / 3) * 100, 100);
  const barColor =
    health > 2
      ? "bg-emerald-500"
      : health > 1.4
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className="relative border border-white/15 hover:border-white/25 transition-colors duration-200 p-5 group">
      <CornerFrame pos="tl" />
      <CornerFrame pos="br" />
      <ScanLine className="opacity-40" />

      <div className="flex items-start justify-between mb-4">
        <div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.15em",
            }}
            className="text-white/30 mb-1"
          >
            POSITION ID
          </div>
          <div
            style={{ fontFamily: "monospace", fontSize: 12 }}
            className="text-white/60"
          >
            {pos.id}…
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span
            style={{ fontFamily: "monospace", fontSize: 9 }}
            className="text-emerald-400/70"
          >
            ACTIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.12em",
            }}
            className="text-white/30 mb-2"
          >
            COLLATERAL
          </div>
          <div className="flex items-center gap-2">
            <span
              style={{ fontFamily: "monospace", fontSize: 13 }}
              className="text-white"
            >
              {pos.revealed ? `${pos.collateral} BTC` : "●●●●●●●"}
            </span>
            <button
              onClick={() => onToggle(pos.id)}
              className="text-white/25 hover:text-white/60 transition-colors"
              title={pos.revealed ? "Hide" : "Reveal"}
            >
              {pos.revealed ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.12em",
            }}
            className="text-white/30 mb-2"
          >
            DEBT
          </div>
          <div
            style={{ fontFamily: "monospace", fontSize: 13 }}
            className="text-white"
          >
            {pos.debt === 0 ? "CLEARED" : `$${pos.debt.toLocaleString()}`}
          </div>
        </div>

        <div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.12em",
            }}
            className="text-white/30 mb-2"
          >
            HEALTH
          </div>
          <div
            style={{ fontFamily: "monospace", fontSize: 13 }}
            className={healthColor}
          >
            {pos.healthFactor === 999 ? "∞" : pos.healthFactor.toFixed(2)}
          </div>
        </div>

        <div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.12em",
            }}
            className="text-white/30 mb-2"
          >
            LIQ. PRICE
          </div>
          <div
            style={{ fontFamily: "monospace", fontSize: 13 }}
            className="text-white"
          >
            ${pos.liqPrice.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Health bar */}
      <div className="mb-4">
        <div className="h-px bg-white/8">
          <div
            className={`h-full transition-all duration-500 ${barColor}`}
            style={{ width: `${barPct}%`, opacity: 0.7 }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onRepay(pos.id)}
          disabled={repaying || pos.debt === 0}
          className="relative flex-1 border border-white/25 hover:border-white text-white/60 hover:text-white py-2.5 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed group"
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            letterSpacing: "0.15em",
          }}
        >
          <CornerFrame pos="tl" />
          <CornerFrame pos="br" />
          {repaying ? "REPAYING…" : pos.debt === 0 ? "CLEARED ✓" : "REPAY DEBT"}
        </button>
        <button
          className="border border-white/10 hover:border-white/25 text-white/25 hover:text-white/50 px-4 py-2.5 transition-all"
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            letterSpacing: "0.15em",
          }}
        >
          WITHDRAW
        </button>
      </div>
    </div>
  );
}
