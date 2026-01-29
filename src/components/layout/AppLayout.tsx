import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { AIChatPanel } from "./AIChatPanel";

interface AppLayoutProps {
  children: ReactNode;
  showRibbon?: ReactNode;
}

export function AppLayout({ children, showRibbon }: AppLayoutProps) {
  const location = useLocation();
  
  // Determine context for AI chat based on current page
  const getAIContext = () => {
    if (location.pathname.startsWith("/matters")) return "Current Matter";
    if (location.pathname.startsWith("/documents")) return "Documents";
    if (location.pathname.startsWith("/sources")) return "My Sources";
    return "My Sources";
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left sidebar - always visible */}
      <AppSidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <AppHeader />

        {/* Optional ribbon (for Home context) */}
        {showRibbon}

        {/* Content area with AI chat */}
        <div className="flex-1 flex min-h-0">
          {/* Main canvas */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>

          {/* AI Chat panel - persistent */}
          <AIChatPanel context={getAIContext()} />
        </div>
      </div>
    </div>
  );
}