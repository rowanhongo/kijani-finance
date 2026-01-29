import { createContext, useCallback, useContext, useState } from "react";

const CHAT_MINIMIZED_KEY = "sheria-chat-minimized";

interface ChatPanelContextValue {
  isMinimized: boolean;
  setIsMinimized: (value: boolean) => void;
}

const ChatPanelContext = createContext<ChatPanelContextValue | null>(null);

export const ChatPanelProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMinimized, setMinimizedState] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(CHAT_MINIMIZED_KEY);
      if (raw === null) return false;
      return raw === "true";
    } catch {
      return false;
    }
  });

  const setIsMinimized = useCallback((value: boolean) => {
    setMinimizedState(value);
    try {
      localStorage.setItem(CHAT_MINIMIZED_KEY, String(value));
    } catch {
      // ignore
    }
  }, []);

  return (
    <ChatPanelContext.Provider value={{ isMinimized, setIsMinimized }}>
      {children}
    </ChatPanelContext.Provider>
  );
};

export const useChatPanel = (): ChatPanelContextValue => {
  const ctx = useContext(ChatPanelContext);
  if (!ctx) throw new Error("useChatPanel must be used within ChatPanelProvider");
  return ctx;
};
