import { useState } from "react";
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
import { useLoans } from "@/contexts/LoansContext";
import { CEREALS, formatAmount, shortRef, stockValue, maxAdvance, type Cereal } from "@/lib/loans";

const emptyForm = {
  cereal: "Maize" as Cereal,
  quantityKg: "",
  pricePerKg: "",
  warehouse: "",
  receiptNo: "",
};

export default function Stock() {
  const { stock, addStock } = useLoans();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quantityKg = Number(form.quantityKg);
    const pricePerKg = Number(form.pricePerKg);
    if (!(quantityKg > 0) || !(pricePerKg > 0) || !form.warehouse.trim()) return;
    addStock({
      cereal: form.cereal,
      quantityKg,
      pricePerKg,
      warehouse: form.warehouse.trim(),
      receiptNo: form.receiptNo.trim() || "—",
    });
    setForm(emptyForm);
    setOpen(false);
  };

  const statusClass: Record<string, string> = {
    available: "status-badge status-active",
    pledged: "status-badge status-pending",
    released: "status-badge status-closed",
  };

  return (
    <AppLayout>
      <div className="space-y-4 min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold truncate">Stored stock</h1>
            <p className="text-muted-foreground text-sm">
              Cereals held in certified warehouses. Each deposit is recorded so it can only be pledged once.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto min-h-11 touch-target bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" /> Record deposit
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-2rem)] max-w-md" aria-describedby="new-stock-description">
              <DialogHeader>
                <DialogTitle>Record stock deposit</DialogTitle>
              </DialogHeader>
              <p id="new-stock-description" className="sr-only">
                Enter the cereal, quantity and warehouse details from the warehouse receipt.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stock-cereal">Cereal</Label>
                  <Select value={form.cereal} onValueChange={(v: Cereal) => setForm((f) => ({ ...f, cereal: v }))}>
                    <SelectTrigger id="stock-cereal" className="min-h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CEREALS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="stock-qty">Quantity (kg)</Label>
                    <Input
                      id="stock-qty"
                      type="number"
                      min="1"
                      className="min-h-11"
                      value={form.quantityKg}
                      onChange={(e) => setForm((f) => ({ ...f, quantityKg: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock-price">Price per kg</Label>
                    <Input
                      id="stock-price"
                      type="number"
                      min="1"
                      className="min-h-11"
                      value={form.pricePerKg}
                      onChange={(e) => setForm((f) => ({ ...f, pricePerKg: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock-warehouse">Warehouse</Label>
                  <Input
                    id="stock-warehouse"
                    className="min-h-11"
                    value={form.warehouse}
                    onChange={(e) => setForm((f) => ({ ...f, warehouse: e.target.value }))}
                    placeholder="Warehouse name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock-receipt">Warehouse receipt no.</Label>
                  <Input
                    id="stock-receipt"
                    className="min-h-11"
                    value={form.receiptNo}
                    onChange={(e) => setForm((f) => ({ ...f, receiptNo: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" className="min-h-11 w-full sm:w-auto" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="min-h-11 w-full sm:w-auto bg-primary text-primary-foreground">
                    Record deposit
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-x-auto overflow-y-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Cereal</TableHead>
                <TableHead className="font-semibold">Quantity</TableHead>
                <TableHead className="font-semibold">Invoice value</TableHead>
                <TableHead className="font-semibold">Max advance (90%)</TableHead>
                <TableHead className="font-semibold">Warehouse</TableHead>
                <TableHead className="font-semibold">Ledger ref</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stock.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="p-6 text-center text-muted-foreground">
                    No stock recorded yet
                  </TableCell>
                </TableRow>
              ) : (
                stock.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.cereal}</TableCell>
                    <TableCell>{s.quantityKg.toLocaleString()} kg</TableCell>
                    <TableCell>{formatAmount(stockValue(s))}</TableCell>
                    <TableCell>{formatAmount(maxAdvance(s))}</TableCell>
                    <TableCell className="text-muted-foreground">{s.warehouse}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{shortRef(s.ledgerRef)}</TableCell>
                    <TableCell>
                      <span className={statusClass[s.status]}>{s.status.charAt(0).toUpperCase() + s.status.slice(1)}</span>
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
