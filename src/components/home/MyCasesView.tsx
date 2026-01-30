import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight } from "lucide-react";

// Mock data for cases
const mockCases = [
  {
    id: "1",
    name: "Kamara v. National Bank",
    client: "John Kamara",
    court: "High Court, Nairobi",
    status: "active",
    nextDate: "2024-02-15",
    lastActivity: "Document uploaded",
  },
  {
    id: "2",
    name: "TechCorp Employment Dispute",
    client: "TechCorp Ltd",
    court: "Industrial Court",
    status: "pending",
    nextDate: "2024-02-20",
    lastActivity: "Hearing scheduled",
  },
  {
    id: "3",
    name: "Estate of Mwangi (Probate)",
    client: "Wanjiku Mwangi",
    court: "High Court, Kisumu",
    status: "active",
    nextDate: "2024-03-01",
    lastActivity: "Brief filed",
  },
  {
    id: "4",
    name: "Okonkwo Land Dispute",
    client: "Chidi Okonkwo",
    court: "Environment & Land Court",
    status: "active",
    nextDate: "2024-02-28",
    lastActivity: "Survey report received",
  },
  {
    id: "5",
    name: "Rwanda Trade Agreement Review",
    client: "Ministry of Trade",
    court: "N/A - Advisory",
    status: "pending",
    nextDate: "-",
    lastActivity: "Contract review in progress",
  },
  {
    id: "6",
    name: "Abebe Construction Contract",
    client: "Abebe Construction",
    court: "Commercial Court",
    status: "closed",
    nextDate: "-",
    lastActivity: "Settlement reached",
  },
];

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    active: "status-badge status-active",
    pending: "status-badge status-pending",
    closed: "status-badge status-closed",
  };

  return (
    <span className={statusStyles[status] || "status-badge"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function MyCasesView() {
  const navigate = useNavigate();
  return (
    <div className="space-y-4 min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold truncate">My Cases</h2>
          <p className="text-muted-foreground text-sm">
            Cases assigned to you, sorted by recent activity
          </p>
        </div>
        <Badge variant="secondary" className="text-sm w-fit shrink-0">
          {mockCases.filter(c => c.status !== "closed").length} Active
        </Badge>
      </div>

      {/* Cases Table - horizontal scroll on mobile */}
      <div className="bg-card rounded-lg border border-border overflow-x-auto overflow-y-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Case Name</TableHead>
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Court</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Next Date</TableHead>
              <TableHead className="font-semibold">Last Activity</TableHead>
              <TableHead className="w-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCases.map((caseItem) => (
              <TableRow
                key={caseItem.id}
                className="case-row cursor-pointer"
                onClick={() => caseItem.id === "1" && navigate("/matters/1")}
              >
                <TableCell className="font-medium text-primary">
                  {caseItem.name}
                </TableCell>
                <TableCell>{caseItem.client}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {caseItem.court}
                </TableCell>
                <TableCell>
                  <StatusBadge status={caseItem.status} />
                </TableCell>
                <TableCell>{caseItem.nextDate}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {caseItem.lastActivity}
                </TableCell>
                <TableCell>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}