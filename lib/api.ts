const API = "https://enigma-server-rouge.vercel.app" // || "http://localhost:3001";

export const api = {
  getPrice: () => fetch(`${API}/price`).then((r) => r.json()),
  getPosition: (address: string) =>
    fetch(`${API}/position/${address}`).then((r) => r.json()),
  deposit: (amount: string) =>
    fetch(`${API}/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    }).then((r) => r.json()),
  borrow: (amount: string) =>
    fetch(`${API}/borrow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: BigInt(Math.floor(Number(amount))).toString(),
      }),
    }).then((r) => r.json()),
  approveDebt: (amount: string) =>
    fetch(`${API}/approve/debt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    }).then((r) => r.json()),
  repay: (amount: string) =>
    fetch(`${API}/repay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    }).then((r) => r.json()),
  withdraw: (amount: string) =>
    fetch(`${API}/withdraw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    }).then((r) => r.json()),
  liquidate: (user: string) =>
    fetch(`${API}/liquidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user }),
    }).then((r) => r.json()),
};

export const fromHex = (hex: string, decimals = 18) => {
  if (!hex || hex === "0x0") return "0";
  return (Number(BigInt(hex)) / Math.pow(10, decimals)).toString();
};
