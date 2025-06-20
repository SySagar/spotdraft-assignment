"use client";

import { useCallback, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    clearUser();
    localStorage.removeItem("user");
    localStorage.removeItem("user-storage");
    localStorage.removeItem("accessToken");
    navigate("/login");
  }, [clearUser, navigate])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary"
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                to="/users"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary"
                onClick={() => setOpen(false)}
              >
                <Home className="h-5 w-5" />
                Users
              </Link>
            </nav>
            <div className="mt-auto">
              <div className="flex items-center gap-2 pt-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="grid gap-0.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <FileText className="h-6 w-6" />
          <span>PDF Collab</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                {user?.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/" className="flex cursor-pointer items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/login"
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarProvider>
    </div >
  );
}
