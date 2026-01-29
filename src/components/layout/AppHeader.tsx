import { useState } from "react";
import { ChevronDown, User, LogOut, Settings, Search as SearchIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SEARCH_SCOPES = [
  { value: "all", label: "All" },
  { value: "matters", label: "Matters" },
  { value: "documents", label: "Documents" },
  { value: "calendar", label: "Calendar" },
  { value: "timesheets", label: "Timesheets" },
] as const;

type SearchScope = (typeof SEARCH_SCOPES)[number]["value"];

export function AppHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchScope, setSearchScope] = useState<SearchScope>("all");

  const scopeLabel = SEARCH_SCOPES.find((s) => s.value === searchScope)?.label ?? "All";

  return (
    <header className="h-12 bg-muted/40 border-b border-border px-4 flex items-center justify-between shrink-0">
      {/* Left: Brand - SHERIA prominent */}
      <div className="flex items-center shrink-0">
        <h1 className="text-xl font-bold text-foreground tracking-tight logo-serif">SHERIA</h1>
      </div>

      {/* Center: Global Search - scope dropdown + input + magnifying glass */}
      <div className="flex-1 flex justify-center min-w-0 px-4">
        <div
          className="flex items-center bg-muted rounded-lg overflow-hidden border border-border max-w-md w-full"
          role="search"
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/80 transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-l-lg"
              aria-label="Search scope"
            >
              {scopeLabel}
              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-popover">
              {SEARCH_SCOPES.map((scope) => (
                <DropdownMenuItem
                  key={scope.value}
                  className="cursor-pointer"
                  onClick={() => setSearchScope(scope.value)}
                >
                  {scope.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground px-3 py-2 text-sm outline-none min-w-0"
            aria-label="Search"
          />
          <span
            className="flex items-center justify-center w-10 h-9 text-muted-foreground shrink-0"
            aria-hidden
          >
            <SearchIcon className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Right: User profile - USER ONE, Paralegal, dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="User menu"
        >
          <Avatar className="w-8 h-8 shrink-0 rounded">
            <AvatarImage src="" alt="" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm rounded">
              UO
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden sm:block shrink-0">
            <p className="text-sm font-medium text-foreground leading-tight">USER ONE</p>
            <p className="text-xs text-muted-foreground leading-tight">Paralegal</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-popover">
          <div className="px-3 py-2 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-accent text-accent-foreground">
                  UO
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">USER ONE</p>
                <p className="text-xs text-muted-foreground">userone@enligne.rw</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-xs text-muted-foreground">ID: 888985925</span>
                </div>
              </div>
            </div>
          </div>
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <User className="w-4 h-4" />
            My Account
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <Settings className="w-4 h-4" />
            Admin Console
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="w-4 h-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
