import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Banknote,
  Wheat,
  Settings,
  type LucideIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

export const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Banknote, label: "Loans", path: "/loans" },
  { icon: Wheat, label: "Stock", path: "/stock" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface SidebarNavContentProps {
  onNavigate?: () => void;
  className?: string;
  /** In sheet: show labels; in aside: icons only with tooltip */
  variant?: "aside" | "sheet";
}

export function SidebarNavContent({ onNavigate, className, variant = "aside" }: SidebarNavContentProps) {
  const location = useLocation();

  const linkContent = (item: NavItem, isActive: boolean) => (
    <>
      <item.icon className="w-5 h-5 shrink-0 md:w-5 md:h-5" />
      {variant === "sheet" && (
        <span className="text-sm font-medium">{item.label}</span>
      )}
    </>
  );

  return (
    <nav className={cn("flex flex-col gap-1 py-4 px-2", variant === "sheet" && "py-6 px-4 gap-2", className)} aria-label="Main navigation">
      {navItems.map((item) => {
        const isActive =
          location.pathname === item.path ||
          (item.path === "/" && location.pathname === "/");

        const linkClass = cn(
          "flex items-center rounded-lg transition-colors min-h-[44px] min-w-[44px] md:min-h-8 md:min-w-8 touch-target",
          variant === "aside"
            ? "w-8 h-8 justify-center md:w-8 md:h-8"
            : "w-full gap-3 px-3 py-3 text-left",
          isActive
            ? "bg-sidebar-accent text-sidebar-foreground"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
        );

        const link = (
          <NavLink
            to={item.path}
            onClick={onNavigate}
            className={linkClass}
            aria-label={item.label}
          >
            {linkContent(item, isActive)}
          </NavLink>
        );

        if (variant === "aside") {
          return (
            <Tooltip key={item.path} delayDuration={200}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right" className="bg-popover text-popover-foreground">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        }
        return <div key={item.path}>{link}</div>;
      })}
    </nav>
  );
}

export function AppSidebar() {
  return (
    <aside className="hidden md:flex w-12 bg-sidebar flex-col shrink-0 border-r border-sidebar-border">
      <SidebarNavContent variant="aside" />
    </aside>
  );
}
