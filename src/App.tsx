import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ChatPanelProvider } from "@/contexts/ChatPanelContext";
import { LoansProvider } from "@/contexts/LoansContext";

const Index = lazy(() => import("./pages/Index"));
const Loans = lazy(() => import("./pages/Loans"));
const LoanDetail = lazy(() => import("./pages/LoanDetail"));
const Stock = lazy(() => import("./pages/Stock"));
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
          <LoansProvider>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background" aria-live="polite" aria-busy="true">
              <div className="text-muted-foreground text-sm">Loading…</div>
            </div>
          }>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/loans/:id" element={<LoanDetail />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </LoansProvider>
        </ChatPanelProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
