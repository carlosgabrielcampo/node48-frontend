import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { EnvProvider } from "@/contexts/EnvContext";
import { WorkflowEditorProvider } from "@/contexts/WorkflowEditorContext";
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
      <EnvProvider>
        <WorkflowEditorProvider>
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
                  <Route path="/workflows/:id" element={<WorkflowDetail />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </WorkflowEditorProvider>
      </EnvProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
