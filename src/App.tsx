import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { EnvProvider } from "@/contexts/EnvContext";
import { WorkflowEditorProvider } from "@/contexts/WorkflowEditorContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import WorkflowsPage from "./pages/Workflows";
import WorkflowDetail from "./pages/WorkflowDetail";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { SidebarProvider } from "./components/ui/sidebar";

const queryClient = new QueryClient();

const SidebarLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <Outlet />
    </SidebarProvider>
  );
};

const ProtectedRoutes : React.FC = () => {
    return (
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    )
};



const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <EnvProvider>
          <WorkflowEditorProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  {/* Protected routes */}
                  <Route element={<SidebarLayout />}>
                    <Route element={<ProtectedRoutes />} >
                      <Route path="/templates" element={<Index />} />
                      <Route path="/personal" element={<Index />} />
                      <Route path="/projects" element={<Index />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/workflows/:id" element={<WorkflowDetail />} />
                      <Route path="/workflows" element={<WorkflowsPage />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </WorkflowEditorProvider>
        </EnvProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
