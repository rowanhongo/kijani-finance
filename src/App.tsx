import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ChatPanelProvider } from "@/contexts/ChatPanelContext";
import { MattersProvider } from "@/contexts/MattersContext";

const Index = lazy(() => import("./pages/Index"));
const Matters = lazy(() => import("./pages/Matters"));
const MatterDetail = lazy(() => import("./pages/MatterDetail"));
const Documents = lazy(() => import("./pages/Documents"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Timesheets = lazy(() => import("./pages/Timesheets"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ChatPanelProvider>
          <MattersProvider>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background" aria-live="polite" aria-busy="true">
              <div className="text-muted-foreground text-sm">Loading…</div>
            </div>
          }>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/matters" element={<Matters />} />
            <Route path="/matters/:id" element={<MatterDetail />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/timesheets" element={<Timesheets />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </MattersProvider>
        </ChatPanelProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
