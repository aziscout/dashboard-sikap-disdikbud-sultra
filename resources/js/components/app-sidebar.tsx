import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen,Brain,CalendarDays,FileText, LayoutGrid, Megaphone, MessagesSquare, Newspaper, Scale, Users } from 'lucide-react';
import AppLogo from './app-logo';
import { NavPangkat } from './nav-pangkat';

// const mainNavPangkat: NavItem[] = [
//     {
//         title: 'Dashboard',
//         href: '/admin/dashboardPangkat',
//         icon: LayoutGrid,
//     },
//     {
//         title: 'Usulan Pangkat',
//         href: '/berita',
//         icon: Newspaper,
//     },
//     {
//         title: 'Pegawai',
//         href: '/laporan',
//         icon: BookOpen ,
//     },
//     {
//         title: 'Riwayat',
//         href: '/ppid',
//         icon: FileText ,
//     },
// ];


export function AppSidebar() {
    type AuthUser = {
    id: number;
    name: string;
    email: string;
    role: string;
  // add other user fields if needed
};

type PageProps = {
  auth: {
    user: AuthUser | null;
    permissions: string[];
  };
};

const { auth } = usePage<PageProps>().props;
    const userPermissions = auth.permissions;
    
    const mainNavItems: NavItem[] = [];

    // if (userPermissions.includes('Dashboard')) {
    //     mainNavItems.push({
    //         title: 'Dashboard',
    //         href: '/dashboard',
    //         icon: LayoutGrid,
    //     });
    // }
    if (userPermissions.includes('Dashboard')) {
        const dashboardLink =
            auth.user?.role === 'admin'
                ? '/admin/dashboard'
                : auth.user?.role === 'bidang'
                ? '/bidang/dashboard'
                : '/dashboard';

        mainNavItems.push({
            title: 'Dashboard',
            href: dashboardLink,
            icon: LayoutGrid,
        });
    }

    if (userPermissions.includes('Bidang')) {
        mainNavItems.push({
            title: 'Bidang',
            href: '/bidang/user',
            icon: Users,
        });
    }

    if (userPermissions.includes('Layanan')) {
        mainNavItems.push({
            title: 'Layanan',
            href: '/layanan',
            icon: MessagesSquare,
        });
    }

    if (userPermissions.includes('Agenda')) {
        mainNavItems.push({
            title: 'Agenda',
            href: '/agenda',
            icon: CalendarDays,
        });
    }
    if (userPermissions.includes('Berita')) {
        mainNavItems.push({
            title: 'Berita',
            href: '/berita',
            icon: Newspaper,
        });
    }
    if (userPermissions.includes('Pengumuman')) {
        mainNavItems.push({
            title: 'Pengumuman',
            href: '/pengumuman',
            icon: Megaphone,
        });
    }
    if (userPermissions.includes('Laporan')) {
        mainNavItems.push({
            title: 'Laporan Kegiatan',
            href: '/laporan',
            icon: BookOpen,
        });
    }
    if (userPermissions.includes('PPID')) {
        mainNavItems.push({
            title: 'PPID',
            href: '/ppid',
            icon: FileText,
        });
    }
    if (userPermissions.includes('Inovasi')) {
        mainNavItems.push({
            title: 'Inovasi',
            href: '/inovasi',
            icon: Brain,
        });
    }
    if (userPermissions.includes('Produk Hukum')) {
        mainNavItems.push({
            title: 'Produk Hukum',
            href: '/produk-hukum',
            icon: Scale,
        });
    }

    const mainNavPangkat: NavItem[] = [];

    if (userPermissions.includes('Dashboard Pangkat')) {
        const dashboardLink =
            auth.user?.role === 'admin'
                ? '/pangkat/dashboard'
                : auth.user?.role === 'bidang'
                ? '/bidang/dashboard'
                : '/dashboard';

        mainNavPangkat.push({
            title: 'Dashboard',
            href: dashboardLink,
            icon: LayoutGrid,
        });
    }

    if (userPermissions.includes('Pegawai')) {
        mainNavPangkat.push({
            title: 'Pegawai',
            href: '/pangkat/pegawai',
            icon: Users,
        });
    }


    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            {/* <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link> */}
                            <Link
                                href={
                                    auth.user?.role === 'admin'
                                        ? '/admin/dashboard'
                                        : auth.user?.role === 'bidang'
                                        ? '/bidang/dashboard'
                                        : '/dashboard'
                                }
                                prefetch
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavPangkat items={mainNavPangkat} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
