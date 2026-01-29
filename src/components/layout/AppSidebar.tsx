import { NavLink, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Simple icon components matching the screenshot style
const PenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const CircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <circle cx="12" cy="12" r="6" />
  </svg>
);

const SquareIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <rect x="6" y="6" width="12" height="12" rx="1" />
  </svg>
);

// Sidebar navigation items with simple icons
const navItems = [
  { icon: PenIcon, label: "Home", path: "/" },
  { icon: CircleIcon, label: "Matters", path: "/matters" },
  { icon: SquareIcon, label: "Documents", path: "/documents" },
  { icon: PenIcon, label: "Calendar", path: "/calendar" },
  { icon: CircleIcon, label: "Timesheets", path: "/timesheets" },
  { icon: SquareIcon, label: "Settings", path: "/settings" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-12 bg-sidebar flex flex-col items-center py-6 shrink-0">
      {/* Navigation */}
      <nav className="flex flex-col gap-4 flex-1">
        {navItems.slice(0, 3).map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === "/" && location.pathname === "/");
          
          return (
            <Tooltip key={item.path} delayDuration={100}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.path}
                  className={`
                    w-6 h-6 flex items-center justify-center transition-colors
                    ${isActive 
                      ? "text-sidebar-foreground" 
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
                    }
                  `}
                >
                  <item.icon />
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