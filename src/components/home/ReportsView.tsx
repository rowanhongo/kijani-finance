import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

export function ReportsView() {
  const queryClient = useQueryClient();
  const BUCKET = (import.meta.env.VITE_SUPABASE_BUCKET as string) || "recordings";

  const fetchRecordingsFromStorage = async () => {
    if (!supabase) return [];
    const { data, error } = await supabase.storage
      .from("recordings")
      .list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });
    if (error) throw error;
    return data ?? [];
  };

  const { data: recordings = [], isLoading } = useQuery({
    queryKey: ["recordings-storage"],
    queryFn: fetchRecordingsFromStorage,
  });

  const deleteRecording = useMutation({
    mutationFn: async (rec: any) => {
      if (!supabase) throw new Error("Supabase not configured");
      // remove file from storage (file.name expected from storage.list)
      const fileName = rec.name ?? rec.path ?? rec.id;
      if (fileName) {
        const { error: rmErr } = await supabase.storage.from(BUCKET).remove([fileName]);
        if (rmErr) throw rmErr;
      }
      // remove metadata row if it exists (match by path/name)
      const { error } = await supabase.from("recordings").delete().or(`path.eq.${fileName},name.eq.${fileName}`);
      if (error) throw error;
      return rec;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["recordings-storage"]);
      queryClient.invalidateQueries(["recordings"]);
    },
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
          // show 3 skeleton cards while loading
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-4 w-3/4 mb-3" />
              <Skeleton className="h-3 w-1/2 mb-4" />
              <Skeleton className="h-10 w-full" />
            </Card>
          ))
        ) : recordings.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">No recordings yet. Use the voice recorder in the AI chat panel to create one.</div>
        ) : (
          recordings.map((file: any) => {
            const { data: urlData } = supabase ? supabase.storage.from("recordings").getPublicUrl(file.name) : { data: { publicUrl: null } };
            const publicUrl = urlData?.publicUrl ?? null;
            const sizeBytes = file.metadata?.size ? Number(file.metadata.size) : file.size ?? 0;
            const fmtSize = formatBytes(sizeBytes);
            return (
              <Card key={file.id ?? file.name} className="p-4 hover:border-primary/30 transition-colors">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{file.name}</h3>
                      <p className="text-xs text-muted-foreground">{new Date(file.created_at).toLocaleDateString()}</p>
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
                  <div className="flex justify-end gap-2">
                    {publicUrl && (
                      <Button variant="ghost" onClick={() => window.open(publicUrl, "_blank")} aria-label="Download">
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (confirm("Delete this recording?")) deleteRecording.mutate(file);
                      }}
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
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