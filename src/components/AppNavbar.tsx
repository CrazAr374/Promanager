
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  BellIcon,
  LogOutIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
  Settings as SettingsIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppNavbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="border-b bg-white">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4 mr-4">
          <Link to="/dashboard" className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold text-lg">
              PM
            </div>
            <span className="ml-2 font-semibold text-lg hidden md:block">
              ProjectFlow
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-center">
          <form className="relative w-full max-w-md">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 bg-muted/50 border-none"
            />
          </form>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/projects/new">
            <Button variant="default" size="sm" className="hidden md:flex gap-1">
              <PlusIcon className="h-4 w-4" />
              New Project
            </Button>
            <Button variant="default" size="icon" className="md:hidden">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="bg-primary text-white">
                    <UserIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="w-full cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="w-full cursor-pointer">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
