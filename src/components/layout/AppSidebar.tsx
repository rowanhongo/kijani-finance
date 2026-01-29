import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Scale,
  FileText,
  Calendar,
  Clock,
  Settings,
  type LucideIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Scale, label: "Matters", path: "/matters" },
  { icon: FileText, label: "Documents", path: "/documents" },
  { icon: Calendar, label: "Calendar", path: "/calendar" },
  { icon: Clock, label: "Timesheets", path: "/timesheets" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-12 bg-sidebar flex flex-col shrink-0 border-r border-sidebar-border">
      <nav className="flex flex-col gap-1 py-4 px-2" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === "/" && location.pathname === "/");

          return (
            <Tooltip key={item.path} delayDuration={200}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.path}
                  className={`
                    w-8 h-8 flex items-center justify-center rounded-lg transition-colors
                    ${isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
                    }
                  `}
                  aria-label={item.label}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-popover text-popover-foreground">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </aside>
  );
}
