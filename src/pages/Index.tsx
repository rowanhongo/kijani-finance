import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { LoanStatusBadge } from "@/components/LoanStatusBadge";
import { useLoans } from "@/contexts/LoansContext";
import { formatAmount, maxAdvance, stockValue } from "@/lib/loans";

const Index = () => {
  const navigate = useNavigate();
  const { stock, loans } = useLoans();

  const open = loans.filter((l) => l.status !== "repaid");
  const outstanding = open.reduce((sum, l) => sum + l.principal, 0);
  const headroom = stock.filter((s) => s.status === "available").reduce((sum, s) => sum + maxAdvance(s), 0);
  const storedValue = stock.filter((s) => s.status !== "released").reduce((sum, s) => sum + stockValue(s), 0);
  const nextDue = open.map((l) => l.dueAt).sort()[0];

  const tiles = [
    { label: "Stored stock value", value: formatAmount(storedValue) },
    { label: "Available to borrow", value: formatAmount(headroom) },
    { label: "Outstanding", value: formatAmount(outstanding) },
    { label: "Next repayment", value: nextDue ? new Date(nextDue).toLocaleDateString() : "—" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold">Overview</h1>
            <p className="text-muted-foreground text-sm">Hold your grain for a better price. Borrow against it meanwhile.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="min-h-11" onClick={() => navigate("/stock")}>
              Record deposit
            </Button>
            <Button className="min-h-11 bg-primary text-primary-foreground" onClick={() => navigate("/loans")}>
              New loan
            </Button>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t) => (
            <div key={t.label} className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground">{t.label}</p>
              <p className="text-lg font-semibold mt-1">{t.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="font-semibold">Open loans</h2>
          </div>
          <ul className="divide-y divide-border">
            {open.length === 0 ? (
              <li className="px-4 py-6 text-muted-foreground text-sm">No open loans</li>
            ) : (
              open.map((l) => (
                <li
                  key={l.id}
                  className="px-4 py-3 flex items-center justify-between hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigate(`/loans/${l.id}`)}
                >
                  <div>
                    <p className="font-medium">{formatAmount(l.principal)}</p>
                    <p className="text-sm text-muted-foreground">Due {new Date(l.dueAt).toLocaleDateString()}</p>
                  </div>
                  <LoanStatusBadge status={l.status} />
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
