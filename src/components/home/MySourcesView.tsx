import { Search, FileText, BookOpen, Link2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockSources = [
  { id: "1", name: "Land Law Research Notes", type: "note", tags: ["property", "land"], date: "Jan 25, 2024" },
  { id: "2", name: "Employment Act 2007 Summary", type: "document", tags: ["employment", "statute"], date: "Jan 20, 2024" },
  { id: "3", name: "Contract Template - NDA", type: "template", tags: ["contracts"], date: "Jan 15, 2024" },
  { id: "4", name: "Court Rules Reference", type: "link", tags: ["procedure"], date: "Jan 10, 2024" },
];

export function MySourcesView() {
  return (
    <div className="space-y-4 min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold truncate">My Sources</h2>
          <p className="text-muted-foreground text-sm">
            Personal knowledge base, research notes, and templates
          </p>
        </div>
        <Button size="sm" className="min-h-11 touch-target w-full sm:w-auto bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-1" /> Add Source
        </Button>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search your sources..." className="pl-9 min-h-11 w-full" />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {mockSources.map((source) => (
          <div
            key={source.id}
            className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 
                       transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                {source.type === "note" && <BookOpen className="w-5 h-5 text-primary" />}
                {source.type === "document" && <FileText className="w-5 h-5 text-primary" />}
                {source.type === "template" && <FileText className="w-5 h-5 text-secondary-foreground" />}
                {source.type === "link" && <Link2 className="w-5 h-5 text-primary" />}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{source.name}</h3>
                <div className="flex gap-1 mt-1">
                  {source.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{source.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}