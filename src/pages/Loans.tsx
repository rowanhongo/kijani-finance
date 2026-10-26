import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useLoans } from "@/contexts/LoansContext";
import { LoanStatusBadge } from "@/components/LoanStatusBadge";
import {
  LOAN_TERMS,
  formatAmount,
  maxAdvance,
  type TermDays,
} from "@/lib/loans";

export default function Loans() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { stock, loans, createLoan } = useLoans();
  const [open, setOpen] = useState(false);
  const [stockId, setStockId] = useState("");
  const [amount, setAmount] = useState("");
  const [termDays, setTermDays] = useState<TermDays>(14);
  const [wallet, setWallet] = useState("");

  const available = stock.filter((s) => s.status === "available");
  const selected = available.find((s) => s.id === stockId);
  const principal = Number(amount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    try {
      const loan = createLoan({ stockId: selected.id, principal, termDays, wallet: wallet.trim() });
      setOpen(false);
      setStockId("");
      setAmount("");
      setWallet("");
      navigate(`/loans/${loan.id}`);
    } catch (err) {
      toast({ title: "Could not create loan", description: err instanceof Error ? err.message : String(err) });
    }
  };

  const collateralLabel = (id: string) => {
    const s = stock.find((d) => d.id === id);
    return s ? `${s.cereal} · ${s.quantityKg.toLocaleString()} kg` : "—";
  };

  return (
    <AppLayout>
      <div className="space-y-4 min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold truncate">Loans</h1>
            <p className="text-muted-foreground text-sm">Advances against stored cereals, paid out as stablecoin</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto min-h-11 touch-target bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" /> New loan
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-2rem)] max-w-md" aria-describedby="new-loan-description">
              <DialogHeader>
                <DialogTitle>New loan</DialogTitle>
              </DialogHeader>
              <p id="new-loan-description" className="sr-only">
                Pick stored stock, an amount up to 90% of its value, and a repayment term.
              </p>
              {available.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  You have no unpledged stock. Record a warehouse deposit first.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loan-stock">Stock to pledge</Label>
                    <Select value={stockId} onValueChange={setStockId}>
                      <SelectTrigger id="loan-stock" className="min-h-11">
                        <SelectValue placeholder="Select stored stock" />
                      </SelectTrigger>
                      <SelectContent>
                        {available.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.cereal} · {s.quantityKg.toLocaleString()} kg · {s.warehouse}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loan-amount">Amount</Label>
                    <Input
                      id="loan-amount"
                      type="number"
                      min="1"
                      max={selected ? maxAdvance(selected) : undefined}
                      className="min-h-11"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                    {selected && (
                      <p className="text-xs text-muted-foreground">
                        Up to {formatAmount(maxAdvance(selected))} (90% of invoice value)
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loan-term">Term</Label>
                    <Select value={String(termDays)} onValueChange={(v) => setTermDays(Number(v) as TermDays)}>
                      <SelectTrigger id="loan-term" className="min-h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LOAN_TERMS.map((t) => (
                          <SelectItem key={t.days} value={String(t.days)}>
                            {t.days} days
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loan-wallet">Stellar wallet address</Label>
                    <Input
                      id="loan-wallet"
                      className="min-h-11 font-mono text-xs"
                      value={wallet}
                      onChange={(e) => setWallet(e.target.value)}
                      placeholder="G…"
                      pattern="G[A-Z2-7]{55}"
                      title="A Stellar public key: 56 characters starting with G"
                      required
                    />
                  </div>
                  <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                    <Button type="button" variant="outline" className="min-h-11 w-full sm:w-auto" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!selected} className="min-h-11 w-full sm:w-auto bg-primary text-primary-foreground">
                      Request loan
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-x-auto overflow-y-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Collateral</TableHead>
                <TableHead className="font-semibold">Principal</TableHead>
                <TableHead className="font-semibold">Term</TableHead>
                <TableHead className="font-semibold">Due</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-6 text-center text-muted-foreground">
                    No loans yet
                  </TableCell>
                </TableRow>
              ) : (
                loans.map((loan) => (
                  <TableRow key={loan.id} className="case-row cursor-pointer" onClick={() => navigate(`/loans/${loan.id}`)}>
                    <TableCell className="font-medium text-primary">{collateralLabel(loan.stockId)}</TableCell>
                    <TableCell>{formatAmount(loan.principal)}</TableCell>
                    <TableCell>{loan.termDays} days</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(loan.dueAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <LoanStatusBadge status={loan.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
