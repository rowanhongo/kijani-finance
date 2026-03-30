import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export function ReportsView() {
  const queryClient = useQueryClient();
  const BUCKET = (import.meta.env.VITE_SUPABASE_BUCKET as string) || "recordings";

  const fetchRecordings = async () => {
    if (!supabase) return [];
    const { data, error } = await supabase.from("recordings").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data as any[];
  };

  const { data: recordings = [], isLoading } = useQuery({ queryKey: ["recordings"], queryFn: fetchRecordings });

  const deleteRecording = useMutation({
    mutationFn: async (rec: any) => {
      if (!supabase) throw new Error("Supabase not configured");
      // remove file from storage
      if (rec.path) {
        const { error: rmErr } = await supabase.storage.from(BUCKET).remove([rec.path]);
        if (rmErr) throw rmErr;
      }
      // remove metadata row
      const { error } = await supabase.from("recordings").delete().eq("id", rec.id);
      if (error) throw error;
      return rec;
    },
    onSuccess: () => queryClient.invalidateQueries(["recordings"]),
  });

  return (
    <div className="space-y-4 min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold truncate">Recordings</h2>
          <p className="text-muted-foreground text-sm">All stored audio recordings</p>
        </div>
        <div />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div>Loading…</div>
        ) : (
          recordings.map((rec: any) => {
            const publicUrl = supabase ? supabase.storage.from(BUCKET).getPublicUrl(rec.path).data?.publicUrl : null;
            return (
              <div key={rec.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Play className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{rec.name ?? rec.path}</h3>
                      <p className="text-xs text-muted-foreground">{new Date(rec.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {publicUrl && (
                      <Button variant="ghost" size="icon" onClick={() => window.open(publicUrl, "_blank")} aria-label="Play">
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Delete this recording?")) deleteRecording.mutate(rec);
                      }}
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}