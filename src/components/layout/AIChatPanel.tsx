import { useState } from "react";
import { MessageSquare, Minimize2, Maximize2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
    <aside className="w-80 bg-chat border-l border-chat-border flex flex-col shrink-0 animate-slide-in-right">
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-chat-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">New Chat</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-7 h-7">
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-7 h-7"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Chat content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Placeholder message */}
        <div className="text-center text-muted-foreground text-sm mt-8">
          <Sparkles className="w-8 h-8 mx-auto mb-3 text-primary/30" />
          <p>Ask anything about your cases,</p>
          <p>documents, or legal research.</p>
        </div>
      </div>

      {/* Context badge */}
      <div className="px-4 pb-2">
        <Badge variant="secondary" className="text-xs">
          reference: {context}
        </Badge>
      </div>

      {/* Input */}
      <div className="p-4 pt-0">
        <div className="relative">
          <Input
            placeholder="Type to ask any question here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="pr-10 bg-chat-input border-chat-border"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 text-primary"
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}