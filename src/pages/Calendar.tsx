import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock calendar events
const mockEvents = [
  { id: "1", title: "Court Hearing - Kamara v. National Bank", date: "Feb 15, 2024", time: "9:00 AM", type: "hearing", court: "High Court" },
  { id: "2", title: "Filing Deadline - Estate of Mwangi", date: "Feb 18, 2024", time: "5:00 PM", type: "deadline", matter: "Probate Application" },
  { id: "3", title: "Client Meeting - TechCorp", date: "Feb 20, 2024", time: "2:00 PM", type: "meeting", location: "Office" },
  { id: "4", title: "Court Appearance - Okonkwo", date: "Feb 28, 2024", time: "10:00 AM", type: "hearing", court: "ELC" },
];

function EventTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    hearing: "bg-destructive/15 text-destructive",
    deadline: "bg-warning/15 text-warning",
    meeting: "bg-primary/15 text-primary",
  };
  return <Badge className={`${styles[type]} text-xs`}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;
}

export default function Calendar() {
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
            <Button className="min-h-10 touch-target bg-primary text-primary-foreground ml-0 sm:ml-2 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Add Event
            </Button>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="min-h-11 min-w-11 touch-target"><ChevronLeft className="w-4 h-4" /></Button>
          <h2 className="text-lg font-medium flex-1 text-center sm:text-left">February 2024</h2>
          <Button variant="ghost" size="icon" className="min-h-11 min-w-11 touch-target"><ChevronRight className="w-4 h-4" /></Button>
        </div>

        {/* Upcoming Events (Agenda View) */}
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {mockEvents.map((event) => (
            <div key={event.id} className="p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 hover:bg-muted/50 cursor-pointer min-w-0">
              <div className="w-16 text-center">
                <p className="text-lg font-semibold text-primary">{event.date.split(" ")[1].replace(",", "")}</p>
                <p className="text-xs text-muted-foreground">{event.date.split(" ")[0]}</p>
              </div>
              <div className="flex-1">
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-muted-foreground">{event.time}</p>
              </div>
              <EventTypeBadge type={event.type} />
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}