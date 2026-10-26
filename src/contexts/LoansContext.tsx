import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  isOverdue,
  maxAdvance,
  simulatedLedgerRef,
  type Cereal,
  type Loan,
  type StockDeposit,
  type TermDays,
} from "@/lib/loans";

const STORAGE_KEY = "kijani-state-v1";

interface State {
  stock: StockDeposit[];
  loans: Loan[];
}

interface NewStock {
  cereal: Cereal;
  quantityKg: number;
  pricePerKg: number;
  warehouse: string;
  receiptNo: string;
}

interface NewLoan {
  stockId: string;
  principal: number;
  termDays: TermDays;
  wallet: string;
}

interface LoansContextValue {
  stock: StockDeposit[];
  loans: Loan[];
  addStock: (input: NewStock) => StockDeposit;
  createLoan: (input: NewLoan) => Loan;
  repayLoan: (loanId: string) => void;
}

const LoansContext = createContext<LoansContextValue | null>(null);

const load = (): State => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as State;
  } catch {
    // fall through to empty state
  }
  return { stock: [], loans: [] };
};

const DAY_MS = 24 * 60 * 60 * 1000;

export const LoansProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<State>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable; state stays in memory
    }
  }, [state]);

  const value = useMemo<LoansContextValue>(() => {
    const loans = state.loans.map((l) => (isOverdue(l) ? { ...l, status: "overdue" as const } : l));

    const addStock = (input: NewStock) => {
      const deposit: StockDeposit = {
        ...input,
        id: crypto.randomUUID(),
        depositedAt: new Date().toISOString(),
        status: "available",
        ledgerRef: simulatedLedgerRef(),
      };
      setState((s) => ({ ...s, stock: [deposit, ...s.stock] }));
      return deposit;
    };

    const createLoan = (input: NewLoan) => {
      const deposit = state.stock.find((s) => s.id === input.stockId);
      if (!deposit) throw new Error("Stock deposit not found");
      if (deposit.status !== "available") throw new Error("This stock is already pledged");
      if (input.principal <= 0 || input.principal > maxAdvance(deposit)) {
        throw new Error("Amount exceeds 90% of the stock's invoice value");
      }
      const now = new Date();
      const loan: Loan = {
        id: crypto.randomUUID(),
        stockId: deposit.id,
        principal: input.principal,
        termDays: input.termDays,
        wallet: input.wallet,
        status: "active",
        createdAt: now.toISOString(),
        dueAt: new Date(now.getTime() + input.termDays * DAY_MS).toISOString(),
        ledgerRef: simulatedLedgerRef(),
      };
      setState((s) => ({
        stock: s.stock.map((d) => (d.id === deposit.id ? { ...d, status: "pledged" } : d)),
        loans: [loan, ...s.loans],
      }));
      return loan;
    };

    const repayLoan = (loanId: string) => {
      setState((s) => {
        const loan = s.loans.find((l) => l.id === loanId);
        if (!loan || loan.status === "repaid") return s;
        return {
          stock: s.stock.map((d) => (d.id === loan.stockId ? { ...d, status: "available" } : d)),
          loans: s.loans.map((l) =>
            l.id === loanId ? { ...l, status: "repaid", repaidAt: new Date().toISOString() } : l
          ),
        };
      });
    };

    return { stock: state.stock, loans, addStock, createLoan, repayLoan };
  }, [state]);

  return <LoansContext.Provider value={value}>{children}</LoansContext.Provider>;
};

export const useLoans = (): LoansContextValue => {
  const ctx = useContext(LoansContext);
  if (!ctx) throw new Error("useLoans must be used within LoansProvider");
  return ctx;
};
