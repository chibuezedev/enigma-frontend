"use client";

import { useState } from "react";
import {
  CornerFrame,
  ActionButton,
  FieldLabel,
  Field,
  SectionHeader,
  sleep,
} from "./utils";
import { api } from "@/lib/api";

export function DepositTab({ address, btcPrice }: any) {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("idle");
  const [approving, setApproving] = useState(false);

  const usdValue = amount
    ? (parseFloat(amount) * btcPrice).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })
    : null;

 const handleBridge = async () => {
  if (!amount || parseFloat(amount) <= 0) return;
  setApproving(true);
  setStatus("pending");
  try {
    const raw = (parseFloat(amount) * 1e8).toFixed(0);
    await api.deposit(raw);
    setStatus("confirmed");
    await sleep(500);
    setStatus("locked");
  } catch (e: any) {
    setStatus("idle");
    alert(e.message);
  }
  setApproving(false);
};

  const statusCfg = {
    idle: { dot: "bg-white/20", text: "AWAITING INPUT" },
    pending: { dot: "bg-amber-400 animate-pulse", text: "BRIDGE TX PENDING…" },
    confirmed: {
      dot: "bg-sky-400 animate-pulse",
      text: "CONFIRMED — LOCKING ON STARKNET…",
    },
    locked: { dot: "bg-emerald-400", text: "COLLATERAL LOCKED ✓" },
  }[status];

  return (
    <div className="grid grid-cols-5 gap-8">
      {/* Left form */}
      <div className="col-span-3 space-y-6">
        <SectionHeader index="01" label="BRIDGE & LOCK BTC COLLATERAL" />

        <Field label="BTC AMOUNT">
          <div className="relative">
            <input
              type="number"
              placeholder="0.00000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent border border-white/20 focus:border-white/60 text-white px-4 py-3 outline-none transition-colors"
              style={{ fontFamily: "monospace", fontSize: 14 }}
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30"
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: "0.15em",
              }}
            >
              BTC
            </span>
          </div>
          {usdValue && (
            <div
              className="text-white/30 mt-1"
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: "0.1em",
              }}
            >
              ≈ ${usdValue} USD
            </div>
          )}
        </Field>

        <Field label="DESTINATION STARKNET ADDRESS">
          <div className="relative border border-white/10 bg-white/5 px-4 py-3">
            <span
              className="text-white/40"
              style={{ fontFamily: "monospace", fontSize: 12 }}
            >
              {address || "— connect wallet —"}
            </span>
            {address && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 text-xs">
                AUTO
              </span>
            )}
          </div>
        </Field>

        <div className="space-y-2">
          <FieldLabel>BRIDGE METHOD</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {["ATOMIC SWAP", "TRUST-MIN BRIDGE"].map((m, i) => (
              <button
                key={m}
                className={`relative border px-4 py-3 text-left transition-all duration-150 group ${
                  i === 0
                    ? "border-white/50 text-white"
                    : "border-white/15 text-white/30 hover:border-white/30 hover:text-white/50"
                }`}
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  letterSpacing: "0.15em",
                }}
              >
                <CornerFrame pos="tl" />
                <CornerFrame pos="br" />
                {m}
                {i === 0 && (
                  <span
                    className="block text-white/30 mt-0.5"
                    style={{ fontSize: 8 }}
                  >
                    RECOMMENDED
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <ActionButton
          onClick={handleBridge}
          loading={approving}
          disabled={!amount || !address || status === "locked"}
          label={
            status === "locked"
              ? "COLLATERAL LOCKED ✓"
              : approving
                ? "BRIDGING…"
                : "BRIDGE & LOCK COLLATERAL"
          }
        />

        {/* Status row */}
        <div
          className="flex items-center gap-3 pt-1"
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            letterSpacing: "0.12em",
          }}
        >
          <span className={`w-2 h-2 rounded-full ${statusCfg?.dot}`} />
          <span className="text-white/50">{statusCfg?.text}</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="col-span-2 space-y-4">
        <div
          className="border border-white/10 p-4 space-y-1"
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            letterSpacing: "0.1em",
          }}
        >
          <div className="text-white/30 mb-3">PROTOCOL PARAMETERS</div>
          {[
            ["MIN COLLATERAL RATIO", "150%"],
            ["LIQ. THRESHOLD", "120%"],
            ["LIQ. BONUS", "10%"],
            ["MAX LTV", "66%"],
            ["DEBT TOKEN", "USDC"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between py-1.5 border-b border-white/5"
            >
              <span className="text-white/35">{k}</span>
              <span className="text-white/70">{v}</span>
            </div>
          ))}
        </div>

        <div
          className="border border-white/10 p-4"
          style={{ fontFamily: "monospace", fontSize: 10 }}
        >
          <div className="text-white/30 mb-3 tracking-widest">
            ZK COMMITMENT
          </div>
          <div
            className="text-white/20 break-all leading-relaxed"
            style={{ fontSize: 8 }}
          >
            {status === "locked"
              ? "0x04a7f3b…2c91d8e1f — PEDERSEN HASH STORED ON-CHAIN. POSITION PRIVATE."
              : "— deposit to generate commitment —"}
          </div>
        </div>
      </div>
    </div>
  );
}
