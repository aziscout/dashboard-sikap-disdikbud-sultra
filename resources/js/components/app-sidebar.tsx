import { Link, usePage } from "@inertiajs/react"
import {
    Archive,
    Award,
    ChartNoAxesCombined,
    FilePlus,
    LayoutGrid,
    TrendingUp,
    Users,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarFooter,
    SidebarRail,
} from "@/components/ui/sidebar"

import AppLogo from "./app-logo"
import { NavUser } from "@/components/nav-user"

type AuthUser = {
    id: number
    name: string
    email: string
    role: string
}

type PageProps = {
    auth: {
        user: AuthUser | null
        permissions: string[]
    }
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const page = usePage()
    const { auth } = usePage<PageProps>().props

    const permissions = auth.permissions
    const role = auth.user?.role

    const dashboardLink =
        role === "admin_sikap"
        ? "/pangkat/dashboard"
        : role === "bidang"
        ? "/bidang/dashboard"
        : "/dashboard"

    
    const isActive = (href: string) =>
        page.url === href || page.url.startsWith(href + "/")

    return (
        <Sidebar collapsible="icon" variant="inset" {...props}>
        
        <SidebarHeader>
            <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                size="lg"
                asChild
                >
                <Link href={dashboardLink}>
                    <AppLogo />
                </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <SidebarGroup>
            <SidebarMenu>

                {permissions.includes("Dashboard Pangkat") && (
                <SidebarMenuItem>
                    <SidebarMenuButton
                    asChild
                    isActive={isActive(dashboardLink)}
                    >
                    <Link href={dashboardLink}>
                        <LayoutGrid className="size-4" />
                        <span>Beranda</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                )}

                {permissions.includes("Pegawai") && (
                <SidebarMenuItem>
                    <SidebarMenuButton
                    asChild
                    isActive={isActive("/pangkat/pegawai")}
                    >
                    <Link href="/pangkat/pegawai">
                        <Users className="size-4" />
                        <span>Pegawai</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                )}

                {permissions.includes("Kenaikan Pangkat") && (() => {
                const active =
                    isActive("/pangkat/usulan-pangkat") ||
                    isActive("/pangkat/arsip-pangkat")

                return (
                    <SidebarMenuItem>
                    <SidebarMenuButton isActive={active}>
                        <ChartNoAxesCombined className="size-4" />
                        <span>Kenaikan Pangkat</span>
                    </SidebarMenuButton>

                    <SidebarMenuSub>
                        <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                            asChild
                            isActive={isActive("/pangkat/usulan-pangkat")}
                        >
                            <Link href="/pangkat/usulan-pangkat">
                            <FilePlus className="size-4" />
                            <span>Usulan Pangkat</span>
                            </Link>
                        </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                            asChild
                            isActive={isActive("/pangkat/arsip-pangkat")}
                        >
                            <Link href="/pangkat/arsip-pangkat">
                            <Archive className="size-4" />
                            <span>Arsip Pangkat</span>
                            </Link>
                        </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    </SidebarMenuSub>
                    </SidebarMenuItem>
                )
                })()}

                {permissions.includes("Kenaikan Gaji Berkala") && (() => {
                const active =
                    isActive("/pangkat/usulan-kgb") ||
                    isActive("/pangkat/arsip-kgb")

                return (
                    <SidebarMenuItem>
                    <SidebarMenuButton isActive={active}>
                        <TrendingUp className="size-4" />
                        <span>Kenaikan Gaji Berkala</span>
                    </SidebarMenuButton>

                    <SidebarMenuSub>
                        <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                            asChild
                            isActive={isActive("/pangkat/usulan-kgb")}
                        >
                            <Link href="/pangkat/usulan-kgb">
                            <FilePlus className="size-4" />
                            <span>Usulan KGB</span>
                            </Link>
                        </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                            asChild
                            isActive={isActive("/pangkat/arsip-kgb")}
                        >
                            <Link href="/pangkat/arsip-kgb">
                            <Archive className="size-4" />
                            <span>Arsip KGB</span>
                            </Link>
                        </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    </SidebarMenuSub>
                    </SidebarMenuItem>
                )
                })()}

                {permissions.includes("Pensiun") && (
                <SidebarMenuItem>
                    <SidebarMenuButton
                    asChild
                    isActive={isActive("/pangkat/pensiun")}
                    >
                    <Link href="/pangkat/pensiun">
                        <Award className="size-4" />
                        <span>Pensiun</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                )}

            </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
            <NavUser />
        </SidebarFooter>

        <SidebarRail />
        </Sidebar>
    )
}
