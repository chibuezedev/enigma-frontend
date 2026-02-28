"use client";

import { useCallback, useState, useEffect } from "react";
import { Header } from "@/components/cdp/header";
import { DepositTab } from "@/components/cdp/deposit-tab";
import { BorrowTab } from "@/components/cdp/borrow-tab";
import { DashboardTab } from "@/components/cdp/dashboard-tab";
import { TabBar } from "@/components/cdp/tab-bar";
import Footer from "@/components/cdp/footer";
import { connect } from "@starknet-io/get-starknet";
import { api } from "@/lib/api";


export default function CDPVaultApp() {
  const [tab, setTab] = useState("deposit");
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [btcPrice, setBtcPrice] = useState<number>(97420);

  useEffect(() => {
    api.getPrice().then(({ price }) => {
      setBtcPrice(Number(BigInt(price) / BigInt(1e15)) / 1000);
    });
  }, []);

  const onconnect = useCallback(async () => {
    setConnecting(true);
    try {
      const wallet = (await connect({ modalMode: "alwaysAsk" })) as any;
      await wallet?.enable({ starknetVersion: "v5" });
      setAddress(wallet?.selectedAddress ?? null);
    } catch (e) {
      console.error(e);
    }
    setConnecting(false);
  }, []);

  const disconnect = useCallback(() => setAddress(null), []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="fixed top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-white/15 pointer-events-none z-30" />
      <div className="fixed top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-white/15 pointer-events-none z-30" />
      <div className="fixed bottom-12 left-0 w-16 h-16 border-b-2 border-l-2 border-white/15 pointer-events-none z-30" />
      <div className="fixed bottom-12 right-0 w-16 h-16 border-b-2 border-r-2 border-white/15 pointer-events-none z-30" />

      <Header
        address={address}
        onConnect={onconnect}
        onDisconnect={disconnect}
        connecting={connecting}
        btcPrice={btcPrice}
      />

      <TabBar active={tab} setActive={setTab} hasPosition={!!address} />

      {!address && (
        <div className="max-w-5xl mx-auto px-6 mt-6">
          <div className="border border-white/10 bg-white/2 px-5 py-3 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70 animate-pulse" />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: "0.12em",
              }}
              className="text-white/40"
            >
              CONNECT YOUR ARGENT X OR BRAAVOS WALLET TO INTERACT WITH THE VAULT
            </span>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-8 pb-20">
        {tab === "deposit" && <DepositTab address={address} btcPrice={btcPrice} />}
        {tab === "borrow" && <BorrowTab address={address} />}
        {tab === "dashboard" && <DashboardTab address={address} />}
      </main>

      <Footer />
    </div>
  );
}
