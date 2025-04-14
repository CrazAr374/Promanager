
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BarChart3Icon,
  CalendarIcon,
  ClockIcon,
  FolderIcon,
  HomeIcon,
  MenuIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function AppSidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/dashboard' && location.pathname.startsWith(path));
  };
  
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: HomeIcon,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderIcon,
    },
    {
      name: "Time Logs",
      path: "/timelogs",
      icon: ClockIcon,
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: CalendarIcon,
    },
    {
      name: "Team",
      path: "/team",
      icon: UsersIcon,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3Icon,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <SidebarTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                className={cn(
                  isActive(item.path) &&
                    "bg-sidebar-accent text-sidebar-foreground"
                )}
                asChild
              >
                <Link to={item.path}>
                  <item.icon className="h-5 w-5 mr-2" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={cn(
                isActive("/settings") && "bg-sidebar-accent text-sidebar-foreground"
              )}
              asChild
            >
              <Link to="/settings">
                <SettingsIcon className="h-5 w-5 mr-2" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
