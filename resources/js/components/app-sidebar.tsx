// import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type MainNavItem, NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Archive, Award, ChartNoAxesCombined, FilePlus, LayoutGrid, TrendingUp, Users } from 'lucide-react';
import AppLogo from './app-logo';
import { NavPangkat } from './nav-pangkat';
import { NavMain } from './nav-main';

export function     AppSidebar() {
    type AuthUser = {
    id: number;
    name: string;
    email: string;
    role: string;
};

type PageProps = {
    auth: {
        user: AuthUser | null;
        permissions: string[];
    };
};

const { auth } = usePage<PageProps>().props;
    const userPermissions = auth.permissions;

    const NavItem: NavItem[] = [];
    const mainNavPangkat: MainNavItem[] = [];

    if (userPermissions.includes('Dashboard Pangkat')) {
        const dashboardLink =
            auth.user?.role === 'admin_sikap'
                ? '/pangkat/dashboard'
                : auth.user?.role === 'bidang'
                ? '/bidang/dashboard'
                : '/dashboard';

        NavItem.push({
            title: 'Beranda',
            href: dashboardLink,
            icon: LayoutGrid,
        });
    }

    
    if (userPermissions.includes('Pegawai')) {
        NavItem.push({
            title: 'Pegawai',
            href: '/pangkat/pegawai',
            icon: Users,
        });
    }
    
    if (userPermissions.includes('Kenaikan Pangkat')) {
        mainNavPangkat.push({
            title: 'Kenaikan Pangkat',
            icon: ChartNoAxesCombined,
            subItems: [
                {
                    title: 'Usulan Pangkat',
                    href: '/pangkat/usulan-pangkat',
                    icon: FilePlus
                },
                {
                    title: 'Arsip Pangkat',
                    href: '/pangkat/arsip-pangkat',
                    icon: Archive
                }
            ]
        });
    }
    
    if (userPermissions.includes('Berkala')) {
        mainNavPangkat.push({
            title: 'Kenaikan Gaji Berkala',
            icon: TrendingUp,
            subItems: [
                {
                    title: 'Usulan KGB',
                    href: '/pangkat/usulan-kgb',
                    icon: FilePlus
                },
                {
                    title: 'Arsip KGB',
                    href: '/pangkat/arsip-kgb',
                    icon: Archive
                }
            ]
        });
    }

    if (userPermissions.includes('Pensiun')) {
        mainNavPangkat.push({
            title: 'Pensiun',
            icon: Award,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/pangkat/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={NavItem} />
                <NavPangkat items={mainNavPangkat} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
