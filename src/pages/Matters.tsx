import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for all firm matters
const mockMatters = [
  { id: "1", name: "Kamara v. National Bank", client: "John Kamara", assignedTo: "Rowan Hongo", status: "active", court: "High Court" },
  { id: "2", name: "TechCorp Employment Dispute", client: "TechCorp Ltd", assignedTo: "Sarah Kimani", status: "active", court: "Industrial Court" },
  { id: "3", name: "Estate of Mwangi", client: "Wanjiku Mwangi", assignedTo: "Rowan Hongo", status: "pending", court: "High Court" },
  { id: "4", name: "Okonkwo Land Dispute", client: "Chidi Okonkwo", assignedTo: "David Ochieng", status: "active", court: "ELC" },
  { id: "5", name: "Abebe Construction", client: "Abebe Construction", assignedTo: "Sarah Kimani", status: "closed", court: "Commercial" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "status-badge status-active",
    pending: "status-badge status-pending",
    closed: "status-badge status-closed",
  };
  return <span className={styles[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

export default function Matters() {
  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Matters</h1>
            <p className="text-muted-foreground text-sm">Firm-wide case management</p>
          </div>
          <Button className="bg-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" /> New Matter
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search matters..." className="pl-9" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
        </div>

        {/* Matters Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Matter Name</TableHead>
                <TableHead className="font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Assigned To</TableHead>
                <TableHead className="font-semibold">Court</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMatters.map((matter) => (
                <TableRow key={matter.id} className="case-row">
                  <TableCell className="font-medium text-primary">{matter.name}</TableCell>
                  <TableCell>{matter.client}</TableCell>
                  <TableCell>{matter.assignedTo}</TableCell>
                  <TableCell className="text-muted-foreground">{matter.court}</TableCell>
                  <TableCell><StatusBadge status={matter.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}