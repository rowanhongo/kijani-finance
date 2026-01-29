import { useState } from "react";
import { Mail, MessageCircle, Bell, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FilterType = "all" | "unread" | "favourites" | "whatsapp" | "email" | "add-group";

interface MessageItem {
  id: string;
  type: "mention" | "message" | "notification" | "group";
  from: string;
  matter?: string;
  preview: string;
  time: string;
  unread: boolean;
  group?: "whatsapp" | "email";
}

interface MessageGroup {
  id: string;
  name: string;
  members: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

const initialMessages: MessageItem[] = [
  {
    id: "1",
    type: "mention",
    from: "Sarah Kimani",
    matter: "Kamara v. National Bank",
    preview: "Please review the updated witness statement...",
    time: "2 hours ago",
    unread: true,
    group: "whatsapp",
  },
  {
    id: "2",
    type: "message",
    from: "David Ochieng",
    matter: "TechCorp Employment Dispute",
    preview: "The client has approved the settlement terms",
    time: "Yesterday",
    unread: true,
    group: "email",
  },
  {
    id: "3",
    type: "notification",
    from: "System",
    matter: "Estate of Mwangi",
    preview: "Filing deadline in 3 days",
    time: "Yesterday",
    unread: false,
    group: "email",
  },
];

const filterLabels: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "favourites", label: "Favourites" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "add-group", label: "Add group" },
];

export function MessagesView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [messages] = useState<MessageItem[]>(initialMessages);
  const [groups, setGroups] = useState<MessageGroup[]>([]);
  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupMembers, setNewGroupMembers] = useState("");

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const newGroup: MessageGroup = {
      id: crypto.randomUUID(),
      name: newGroupName.trim(),
      members: newGroupMembers.trim() || "—",
      lastMessage: "No messages yet",
      time: "Just now",
      unread: false,
    };
    setGroups((prev) => [newGroup, ...prev]);
    setNewGroupName("");
    setNewGroupMembers("");
    setAddGroupOpen(false);
  };

  const handleAddGroupClick = () => {
    setAddGroupOpen(true);
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      !searchQuery.trim() ||
      msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.matter?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      msg.preview.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "unread") return matchesSearch && msg.unread;
    if (activeFilter === "whatsapp") return matchesSearch && msg.group === "whatsapp";
    if (activeFilter === "email") return matchesSearch && msg.group === "email";
    return matchesSearch;
  });

  const unreadCount = messages.filter((m) => m.unread).length + groups.filter((g) => g.unread).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Messages</h2>
          <p className="text-muted-foreground text-sm">
            Internal messages, mentions, and groups
          </p>
        </div>
        <Badge variant="secondary">{unreadCount} Unread</Badge>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search or start a new chat"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-muted/50 rounded-lg h-11"
          aria-label="Search messages"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filterLabels.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={value === "add-group" ? handleAddGroupClick : () => setActiveFilter(value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              activeFilter === value
                ? "bg-[#E9F3F3] text-[#1E7D6A] border border-[#1E7D6A]/40"
                : "bg-background border border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Create new group dialog - Telegram-style new bubble */}
      <Dialog open={addGroupOpen} onOpenChange={setAddGroupOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="create-group-description">
          <DialogHeader>
            <DialogTitle>Create new group</DialogTitle>
          </DialogHeader>
          <p id="create-group-description" className="sr-only">
            Create a new message group. Name and optional members.
          </p>
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Group name</Label>
              <Input
                id="group-name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="e.g. Kamara matter team"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="group-members">Add members (optional)</Label>
              <Input
                id="group-members"
                value={newGroupMembers}
                onChange={(e) => setNewGroupMembers(e.target.value)}
                placeholder="Names or emails, comma-separated"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setAddGroupOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Create group
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Group bubbles (created groups) */}
      {groups.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Groups</h3>
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:border-primary/30 transition-colors flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{group.name}</p>
                <p className="text-sm text-muted-foreground truncate">{group.lastMessage}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Members: {group.members}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{group.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Message list */}
      <div className="space-y-2">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "bg-card border border-border rounded-lg p-4 cursor-pointer hover:border-primary/30 transition-colors",
                msg.unread ? "border-l-4 border-l-primary" : ""
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    msg.type === "mention" && "bg-primary/10 text-primary",
                    msg.type === "message" && "bg-secondary text-secondary-foreground",
                    msg.type === "notification" && "bg-warning/10 text-warning"
                  )}
                >
                  {msg.type === "mention" && <MessageCircle className="w-4 h-4" />}
                  {msg.type === "message" && <Mail className="w-4 h-4" />}
                  {msg.type === "notification" && <Bell className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{msg.from}</span>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  {msg.matter && (
                    <p className="text-sm text-primary/80">{msg.matter}</p>
                  )}
                  <p className="text-sm text-muted-foreground truncate">{msg.preview}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
