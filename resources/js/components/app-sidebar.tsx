import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {Megaphone, CalendarDays,BookOpen, Brain, FileText, LayoutGrid, MessagesSquare, Newspaper, Scale } from 'lucide-react';
import AppLogo from './app-logo';

// const mainNavItems: NavItem[] = [
//     {
//         title: 'Dashboard',
//         href: '/dashboard',
//         icon: LayoutGrid,
//     },
//     {
//         title: 'Layanan',
//         href: '/layanan',
//         icon: MessagesSquare,
//     },
//     {
//         title: 'Agenda',
//         href: '/agenda',
//         icon: CalendarDays,
//     },
//     {
//         title: 'Berita',
//         href: '/berita',
//         icon: Newspaper,
//     },
//     {
//         title: 'Pengumuman',
//         href: '/pengumuman',
//         icon: Megaphone,
//     },
//     {
//         title: 'Laporan Kegiatan',
//         href: '/laporan-kegiatan',
//         icon: BookOpen,
//     },
//     {
//         title: 'PPID',
//         href: '/ppid',
//         icon: FileText,
//     },
//     {
//         title: 'Inovasi',
//         href: '/inovasi',
//         icon: Brain,
//     },
//     {
//         title: 'Produk Hukum',
//         href: '/produk-hukum',
//         icon: Scale,
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

    if (userPermissions.includes('Dashboard')) {
        mainNavItems.push({
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
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
    if (userPermissions.includes('Laporan Kegiatan')) {
        mainNavItems.push({
            title: 'Laporan Kegiatan',
            href: '/laporan-kegiatan',
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

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
