import { useState } from "react";
import { ChevronDown, User, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchScope, setSearchScope] = useState<"all" | "matters">("all");

  return (
    <header className="h-12 bg-muted/40 border-b border-border px-4 flex items-center justify-between shrink-0">
      {/* Left: Brand */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-foreground tracking-tight">SHERIA</h1>
      </div>

      {/* Center: Global Search with scope toggle */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center bg-sidebar rounded-md overflow-hidden">
          <button
            onClick={() => setSearchScope("all")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              searchScope === "all" 
                ? "bg-sidebar-accent text-sidebar-foreground" 
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
            }`}
          >
            All
          </button>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-sidebar text-sidebar-foreground placeholder:text-sidebar-foreground/50 px-3 py-1.5 text-sm w-48 outline-none"
          />
        </div>
      </div>

      {/* Right: User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors outline-none">
          <Avatar className="w-8 h-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-accent text-accent-foreground text-sm">
              UO
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-foreground">USER ONE</p>
            <p className="text-xs text-muted-foreground">Paralegal</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-popover">
          {/* User info header */}
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
