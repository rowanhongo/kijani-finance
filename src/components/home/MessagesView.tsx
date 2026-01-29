import { Mail, MessageCircle, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockMessages = [
  {
    id: "1",
    type: "mention",
    from: "Sarah Kimani",
    matter: "Kamara v. National Bank",
    preview: "Please review the updated witness statement...",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    type: "message",
    from: "David Ochieng",
    matter: "TechCorp Employment Dispute",
    preview: "The client has approved the settlement terms",
    time: "Yesterday",
    unread: true,
  },
  {
    id: "3",
    type: "notification",
    from: "System",
    matter: "Estate of Mwangi",
    preview: "Filing deadline in 3 days",
    time: "Yesterday",
    unread: false,
  },
];

export function MessagesView() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Messages</h2>
          <p className="text-muted-foreground text-sm">
            Internal messages, mentions, and notifications
          </p>
        </div>
        <Badge variant="secondary">2 Unread</Badge>
      </div>

      <div className="space-y-2">
        {mockMessages.map((msg) => (
          <div
            key={msg.id}
            className={`bg-card border border-border rounded-lg p-4 cursor-pointer 
                       hover:border-primary/30 transition-colors
                       ${msg.unread ? "border-l-4 border-l-primary" : ""}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center
                             ${msg.type === "mention" ? "bg-primary/10 text-primary" : ""}
                             ${msg.type === "message" ? "bg-secondary text-secondary-foreground" : ""}
                             ${msg.type === "notification" ? "bg-warning/10 text-warning" : ""}`}>
                {msg.type === "mention" && <MessageCircle className="w-4 h-4" />}
                {msg.type === "message" && <Mail className="w-4 h-4" />}
                {msg.type === "notification" && <Bell className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{msg.from}</span>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
                <p className="text-sm text-primary/80">{msg.matter}</p>
                <p className="text-sm text-muted-foreground truncate">{msg.preview}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}