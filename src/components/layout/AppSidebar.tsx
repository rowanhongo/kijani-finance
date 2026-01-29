import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Briefcase,
  FileText,
  Calendar,
  Clock,
  Settings,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Sidebar navigation items
const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Briefcase, label: "Matters", path: "/matters" },
  { icon: FileText, label: "Documents", path: "/documents" },
  { icon: Calendar, label: "Calendar", path: "/calendar" },
  { icon: Clock, label: "Timesheets", path: "/timesheets" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-16 bg-sidebar flex flex-col items-center py-4 shrink-0">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center">
          <span className="text-sidebar-foreground font-bold text-lg">S</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === "/" && location.pathname === "/");
          
          return (
            <Tooltip key={item.path} delayDuration={100}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.path}
                  className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                    ${isActive 
                      ? "bg-sidebar-accent text-sidebar-foreground" 
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-foreground text-background">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </aside>
  );
}