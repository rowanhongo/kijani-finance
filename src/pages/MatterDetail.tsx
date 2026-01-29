import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Calendar, User, Building2 } from "lucide-react";

const mockMatterDetail: Record<
  string,
  {
    name: string;
    client: string;
    court: string;
    status: string;
    assignedTo: string;
    opened: string;
    nextHearing?: string;
    documents: { name: string; date: string; type: string }[];
    notes: string;
  }
> = {
  "1": {
    name: "Kamara v. National Bank",
    client: "John Kamara",
    court: "High Court, Nairobi",
    status: "active",
    assignedTo: "Rowan Hongo",
    opened: "2023-08-15",
    nextHearing: "2024-02-15",
    documents: [
      { name: "Witness Statement - John Kamara", date: "2024-01-28", type: "Statement" },
      { name: "Pleadings - Amended Defence", date: "2024-01-10", type: "Pleading" },
      { name: "Court Order - Directions", date: "2023-12-01", type: "Order" },
    ],
    notes:
      "Client alleges wrongful termination and breach of contract. National Bank filed amended defence. Witness statements exchanged. Next: hearing date 15 Feb 2024.",
  },
};

export default function MatterDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const matter = id ? mockMatterDetail[id] : null;

  if (!matter) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => navigate("/matters")} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Matters
          </Button>
          <p className="text-muted-foreground">Matter not found.</p>
        </div>
      </AppLayout>
    );
  }

  const statusStyles: Record<string, string> = {
    active: "status-badge status-active",
    pending: "status-badge status-pending",
    closed: "status-badge status-closed",
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/matters")}
          className="gap-2 -ml-2"
          aria-label="Back to matters"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Matters
        </Button>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{matter.name}</h1>
            <p className="text-muted-foreground text-sm mt-1">Matter overview — what a lawyer would see</p>
          </div>
          <span className={statusStyles[matter.status] ?? "status-badge"}>
            {matter.status.charAt(0).toUpperCase() + matter.status.slice(1)}
          </span>
        </div>

        {/* Key info */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <User className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Client</p>
              <p className="font-medium">{matter.client}</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <Building2 className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Court</p>
              <p className="font-medium">{matter.court}</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Opened</p>
              <p className="font-medium">{matter.opened}</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Next hearing</p>
              <p className="font-medium">{matter.nextHearing ?? "—"}</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Assigned to: {matter.assignedTo}</p>

        {/* Documents */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Documents</h2>
          </div>
          <ul className="divide-y divide-border">
            {matter.documents.map((doc, i) => (
              <li key={i} className="px-4 py-3 flex items-center justify-between hover:bg-muted/50">
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">{doc.date} · {doc.type}</p>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </li>
            ))}
          </ul>
        </div>

        {/* Notes */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="font-semibold">Matter notes</h2>
          </div>
          <div className="px-4 py-4">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{matter.notes}</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
