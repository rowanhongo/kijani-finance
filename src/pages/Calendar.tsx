import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

function EventTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    hearing: "bg-destructive/15 text-destructive",
    deadline: "bg-warning/15 text-warning",
    meeting: "bg-primary/15 text-primary",
  };
  return <Badge className={`${styles[type] ?? "bg-muted/10 text-muted-foreground"} text-xs`}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;
}

export default function Calendar() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", event_date: "", event_time: "", matter_id: "", description: "" });
  const queryClient = useQueryClient();

  const fetchEvents = async () => {
    if (!supabase) return [];
    const { data, error } = await supabase.from("calendar_events").select("*").order("event_date", { ascending: true });
    if (error) throw error;
    return data;
  };

  const { data: events = [], isLoading } = useQuery({ queryKey: ["calendar_events"], queryFn: fetchEvents });

  const createEvent = useMutation({
    mutationFn: async (payload: any) => {
      if (!supabase) throw new Error("Supabase not configured");
      const { error } = await supabase.from("calendar_events").insert([payload]);
      if (error) throw error;
      return payload;
    },
    onSuccess: () => queryClient.invalidateQueries(["calendar_events"]),
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.event_date) return;
    const payload = { id: crypto.randomUUID(), title: form.title.trim(), event_date: form.event_date, event_time: form.event_time || null, matter_id: form.matter_id || null, description: form.description || null };
    try {
      await createEvent.mutateAsync(payload);
      setForm({ title: "", event_date: "", event_time: "", matter_id: "", description: "" });
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Could not create event: " + String(err));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-4 min-w-0">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Calendar</h1>
            <p className="text-muted-foreground text-sm">Court dates, deadlines, and tasks</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="min-h-10 touch-target">Month</Button>
            <Button variant="ghost" size="sm" className="min-h-10 touch-target">Week</Button>
            <Button variant="ghost" size="sm" className="min-h-10 touch-target">Agenda</Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="min-h-10 touch-target bg-primary text-primary-foreground ml-0 sm:ml-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" /> Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>New event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input type="date" value={form.event_date} onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))} required />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input type="time" value={form.event_time} onChange={(e) => setForm((f) => ({ ...f, event_time: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-primary text-primary-foreground">Create</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="min-h-11 min-w-11 touch-target"><ChevronLeft className="w-4 h-4" /></Button>
          <h2 className="text-lg font-medium flex-1 text-center sm:text-left">Upcoming events</h2>
          <Button variant="ghost" size="icon" className="min-h-11 min-w-11 touch-target"><ChevronRight className="w-4 h-4" /></Button>
        </div>

        {/* Upcoming Events (Agenda View) */}
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {isLoading ? (
            <div className="p-4">Loading…</div>
          ) : (
            (events || []).map((event: any) => (
              <div key={event.id} className="p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 hover:bg-muted/50 cursor-pointer min-w-0">
                <div className="w-16 text-center">
                  <p className="text-lg font-semibold text-primary">{new Date(event.event_date).getDate()}</p>
                  <p className="text-xs text-muted-foreground">{new Date(event.event_date).toLocaleString(undefined, { month: 'short' })}</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.event_time ?? ''}</p>
                </div>
                <EventTypeBadge type={event.type ?? 'meeting'} />
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}