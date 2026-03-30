import { useState, useCallback, useEffect, useRef } from "react";
import { MessageSquare, Plus, MoreHorizontal, Send, Clock, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useChatPanel } from "@/contexts/ChatPanelContext";
import { useIsMobile } from "@/hooks/use-mobile";
import VoiceRecorder from "@/components/VoiceRecorder";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
const APIFREE_KEY = import.meta.env.VITE_APIFREE_LLM_KEY as string;

const MAX_OPEN_CHATS = 2;
const CHAT_HISTORY_KEY = "sheria-chat-history";

const REFERENCE_OPTIONS = [
  { value: "My Sources", label: "My Sources" },
  { value: "Documents", label: "Documents" },
  { value: "SLL", label: "SLL" },
] as const;

type ReferenceValue = (typeof REFERENCE_OPTIONS)[number]["value"];

const CHAT_INPUT_CLASS =
  "flex-1 text-sm px-3 py-2 rounded-md outline-none min-w-0 " +
  "text-foreground bg-[#E9F3F3] border border-[#1E7D6A]/40 placeholder:text-[#1E7D6A]/70 " +
  "focus:ring-2 focus:ring-[#1E7D6A]/30 focus:border-[#1E7D6A] " +
  "dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:border-gray-600 " +
  "dark:focus:ring-gray-500 dark:focus:border-gray-500";

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const loadHistory = (): ChatSession[] => {
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveHistory = (history: ChatSession[]) => {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
};

interface AIChatPanelProps {
  context?: string;
}

export function AIChatPanel({ context = "My Sources" }: AIChatPanelProps) {
  const { isMinimized, setIsMinimized } = useChatPanel();
  const isMobile = useIsMobile();
  const [message, setMessage] = useState("");
  const [openChats, setOpenChats] = useState<ChatSession[]>(() => [
    { id: crypto.randomUUID(), title: "New chat", createdAt: Date.now() },
  ]);
  const [activeChatId, setActiveChatId] = useState<string | null>(() => null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>(loadHistory);
  const [showMaxChatsBubble, setShowMaxChatsBubble] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [messagesByChatId, setMessagesByChatId] = useState<Record<string, ChatMessage[]>>({});
  const [reference, setReference] = useState<ReferenceValue>(context as ReferenceValue);
  const [pendingHistoryChat, setPendingHistoryChat] = useState<ChatSession | null>(null);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeId = activeChatId ?? openChats[0]?.id ?? null;
  const activeMessages = (activeId && messagesByChatId[activeId]) ?? [];
  const hasMessages = activeMessages.length > 0;

  useEffect(() => {
    if (openChats.length > 0 && !activeId) setActiveChatId(openChats[0].id);
  }, [openChats.length, activeId]);

  useEffect(() => {
    saveHistory(chatHistory);
  }, [chatHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages.length]);

  const handlePlus = useCallback(() => {
    if (openChats.length >= MAX_OPEN_CHATS) {
      setShowMaxChatsBubble(true);
      const t = setTimeout(() => setShowMaxChatsBubble(false), 4000);
      return () => clearTimeout(t);
    }
    const newChat: ChatSession = {
      id: crypto.randomUUID(),
      title: "New chat",
      createdAt: Date.now(),
    };
    setOpenChats((prev) => [...prev, newChat]);
    setActiveChatId(newChat.id);
    setMessage("");
  }, [openChats.length]);

  const handleCloseChat = useCallback((id: string) => {
    setOpenChats((prev) => {
      const chat = prev.find((c) => c.id === id);
      if (chat) {
        setChatHistory((h) => [{ ...chat, title: chat.title || "Chat" }, ...h]);
      }
      let next = prev.filter((c) => c.id !== id);
      if (next.length === 0) {
        next = [
          {
            id: crypto.randomUUID(),
            title: "New chat",
            createdAt: Date.now(),
          },
        ];
        setActiveChatId(next[0].id);
      } else if (activeChatId === id) {
        setActiveChatId(next[0].id);
      }
      return next;
    });
    setMessage("");
  }, [activeChatId]);

  const handleDeleteHistoryItem = useCallback((id: string) => {
    setChatHistory((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const openFromHistoryAfterConfirm = useCallback(() => {
    if (!pendingHistoryChat) return;
    const chat = pendingHistoryChat;
    setPendingHistoryChat(null);
    const older = openChats[0];
    setOpenChats((prev) => {
      const rest = prev.filter((c) => c.id !== older.id);
      setChatHistory((h) => [{ ...older, title: older.title || "Chat" }, ...h]);
      return [...rest, chat];
    });
    setChatHistory((prev) => prev.filter((c) => c.id !== chat.id));
    setActiveChatId(chat.id);
    setMessage("");
    setHistoryOpen(false);
  }, [pendingHistoryChat, openChats]);

  const handleOpenFromHistory = useCallback(
    (chat: ChatSession) => {
      const alreadyOpen = openChats.some((c) => c.id === chat.id);
      if (alreadyOpen) {
        setActiveChatId(chat.id);
        setHistoryOpen(false);
        return;
      }
      if (openChats.length >= 2) {
        setPendingHistoryChat(chat);
        return;
      }
      setChatHistory((prev) => prev.filter((c) => c.id !== chat.id));
      setOpenChats((prev) => [...prev, chat]);
      setActiveChatId(chat.id);
      setMessage("");
      setHistoryOpen(false);
    },
    [openChats]
  );

  const handleSend = useCallback(async () => {
    const text = message.trim();
    if (!text || !activeId) return;
    setIsSending(true);
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    // add user message locally
    setMessagesByChatId((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), userMsg],
    }));
    setMessage("");

    // Update chat title from first message
    if (activeMessages.length === 0) {
      const title = text.length > 30 ? text.slice(0, 27) + "..." : text;
      setOpenChats((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, title } : c))
      );
    }

    try {
      if (supabase) {
        await supabase.from("messages").insert([{ role: "user", content: text }]);
      }
    } catch (err) {
      console.warn("Could not persist message", err);
    }

    // insert a placeholder assistant message so UI shows immediate feedback
    const placeholderId = crypto.randomUUID();
    const placeholderMsg: ChatMessage = {
      id: placeholderId,
      role: "assistant",
      content: "Thinking...",
    };
    setMessagesByChatId((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), placeholderMsg],
    }));

    // If LLM key missing, notify user and replace placeholder with a helpful note
    if (!APIFREE_KEY) {
      const msg = "LLM key not set. Set VITE_APIFREE_LLM_KEY in .env";
      toast({ title: "LLM key missing", description: msg });
      setMessagesByChatId((prev) => ({
        ...prev,
        [activeId]: (prev[activeId] ?? []).map((m) =>
          m.id === placeholderId ? { ...m, content: msg } : m
        ),
      }));
      setIsSending(false);
      return;
    }

    // Call apifreellm
    try {
      const res = await fetch("/.netlify/functions/llm-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const reply = data?.response ?? "(no response)";

      // replace placeholder with real reply
      setMessagesByChatId((prev) => ({
        ...prev,
        [activeId]: (prev[activeId] ?? []).map((m) =>
          m.id === placeholderId ? { ...m, content: reply } : m
        ),
      }));

      try {
        if (supabase) {
          await supabase.from("messages").insert([{ role: "assistant", content: reply }]);
        }
      } catch (err) {
        console.warn("Could not persist assistant response", err);
      }
    } catch (err) {
      console.error("LLM call failed", err);
      setMessagesByChatId((prev) => ({
        ...prev,
        [activeId]: (prev[activeId] ?? []).map((m) =>
          m.id === placeholderId ? { ...m, content: "Error getting response" } : m
        ),
      }));
    } finally {
      setIsSending(false);
    }
  }, [message, activeId, activeMessages.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    return sameDay
      ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleDateString([], {
          month: "short",
          day: "numeric",
          year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        });
  };

  const referenceSelector = (
    <div className="px-4 py-2 shrink-0 flex items-center gap-2">
      <span className="text-xs text-muted-foreground dark:text-gray-300 shrink-0">reference:</span>
      <Select value={reference} onValueChange={(v) => setReference(v as ReferenceValue)}>
        <SelectTrigger className="h-8 text-xs font-medium border-border bg-muted/80 dark:bg-gray-800 dark:text-teal-400 flex-1 min-w-0">
          <SelectValue placeholder="Select reference" />
        </SelectTrigger>
        <SelectContent>
          {REFERENCE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-sm">
              {opt.label === "SLL" ? "SLL (Sheria Law Library)" : opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const inputRow = (className?: string) => (
    <div
      className={cn(
        "flex items-center gap-2 p-3 border-t border-border bg-background shrink-0",
        className
      )}
    >
      <input
        type="text"
        placeholder={hasMessages ? "Follow up..." : "Type to ask any question here"}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className={CHAT_INPUT_CLASS}
        aria-label="Chat message"
      />
      <Button
        size="icon"
        variant="ghost"
        className="w-8 h-8 shrink-0 text-[#1E7D6A] dark:text-teal-400 hover:text-[#1E7D6A]/90 dark:hover:text-teal-300 disabled:opacity-50"
        disabled={!message.trim() || isSending}
        onClick={handleSend}
        aria-label="Send message"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 w-14 h-14 min-w-[56px] min-h-[56px] touch-target bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors z-50 focus-visible:ring-2 focus-visible:ring-ring"
        style={{ marginBottom: "max(1rem, env(safe-area-inset-bottom, 0px))", marginRight: "max(1rem, env(safe-area-inset-right, 0px))" }}
        aria-label="Open chat"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  const panelWrapperClass = isMobile
    ? "fixed inset-0 z-50 flex flex-col bg-background min-h-0"
    : "w-72 bg-background border-l border-border flex flex-col shrink-0 min-h-0";

  return (
    <aside className={cn(panelWrapperClass, "flex flex-col")}>
      <div className="relative px-3 py-2 flex items-center gap-2 border-b border-border min-h-12 sm:min-h-10 shrink-0 pt-[env(safe-area-inset-top)] sm:pt-0">
        <div className="flex items-center gap-1 min-w-0 flex-1 overflow-hidden">
          {openChats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "flex items-center gap-0.5 rounded-md text-sm shrink-0 max-w-[90px] overflow-hidden border border-transparent",
                activeId === chat.id
                  ? "bg-muted text-foreground font-medium border-border"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <button
                type="button"
                onClick={() => setActiveChatId(chat.id)}
                className="truncate flex-1 text-left px-2 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                {chat.title}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseChat(chat.id);
                }}
                className="shrink-0 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close chat"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 text-muted-foreground hover:text-foreground"
            onClick={handlePlus}
            aria-label="New chat"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Popover open={historyOpen} onOpenChange={setHistoryOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-muted-foreground hover:text-foreground"
                aria-label="Chat history"
              >
                <Clock className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="end">
              <div className="p-2 border-b border-border">
                <p className="text-sm font-medium text-foreground">Chat history</p>
                <p className="text-xs text-muted-foreground">Past chats</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {chatHistory.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground text-center">
                    No past chats yet.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {chatHistory.map((chat) => (
                      <li
                        key={chat.id}
                        className="flex items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-muted/50 group"
                      >
                        <button
                          type="button"
                          onClick={() => handleOpenFromHistory(chat)}
                          className="min-w-0 flex-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring rounded py-0.5"
                        >
                          <p className="truncate text-foreground">{chat.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(chat.createdAt)}
                          </p>
                        </button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteHistoryItem(chat.id);
                          }}
                          aria-label="Delete chat from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 min-w-[44px] min-h-[44px] touch-target text-muted-foreground hover:text-foreground"
            onClick={() => setIsMinimized(true)}
            aria-label="Close chat"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showMaxChatsBubble && (
        <div
          className="mx-3 mt-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm border border-primary/20 shrink-0"
          role="alert"
        >
          You can have up to 2 chats open. Close one to open another.
        </div>
      )}

      {pendingHistoryChat && (
        <div
          className="mx-3 mt-2 px-3 py-2 rounded-lg border border-border bg-card text-xs shrink-0 flex items-center gap-2 flex-wrap"
          role="alert"
          aria-live="polite"
        >
          <span className="text-muted-foreground flex-1 min-w-0">
            Opening &quot;{pendingHistoryChat.title}&quot; will close your oldest chat.
          </span>
          <div className="flex gap-1.5 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setPendingHistoryChat(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-6 px-2 text-xs bg-primary text-primary-foreground"
              onClick={openFromHistoryAfterConfirm}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {!hasMessages ? (
        <>
          <div className="border-b border-border shrink-0">
            <div className="flex items-center gap-2 p-3">
              <input
                type="text"
                placeholder="Type to ask any question here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className={CHAT_INPUT_CLASS}
                aria-label="Chat message"
              />
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 shrink-0 text-[#1E7D6A] dark:text-teal-400 hover:text-[#1E7D6A]/90 dark:hover:text-teal-300 disabled:opacity-50"
                disabled={!message.trim()}
                onClick={handleSend}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {referenceSelector}
          <div className="p-3 border-t border-border">
            <VoiceRecorder />
          </div>
          <div className="flex-1 min-h-0 overflow-hidden" aria-hidden />
        </>
      ) : (
        
        <>
          {referenceSelector}
          <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-3">
            {activeMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  msg.role === "user"
                    ? "bg-primary/10 text-primary dark:bg-teal-900/50 dark:text-teal-100 ml-4"
                    : "bg-muted text-foreground dark:bg-gray-800 dark:text-gray-100 mr-4"
                )}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
            <div className="p-3 border-t border-border">
              <VoiceRecorder />
            </div>
          </div>
          {inputRow()}
        </>
      )}
    </aside>
  );
}
