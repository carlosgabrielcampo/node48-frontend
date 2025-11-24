import { LayoutDashboard, User, FileText, ChevronLeft, ChevronRight, Workflow } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
];

export const WorkflowSidebar = () => {
  const { open, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="transition-all duration-200 ease-in-out border-r border-sidebar-border">
      <SidebarContent className="relative">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
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
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="absolute top-1/2 -right-3 -translate-y-1/2 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar-background shadow-sm hover:bg-sidebar-accent z-99 transition-transform duration-200"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? (
            <ChevronLeft className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>
    </Sidebar>
  );
};
