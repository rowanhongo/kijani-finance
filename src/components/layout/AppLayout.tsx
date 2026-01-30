import { ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { AIChatPanel } from "./AIChatPanel";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarNavContent } from "./AppSidebar";

interface AppLayoutProps {
  children: ReactNode;
  showRibbon?: ReactNode;
}

export function AppLayout({ children, showRibbon }: AppLayoutProps) {
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const getAIContext = () => {
    if (location.pathname.startsWith("/matters")) return "Current Matter";
    if (location.pathname.startsWith("/documents")) return "Documents";
    if (location.pathname.startsWith("/sources")) return "My Sources";
    return "My Sources";
  };

  return (
    <div className="min-h-screen flex w-full bg-background min-w-0">
      <AppSidebar />

      {/* Mobile nav sheet */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent
          side="left"
          className="w-[min(280px,85vw)] max-w-[280px] p-0 bg-sidebar border-sidebar-border border-r"
        >
          <div className="pt-4 pb-6">
            <SidebarNavContent
              variant="sheet"
              onNavigate={() => setMobileNavOpen(false)}
              className="text-sidebar-foreground"
            />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <AppHeader onMenuClick={() => setMobileNavOpen(true)} />

        {showRibbon}

        <div className="flex-1 flex min-h-0 min-w-0">
          <main className="flex-1 overflow-auto p-4 sm:p-6 min-w-0 w-full">
            {children}
          </main>
          <AIChatPanel context={getAIContext()} />
        </div>
      </div>
    </div>
  );
}