import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useMatters } from "@/contexts/MattersContext";
import type { MatterItem, ViewableBy } from "@/contexts/MattersContext";

const viewableByLabel = (
  value: ViewableBy,
  VIEWABLE_BY_OPTIONS: { value: string; label: string }[]
): string => VIEWABLE_BY_OPTIONS.find((o) => o.value === value)?.label ?? value;

const ViewableByBadges = ({
  viewableBy,
  viewableByOptions,
}: {
  viewableBy: ViewableBy[];
  viewableByOptions: { value: string; label: string }[];
}) => {
  const showAll = viewableBy.includes("all");
  const list = showAll ? ["all"] : viewableBy;
  return (
    <span className="inline-flex flex-wrap gap-1">
      {list.map((v) => (
        <Badge key={v} variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
          {viewableByLabel(v as ViewableBy, viewableByOptions)}
        </Badge>
      ))}
    </span>
  );
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "status-badge status-active",
    pending: "status-badge status-pending",
    closed: "status-badge status-closed",
  };
  return <span className={styles[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

export default function Matters() {
  const navigate = useNavigate();
  const { matters, addMatter, VIEWABLE_BY_OPTIONS } = useMatters();
  const [newMatterOpen, setNewMatterOpen] = useState(false);
  const [newMatterForm, setNewMatterForm] = useState({
    name: "",
    client: "",
    assignedTo: "",
    court: "",
    status: "active" as const,
    viewableBy: ["all"] as ViewableBy[],
  });

  const toggleViewableBy = (value: ViewableBy) => {
    setNewMatterForm((f) => {
      if (value === "all") {
        return { ...f, viewableBy: ["all"] };
      }
      const next = f.viewableBy.includes(value)
        ? f.viewableBy.filter((v) => v !== value)
        : [...f.viewableBy.filter((v) => v !== "all"), value];
      return { ...f, viewableBy: next.length ? next : ["all"] };
    });
  };

  const handleNewMatter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatterForm.name.trim()) return;
    const newMatter: MatterItem = {
      id: crypto.randomUUID(),
      name: newMatterForm.name.trim(),
      client: newMatterForm.client.trim() || "—",
      assignedTo: newMatterForm.assignedTo.trim() || "—",
      court: newMatterForm.court.trim() || "—",
      status: newMatterForm.status,
      viewableBy: newMatterForm.viewableBy,
    };
    addMatter(newMatter);
    setNewMatterForm({
      name: "",
      client: "",
      assignedTo: "",
      court: "",
      status: "active",
      viewableBy: ["all"],
    });
    setNewMatterOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Matters</h1>
            <p className="text-muted-foreground text-sm">Firm-wide case management</p>
          </div>
          <Dialog open={newMatterOpen} onOpenChange={setNewMatterOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground" aria-label="New matter">
                <Plus className="w-4 h-4 mr-2" /> New Matter
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" aria-describedby="new-matter-description">
              <DialogHeader>
                <DialogTitle>New matter</DialogTitle>
              </DialogHeader>
              <p id="new-matter-description" className="sr-only">
                Enter matter details and choose who can view it.
              </p>
              <form onSubmit={handleNewMatter} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="matter-name">Matter name</Label>
                  <Input
                    id="matter-name"
                    value={newMatterForm.name}
                    onChange={(e) => setNewMatterForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Smith v. Acme Ltd"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matter-client">Client</Label>
                  <Input
                    id="matter-client"
                    value={newMatterForm.client}
                    onChange={(e) => setNewMatterForm((f) => ({ ...f, client: e.target.value }))}
                    placeholder="Client name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matter-assigned">Assigned to</Label>
                  <Input
                    id="matter-assigned"
                    value={newMatterForm.assignedTo}
                    onChange={(e) => setNewMatterForm((f) => ({ ...f, assignedTo: e.target.value }))}
                    placeholder="e.g. Rowan Hongo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matter-court">Court</Label>
                  <Input
                    id="matter-court"
                    value={newMatterForm.court}
                    onChange={(e) => setNewMatterForm((f) => ({ ...f, court: e.target.value }))}
                    placeholder="e.g. High Court"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matter-status">Status</Label>
                  <Select
                    value={newMatterForm.status}
                    onValueChange={(v: "active" | "pending" | "closed") =>
                      setNewMatterForm((f) => ({ ...f, status: v }))
                    }
                  >
                    <SelectTrigger id="matter-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Viewable by</Label>
                  <p className="text-xs text-muted-foreground mb-1.5">
                    Select one or more roles (e.g. Paralegals, Partners, Counsel).
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2.5 rounded-md border border-border bg-muted/30 p-3">
                    {VIEWABLE_BY_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-2 cursor-pointer text-sm min-w-0"
                      >
                        <Checkbox
                          checked={
                            opt.value === "all"
                              ? newMatterForm.viewableBy.includes("all")
                              : newMatterForm.viewableBy.includes(opt.value)
                          }
                          onCheckedChange={() => toggleViewableBy(opt.value)}
                          aria-label={opt.label}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setNewMatterOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary text-primary-foreground">
                    Create matter
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search matters..." className="pl-9" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Matter Name</TableHead>
                <TableHead className="font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Assigned To</TableHead>
                <TableHead className="font-semibold">Court</TableHead>
                <TableHead className="font-semibold">Viewable by</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matters.map((matter) => (
                <TableRow
                  key={matter.id}
                  className="case-row cursor-pointer"
                  onClick={() => matter.id === "1" && navigate("/matters/1")}
                >
                  <TableCell className="font-medium text-primary">{matter.name}</TableCell>
                  <TableCell>{matter.client}</TableCell>
                  <TableCell>{matter.assignedTo}</TableCell>
                  <TableCell className="text-muted-foreground">{matter.court}</TableCell>
                  <TableCell className="max-w-[200px]">
                    <ViewableByBadges viewableBy={matter.viewableBy} viewableByOptions={VIEWABLE_BY_OPTIONS} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={matter.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
