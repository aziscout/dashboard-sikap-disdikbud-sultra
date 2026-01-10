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
        title: 'Dashboard Website', 
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
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold">Logo & Hero Section</h1>

                    {!hasData ? (
                        <Link href={route('admin.dashboard.create')}>
                            <Button>
                                <Plus /> Tambah
                            </Button>
                        </Link>  
                    ) : (
                        <Link href={route('admin.dashboard.edit')}>
                            <Button variant="default">
                                <SquarePen /> Ubah
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="w-full md:w-1/2 px-4">
                    {(flash.success || flash.error) && (
                        <Alert variant={flash.error ? "destructive" : "default"}>
                            <Megaphone className="h-4 w-4" />
                            <AlertTitle>
                            {flash.error ? "Terjadi Kesalahan!" : "Berhasil!"}
                            </AlertTitle>
                            <AlertDescription>
                            {flash.error || flash.success}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* === LOGO === */}
                    <div className="border rounded-xl p-4 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-lg">Logo</h2>
                        </div>
                        <div className="flex flex-col items-center justify-center flex-1">
                            {logo ? (
                                <img
                                    src={`/storage/${logo.file}`}
                                    alt="Logo"
                                    className="h-60 object-contain"
                                />
                            ) : (
                                <div className="flex justify-center text-gray-500 border rounded p-8 w-full">
                                    Belum ada logo diupload
                                </div>
                            )}
                        </div>
                    </div>

                    {/* === HERO === */}
                    <div className="border rounded-xl p-4 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-lg">Hero Section</h2>
                        </div>
                        {heroes.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {heroes.map((hero, index) => (
                                    <div
                                        key={index}
                                        className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border"
                                    >
                                        <img
                                            src={`/storage/${hero.file}`}
                                            alt={`Hero ${index + 1}`}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex justify-center text-gray-500 border rounded p-8">
                                Belum ada hero diupload
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
