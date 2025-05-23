import { Link } from "react-router-dom"
import {
    FileText,
    Grid3X3,
    Users,
    UsersRound,
} from "lucide-react"
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
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

const navigationItems = [
    {
        title: "Dashboard",
        url: "/",
        icon: Grid3X3,
        isActive: true,
    },
    {
        title: "Users",
        url: "/users",
        icon: Users,
        badge: "12",
    },
    {
        title: "Groups",
        url: "/groups",
        icon: UsersRound,
        badge: "3",
    },
]



export function AppSidebar() {
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
                            {navigationItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={item.isActive}>
                                        <Link to={item.url} className="flex items-center gap-2">
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                            {item.badge && (
                                                <Badge variant="secondary" className="ml-auto">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
