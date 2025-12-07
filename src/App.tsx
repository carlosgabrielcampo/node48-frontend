import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Workflows from "./pages/Workflows";
import WorkflowDetail from "./pages/WorkflowDetail";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { SidebarProvider } from "./components/ui/sidebar";

const queryClient = new QueryClient();
const SidebarLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <Outlet />
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<SidebarLayout />}>
              <Route path="/" element={<Workflows />} />
              <Route path="/templates" element={<Index />} />
              <Route path="/workflows" element={<Workflows />} />
              <Route path="/personal" element={<Index />} />
              <Route path="/projects" element={<Index />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route>
              <Route path="/workflows/:id" element={<WorkflowDetail />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
