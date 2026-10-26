import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wheat, Calendar, Wallet, Link2 } from "lucide-react";
import { useLoans } from "@/contexts/LoansContext";
import { LoanStatusBadge } from "@/components/LoanStatusBadge";
import { formatAmount } from "@/lib/loans";

export default function LoanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loans, stock, repayLoan } = useLoans();
  const loan = loans.find((l) => l.id === id);
  const collateral = loan ? stock.find((s) => s.id === loan.stockId) : undefined;

  if (!loan) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => navigate("/loans")} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Loans
          </Button>
          <p className="text-muted-foreground">Loan not found.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 min-w-0">
        <Button variant="ghost" onClick={() => navigate("/loans")} className="gap-2 -ml-2 min-h-11 touch-target" aria-label="Back to loans">
          <ArrowLeft className="w-4 h-4" /> Back to Loans
        </Button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold break-words">{formatAmount(loan.principal)} loan</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {loan.termDays}-day term · paid out as stablecoin
            </p>
          </div>
          <LoanStatusBadge status={loan.status} />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <Wheat className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Collateral</p>
              <p className="font-medium">
                {collateral ? `${collateral.cereal} · ${collateral.quantityKg.toLocaleString()} kg` : "—"}
              </p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Due</p>
              <p className="font-medium">{new Date(loan.dueAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3 min-w-0">
            <Wallet className="w-5 h-5 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Payout wallet</p>
              <p className="font-mono text-xs truncate">{loan.wallet}</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3 min-w-0">
            <Link2 className="w-5 h-5 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Stellar record (simulated)</p>
              <p className="font-mono text-xs truncate">{loan.ledgerRef}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="font-semibold">Repayment</h2>
          </div>
          <dl className="px-4 py-4 text-sm space-y-2">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Principal</dt>
              <dd>{formatAmount(loan.principal)}</dd>
            </div>
            <p className="text-xs text-muted-foreground">Interest is confirmed by Kijani.</p>
          </dl>
          <div className="px-4 pb-4">
            {loan.status === "repaid" ? (
              <p className="text-sm text-muted-foreground">
                Repaid on {loan.repaidAt ? new Date(loan.repaidAt).toLocaleDateString() : "—"}. Your stock is available again.
              </p>
            ) : (
              <Button className="min-h-11 bg-primary text-primary-foreground" onClick={() => repayLoan(loan.id)}>
                Mark as repaid
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
