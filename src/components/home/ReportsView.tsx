import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
          // show 6 skeleton cards while loading
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4">
              <Skeleton className="h-4 w-3/4 mb-3" />
              <Skeleton className="h-3 w-1/2 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))
        ) : recordings.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">No recordings yet</div>
        ) : (
          recordings.map((rec: any) => {
            const publicUrl = supabase ? supabase.storage.from(BUCKET).getPublicUrl(rec.path).data?.publicUrl : null;
            const sizeBytes = rec.size ?? rec.file_size ?? 0;
            const fmtSize = formatBytes(sizeBytes);
            return (
              <div key={rec.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{rec.name ?? rec.path}</h3>
                      <p className="text-xs text-muted-foreground">{new Date(rec.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{fmtSize}</div>
                  </div>
                  {publicUrl ? (
                    <audio controls src={publicUrl} className="w-full" preload="metadata">
                      Your browser does not support the <code>audio</code> element.
                    </audio>
                  ) : (
                    <div className="text-sm text-muted-foreground">Audio not available</div>
                  )}
                  <div className="flex justify-end">
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

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const thresh = 1024;
  if (Math.abs(bytes) < thresh) return bytes + " B";
  const units = ["KB", "MB", "GB", "TB"];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + " " + units[u];
}