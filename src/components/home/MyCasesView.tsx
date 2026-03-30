import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

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
  const fetchMatters = async () => {
    if (!supabase) return [];
    const { data, error } = await supabase.from("matters").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  };

  const { data: matters = [], isLoading } = useQuery({ queryKey: ["matters"], queryFn: fetchMatters });
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
          {(matters.filter((c: any) => c.status !== "closed").length ?? 0)} Active
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
            {isLoading ? (
              // show 6 skeleton rows
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0" />
                  </TableCell>
                </TableRow>
              ))
            ) : matters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="p-6 text-center text-muted-foreground">
                  No cases yet
                </TableCell>
              </TableRow>
            ) : (
              matters.map((matter: any) => (
                <TableRow
                  key={matter.id}
                  className="case-row cursor-pointer"
                  onClick={() => navigate(`/matters/${matter.id}`)}
                >
                  <TableCell className="font-medium text-primary">{matter.name}</TableCell>
                  <TableCell>{matter.client}</TableCell>
                  <TableCell>{matter.assigned_to ?? matter.assignedTo}</TableCell>
                  <TableCell className="text-muted-foreground">{matter.court}</TableCell>
                  <TableCell className="max-w-[200px]">
                    {/* viewableBy rendering omitted for brevity */}
                    <span className="text-sm text-muted-foreground">—</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={matter.status} />
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}