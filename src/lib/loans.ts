export const CEREALS = ["Maize", "Wheat", "Rice", "Sorghum", "Millet", "Barley"] as const;
export type Cereal = (typeof CEREALS)[number];

// Borrowers can draw up to 90% of the invoice value of their stored stock.
export const MAX_LTV = 0.9;

export const LOAN_TERMS = [{ days: 7 }, { days: 14 }, { days: 30 }] as const;
export type TermDays = (typeof LOAN_TERMS)[number]["days"];

export type StockStatus = "available" | "pledged" | "released";
export type LoanStatus = "active" | "repaid" | "overdue";

export interface StockDeposit {
  id: string;
  cereal: Cereal;
  quantityKg: number;
  pricePerKg: number;
  warehouse: string;
  receiptNo: string;
  depositedAt: string;
  status: StockStatus;
  ledgerRef: string;
}

export interface Loan {
  id: string;
  stockId: string;
  principal: number;
  termDays: TermDays;
  wallet: string;
  status: LoanStatus;
  createdAt: string;
  dueAt: string;
  repaidAt?: string;
  ledgerRef: string;
}

export const stockValue = (s: Pick<StockDeposit, "quantityKg" | "pricePerKg">) =>
  s.quantityKg * s.pricePerKg;

export const maxAdvance = (s: Pick<StockDeposit, "quantityKg" | "pricePerKg">) =>
  Math.floor(stockValue(s) * MAX_LTV);

export const isOverdue = (loan: Loan, now = new Date()) =>
  loan.status === "active" && new Date(loan.dueAt) < now;

export const formatAmount = (n: number) => Math.round(n).toLocaleString("en-US");

// A Stellar transaction hash is 64 hex chars. These are simulated until the
// on-chain recording is wired to the Stellar network.
export const simulatedLedgerRef = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, "0")).join("");

export const shortRef = (ref: string) => `${ref.slice(0, 8)}…${ref.slice(-6)}`;
