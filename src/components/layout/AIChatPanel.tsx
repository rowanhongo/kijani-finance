import { useState } from "react";
import { MessageSquare, Minimize2, MoreHorizontal, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIChatPanelProps {
  context?: string;
}

export function AIChatPanel({ context = "My Sources" }: AIChatPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-primary text-primary-foreground rounded-full 
                   shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors z-50"
      >
        <MessageSquare className="w-5 h-5" />
      </button>
    );
  }

  return (
    <aside className="w-72 bg-background border-l border-border flex flex-col shrink-0">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-border">
        <span className="font-medium text-sm text-foreground">New Chat</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground">
            <div className="w-3 h-3 rounded-full border border-current" />
          </Button>
          <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full border border-current" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-6 h-6 text-muted-foreground"
            onClick={() => setIsMinimized(true)}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Input at top */}
      <div className="p-4 border-b border-border">
        <input
          type="text"
          placeholder="Type to ask any question here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-muted/50 text-sm text-muted-foreground placeholder:text-muted-foreground/60 px-3 py-2 rounded-md outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Reference badge */}
      <div className="px-4 py-3">
        <span className="inline-flex items-center gap-1 bg-muted/80 text-muted-foreground text-xs px-2.5 py-1 rounded">
          reference: <span className="text-primary font-medium">{context}</span>
        </span>
      </div>

      {/* Chat content area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Empty state - messages will appear here */}
      </div>

      {/* Send button at bottom right */}
      <div className="p-4 flex justify-end">
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8 text-muted-foreground hover:text-primary"
          disabled={!message.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </aside>
  );
}