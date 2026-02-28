"use client";

import { useEffect, useState } from "react";
import { api, fromHex } from "@/lib/api";
import {
  ActionButton,
  FieldLabel,
  Field,
  SectionHeader,
  sleep,
  RiskMeter,
} from "./utils";

export function BorrowTab({ address }: any) {
  const [amount, setAmount] = useState("");
  const [ltv, setLtv] = useState(50);
  const [proofStatus, setProofStatus] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [collateral, setCollateral] = useState(0);
  const [btcPrice, setBtcPrice] = useState<number>(97420);

  useEffect(() => {
    if (!address) return;
    api.getPosition(address).then(({ collateral }) => {
      setCollateral(Number(fromHex(collateral, 8)));
    });
  }, [address]);

  useEffect(() => {
    api.getPrice().then(({ price }) => {
      setBtcPrice(Number(BigInt(price) / BigInt(1e15)) / 1000);
    });
  }, []);

  const collateralUSD = collateral * btcPrice;
  const maxBorrow = collateralUSD * 0.66;
  const suggestedBorrow = ((ltv / 100) * maxBorrow).toFixed(0);
  const currentRatio = amount
    ? ((collateralUSD / parseFloat(amount)) * 100).toFixed(1)
    : null;
  const safeRatio = currentRatio ? parseFloat(currentRatio) >= 150 : true;

  const handleBorrow = async () => {
    if (!amount) return;
    setLoading(true);
    setProofStatus("generating");
    try {
      const raw = BigInt(Math.floor(parseFloat(amount) * 1e18)).toString();
      await api.borrow(raw);
      setProofStatus("verified");
      await sleep(500);
      setProofStatus("sent");
    } catch (e: any) {
      setProofStatus("idle");
      alert(e.message);
    }
    setLoading(false);
  };

  const proofCfg = {
    idle: { dot: "bg-white/20", text: "PROOF NOT YET GENERATED" },
    generating: {
      dot: "bg-amber-400 animate-pulse",
      text: "GENERATING STARK PROOF…",
    },
    verified: {
      dot: "bg-sky-400 animate-pulse",
      text: "PROOF VERIFIED ON-CHAIN ✓",
    },
    sent: { dot: "bg-emerald-400", text: "TRANSACTION SENT — DEBT ISSUED ✓" },
  }[proofStatus];

  return (
    <div className="grid grid-cols-5 gap-8">
      <div className="col-span-3 space-y-6">
        <SectionHeader index="02" label="GENERATE ZK PROOF & BORROW" />

        {/* Collateral summary */}
        <div className="border border-white/15 p-4 space-y-2">
          <FieldLabel>LOCKED COLLATERAL SUMMARY</FieldLabel>
          <div className="grid grid-cols-2 gap-4 mt-3">
            {[
              ["COLLATERAL", `${collateral} BTC`],
              ["USD VALUE", `$${collateralUSD.toLocaleString()}`],
              [
                "MAX BORROW",
                `$${maxBorrow.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
              ],
              ["CURRENT DEBT", "$0"],
            ].map(([k, v]) => (
              <div key={k}>
                <div
                  className="text-white/30 mb-1"
                  style={{
                    fontFamily: "monospace",
                    fontSize: 9,
                    letterSpacing: "0.15em",
                  }}
                >
                  {k}
                </div>
                <div
                  className="text-white"
                  style={{ fontFamily: "monospace", fontSize: 13 }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Field label="BORROW AMOUNT (USDC)">
          <div className="relative">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent border border-white/20 focus:border-white/60 text-white px-4 py-3 outline-none transition-colors"
              style={{ fontFamily: "monospace", fontSize: 14 }}
            />
            <button
              onClick={() => setAmount(suggestedBorrow)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                letterSpacing: "0.1em",
              }}
            >
              USE LTV MAX
            </button>
          </div>
          {currentRatio && (
            <div
              className={`mt-1 ${safeRatio ? "text-emerald-400/70" : "text-red-400/70"}`}
              style={{ fontFamily: "monospace", fontSize: 10 }}
            >
              COLLATERAL RATIO: {currentRatio}%{" "}
              {safeRatio ? "✓ SAFE" : "⚠ BELOW 150% THRESHOLD"}
            </div>
          )}
        </Field>

        {/* LTV Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <FieldLabel>TARGET LTV RATIO</FieldLabel>
            <span
              className="text-white"
              style={{ fontFamily: "monospace", fontSize: 12 }}
            >
              {ltv}%
            </span>
          </div>
          <div className="relative h-1 bg-white/10">
            <div
              className="absolute h-full bg-white/60 transition-all duration-150"
              style={{ width: `${(ltv / 90) * 100}%` }}
            />
            <input
              type="range"
              min={10}
              max={90}
              step={5}
              value={ltv}
              onChange={(e) => {
                setLtv(parseInt(e.target.value));
                setAmount(
                  ((parseInt(e.target.value) / 100) * maxBorrow).toFixed(0),
                );
              }}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
          <div
            className="flex justify-between text-white/25"
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.1em",
            }}
          >
            <span>10% CONSERVATIVE</span>
            <span>90% MAX RISK</span>
          </div>
        </div>

        <ActionButton
          onClick={handleBorrow}
          loading={loading}
          disabled={!amount || proofStatus === "sent"}
          label={
            loading
              ? "GENERATING STARK PROOF…"
              : proofStatus === "sent"
                ? "DEBT ISSUED ✓"
                : "GENERATE PROOF & BORROW"
          }
        />

        <div
          className="flex items-center gap-3 pt-1"
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            letterSpacing: "0.12em",
          }}
        >
          <span className={`w-2 h-2 rounded-full ${proofCfg?.dot}`} />
          <span className="text-white/50">{proofCfg?.text}</span>
        </div>
      </div>

      <div className="col-span-2 space-y-4">
        <RiskMeter ratio={currentRatio} />
        <div
          className="border border-white/10 p-4"
          style={{ fontFamily: "monospace", fontSize: 10 }}
        >
          <div className="text-white/30 mb-3 tracking-widest">
            HOW ZK BORROWING WORKS
          </div>
          {[
            "Your collateral amount is hashed on-chain via Pedersen",
            "A STARK proof confirms solvency without revealing position size",
            "Debt is issued only if proof verifies successfully",
            "Liquidators cannot see your exact collateral until breach",
          ].map((s, i) => (
            <div
              key={i}
              className="flex gap-3 py-2 border-b border-white/5 text-white/40 leading-relaxed"
              style={{ fontSize: 9 }}
            >
              <span className="text-white/20 shrink-0">0{i + 1}</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
