import { LayoutDashboard, Workflow, Settings, PanelLeft, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
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
import logo from "@/assets/favicon.ico";
import { useAuth } from "@/contexts/AuthContext";


const navItems = [
  { title: "Overview", url: "/overview", icon: LayoutDashboard },
  // { title: "Personal", url: "/personal", icon: User },
  { title: "Workflows", url: "/workflows", icon: Workflow },
  // { title: "Templates", url: "/templates", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

export const WorkflowSidebar = () => {
  const { open, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const { logout } = useAuth()
  // style={{objectFit: "contain", width: "100px", border: "rounded"}}
  return (
    <Sidebar collapsible="icon" className="transition-all duration-200 ease-in-out border-r border-sidebar-border">
      <SidebarHeader>
        <div className={`h-12 w-full flex justify-center items-center`}>
          { open 
            ? 
              <div className={`w-full flex justify-between items-center `}>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => navigate('/overview')}
                  aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
                  className={`transition-all duration-700 ease-in-out top-4 h-8 w-8 left-3 rounded-lg bg-sidebar-background shadow-sm hover:bg-primary/20 z-99`}
                >
                  <img src={logo} className="h-8 w-8 p-1" />
                </Button>
                <Button
                  size="icon"
                  onClick={toggleSidebar}
                  className={`transition-all duration-700 ease-in-out transition-transform bg-sidebar-background  hover:bg-primary/20 ${!open ? "opacity-0 scale-105" : "opacity-100 scale-100"}`}
                >
                  <PanelLeft />
                </Button>
              </div>
            : 
            <div>
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleSidebar}
                aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
                className={`transition-all duration-300 ease-in-out top-4 h-8 w-8 left-3 rounded-lg bg-sidebar-background  hover:bg-primary/20 z-99 transition-transform duration-200`}
              >
                <img src={logo} className="h-8 w-8 p-1" />
              </Button>
            </div>
          }
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className=" h-full">
          <SidebarGroupContent className=" h-full">
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
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key={"logout"}>
                  <NavLink 
                    className="flex justify-center w-full"
                    to={"/"}
                  >
                    <Button variant="destructive" className="rounded-lg w-10" size="icon" >
                      <LogOut />
                    </Button>
                  </NavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </ SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
