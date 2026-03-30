import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Calendar, User, Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export default function MatterDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchMatter = async () => {
    if (!supabase || !id) return null;
    const { data, error } = await supabase.from("matters").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  };

  const { data: matter, isLoading, isError } = useQuery({
    queryKey: ["matter", id],
    queryFn: fetchMatter,
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div>Loading…</div>
      </AppLayout>
    );
  }

  if (isError || !matter) {
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
      <div className="space-y-6 min-w-0">
        <Button
          variant="ghost"
          onClick={() => navigate("/matters")}
          className="gap-2 -ml-2 min-h-11 touch-target"
          aria-label="Back to matters"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Matters
        </Button>

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold break-words">{matter.name}</h1>
            <p className="text-muted-foreground text-sm mt-1">Matter overview — what a lawyer would see</p>
          </div>
          <span className={statusStyles[matter.status] ?? "status-badge shrink-0"}>
            {matter.status.charAt(0).toUpperCase() + matter.status.slice(1)}
          </span>
        </div>

        {/* Key info */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
              <p className="font-medium">{matter.opened ?? "—"}</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Next hearing</p>
              <p className="font-medium">{matter.next_hearing ?? matter.nextHearing ?? "—"}</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Assigned to: {matter.assigned_to ?? matter.assignedTo}</p>

        {/* Documents */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Documents</h2>
          </div>
          <ul className="divide-y divide-border">
            {(matter.documents ?? []).map((doc: any, i: number) => (
              <li key={i} className="px-4 py-3 flex items-center justify-between hover:bg-muted/50">
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">{doc.date} · {doc.type}</p>
                </div>
                <Button variant="ghost" size="sm" className="min-h-9 touch-target">
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
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{matter.notes ?? matter.notes}</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
