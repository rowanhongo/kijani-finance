import { FileText, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockReports = [
  {
    id: "1",
    name: "Monthly Billable Hours Summary",
    type: "Analytics",
    lastUpdated: "Jan 28, 2024",
  },
  {
    id: "2",
    name: "Active Cases by Status",
    type: "Dashboard",
    lastUpdated: "Jan 27, 2024",
  },
  {
    id: "3",
    name: "Client Billing Report - Q4",
    type: "Financial",
    lastUpdated: "Jan 15, 2024",
  },
];

export function ReportsView() {
  return (
    <div className="space-y-4 min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold truncate">Reports</h2>
          <p className="text-muted-foreground text-sm">
            Your personal reports, views, and analytics
          </p>
        </div>
        <Button size="sm" className="min-h-11 touch-target w-full sm:w-auto bg-primary text-primary-foreground">
          + New Report
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {mockReports.map((report) => (
          <div
            key={report.id}
            className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 
                       transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                {report.type === "Analytics" && <TrendingUp className="w-5 h-5 text-primary" />}
                {report.type === "Dashboard" && <FileText className="w-5 h-5 text-primary" />}
                {report.type === "Financial" && <Clock className="w-5 h-5 text-primary" />}
              </div>
              <div>
                <h3 className="font-medium">{report.name}</h3>
                <p className="text-xs text-muted-foreground">{report.type}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Updated {report.lastUpdated}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}