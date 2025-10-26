import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Megaphone, Plus, SquarePen } from 'lucide-react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface MediaItem {
    file: string;
    type: string;
}

interface PageProps extends InertiaPageProps {
    logo?: MediaItem;
    heroes?: MediaItem[];
    flash: { success?: string; error?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { 
        title: 'Dashboard', 
        href: '/dashboard' 
    },
];

export default function Dashboard() {
    const { logo, flash, heroes = [] } = usePage<PageProps>().props;

    const hasData = logo || heroes.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h1>Ini Dashboard Sikepang</h1>
            </div>
        </AppLayout>
    );
}
