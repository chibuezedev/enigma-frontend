import { useState } from "react";

export function TabBar({ active, setActive, hasPosition }: any) {
  const MOCK_POSITIONS = [
    {
      id: "0x1a2b",
      collateral: 2.5,
      debt: 48750,
      healthFactor: 2.14,
      liqPrice: 29000,
      revealed: false,
    },
    {
      id: "0x3c4d",
      collateral: 0.8,
      debt: 12400,
      healthFactor: 1.68,
      liqPrice: 23100,
      revealed: false,
    },
  ];

  const tabs = [
    { id: "deposit", label: "01 / DEPOSIT" },
    { id: "borrow", label: "02 / BORROW" },
    {
      id: "dashboard",
      label: "03 / POSITIONS",
      badge: hasPosition ? MOCK_POSITIONS.length : null,
    },
  ];

  return (
    <nav className="border-b border-white/10 bg-black">
      <div className="max-w-5xl mx-auto px-6 flex">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`relative px-6 py-4 transition-all duration-200 flex items-center gap-2 ${
              active === t.id
                ? "text-white border-b border-white"
                : "text-white/35 hover:text-white/60 border-b border-transparent"
            }`}
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
            }}
          >
            {t.label}
            {t.badge && (
              <span className="text-[8px] px-1.5 py-0.5 border border-white/30 text-white/50">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
