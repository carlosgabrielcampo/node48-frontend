import { LayoutDashboard, User, FileText, ChevronLeft, ChevronRight, Workflow, Settings, PanelLeft } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
const navItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Personal", url: "/personal", icon: User },
  { title: "Workflows", url: "/workflows", icon: Workflow },
  { title: "Templates", url: "/templates", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

export const WorkflowSidebar = () => {
  const { open, toggleSidebar } = useSidebar();
// style={{objectFit: "contain", width: "100px", border: "rounded"}}
  return (
    <Sidebar collapsible="icon" className="transition-all duration-200 ease-in-out border-r border-sidebar-border">
      <SidebarHeader>
        <div className={`h-8 w-full flex justify-center items-center`}>
          { open 
            ? 
              <div className={`w-full flex justify-between items-center`}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className={`
                    transition-all duration-700 ease-in-out
                    top-4 h-8 w-8 left-3 rounded-lg border-sidebar-border bg-sidebar-background shadow-sm hover:bg-primary/20 z-99 
                  `}
                  aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
                >
                  <img
                    src="/favicon.ico"
                    className="h-8 w-8 p-1"
                    />
                </Button>
                <Button
                  onClick={toggleSidebar}
                  className={`transition-all duration-700 ease-in-out transition-transform 
                    bg-sidebar-background text-sidebar-accent-foreground hover:bg-primary/20 ${!open ? "opacity-0 scale-105" : "opacity-100 scale-100"}`}
                >
                  <PanelLeft className="absolute w-10"/>
                </Button>
              </div>
            : 
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className={`
                  transition-all duration-300 ease-in-out
                  top-4 h-8 w-8 left-3 rounded-lg border-sidebar-border bg-sidebar-background shadow-sm hover:bg-primary/20 z-99 transition-transform duration-200
                `}
                 aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
                >
                <img
                  src="/favicon.ico"
                  className="h-8 w-8 p-1"
                  />
              </Button>
              </div>
          }
        </div>
      </SidebarHeader>
      <SidebarContent className="relative">
        <SidebarGroup>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground w-full"
                          : ""
                      }
                    >
                      <item.icon className="h-4 w-4 " />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Centered Toggle Button */}
      </SidebarContent>
    </Sidebar>
  );
};
