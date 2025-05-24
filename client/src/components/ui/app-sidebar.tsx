import { Link, useLocation } from "react-router-dom";
import {
    FileText,
    Grid3X3,
    Users,
    UsersRound,
} from "lucide-react";
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
    SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/userStore";
import { useSidebarCounts } from "@/features/dashboard/query";
import { useMemo } from "react";


export function AppSidebar() {
    const location = useLocation();
    const user = useUserStore((state) => state.user);
    const { data, isLoading } = useSidebarCounts();

    const navigationItems = useMemo(() => [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: Grid3X3,
        },
        {
            title: "Users",
            url: "/users",
            icon: Users,
            badge: isLoading ? 0 : data?.userCount?.toString(),
        },
        {
            title: "Groups",
            url: "/groups",
            icon: UsersRound,
            badge: isLoading ? 0 : data?.groupCount?.toString(),
        },
    ], [data])


    return (
        <Sidebar>
            <SidebarHeader className="border-b px-6 py-4">
                <Link to="/" className="flex items-center gap-2 font-semibold">
                    <FileText className="h-6 w-6" />
                    <span>PDF Manager</span>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map((item) => {
                                const isActive = location.pathname.startsWith(item.url);

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link to={item.url} className="flex items-center gap-2 w-full">
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                                {
                                                    item.badge &&
                                                    <Badge variant="secondary" className="ml-auto">
                                                        {item.badge}
                                                    </Badge>
                                                }

                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <span className="text-sm text-center mb-4">{user?.email ?? ""}</span>
            </SidebarFooter>
        </Sidebar>
    );
}
