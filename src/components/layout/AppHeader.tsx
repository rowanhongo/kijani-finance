import { useState } from "react";
import { Search, ChevronDown, User, LogOut, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
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

  return (
    <header className="h-14 bg-card border-b border-border px-4 flex items-center justify-between shrink-0">
      {/* Left: Brand */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-primary tracking-tight">SHERIA</h1>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search cases, documents, contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Right: User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors outline-none">
          <Avatar className="w-8 h-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              RH
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium">Rowan Hongo</p>
            <p className="text-xs text-muted-foreground">Paralegal</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-popover">
          {/* User info header */}
          <div className="px-3 py-2 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  RH
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Rowan Hongo</p>
                <p className="text-xs text-muted-foreground">rowanhongo@enligne.rw</p>
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