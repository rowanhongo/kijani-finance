import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Plus, Play, Square, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock time entries
const mockTimeEntries = [
  { id: "1", matter: "Kamara v. National Bank", description: "Drafted witness statement", date: "Jan 28, 2024", hours: 2.5, billable: true, billed: false },
  { id: "2", matter: "TechCorp Employment", description: "Settlement negotiation call", date: "Jan 28, 2024", hours: 1.0, billable: true, billed: false },
  { id: "3", matter: "Estate of Mwangi", description: "Court filing preparation", date: "Jan 27, 2024", hours: 3.0, billable: true, billed: false },
  { id: "4", matter: "Okonkwo Land Dispute", description: "Survey report review", date: "Jan 27, 2024", hours: 1.5, billable: true, billed: true },
  { id: "5", matter: "Internal", description: "Team meeting", date: "Jan 26, 2024", hours: 0.5, billable: false, billed: false },
];

export default function Timesheets() {
  const totalUnbilled = mockTimeEntries.filter(e => e.billable && !e.billed).reduce((sum, e) => sum + e.hours, 0);

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Timesheets</h1>
            <p className="text-muted-foreground text-sm">Track and manage your billable hours</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Play className="w-4 h-4" /> Start Timer
            </Button>
            <Button className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" /> Manual Entry
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Today</span>
            </div>
            <p className="text-2xl font-semibold">3.5h</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">This Week</span>
            </div>
            <p className="text-2xl font-semibold">18.5h</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-warning mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Unbilled</span>
            </div>
            <p className="text-2xl font-semibold">{totalUnbilled}h</p>
          </div>
        </div>

        {/* Time Entries Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Matter</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold text-right">Hours</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTimeEntries.map((entry) => (
                <TableRow key={entry.id} className="case-row">
                  <TableCell className="text-muted-foreground">{entry.date}</TableCell>
                  <TableCell className="font-medium text-primary">{entry.matter}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell className="text-right font-medium">{entry.hours}h</TableCell>
                  <TableCell>
                    {!entry.billable && <Badge variant="secondary">Non-billable</Badge>}
                    {entry.billable && entry.billed && <Badge className="bg-success/15 text-success">Billed</Badge>}
                    {entry.billable && !entry.billed && <Badge className="bg-warning/15 text-warning">Unbilled</Badge>}
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