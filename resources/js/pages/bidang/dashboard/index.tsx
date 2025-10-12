import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { WelcomeSection } from '@/components/WelcomeSection';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import { CheckCircle, FileText, Folder } from 'lucide-react';

interface MediaItem {
    file: string;
    type: string;
}

interface DashboardData {
    totalLayanan: number;
    totalLayananAktif: number;
    totalLaporanKegiatan: number;
}

interface PageProps extends InertiaPageProps {
    logo?: MediaItem;
    heroes?: MediaItem[];
    flash: { success?: string; error?: string };
    data: DashboardData;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard Bidang', href: '/bidang/dashboard' }];

export default function Dashboard() {
    const { flash, data } = usePage<PageProps>().props;
  console.log('ini data',data);
  
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Bidang" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Flash Message */}
                {flash?.success && (
                    <Alert className="border-green-500 bg-green-50 dark:bg-green-900/30">
                        <AlertTitle className="font-semibold text-green-700 dark:text-green-300">Berhasil!</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}
                {flash?.error && (
                    <Alert className="border-red-500 bg-red-50 dark:bg-red-900/30">
                        <AlertTitle className="font-semibold text-red-700 dark:text-red-300">Terjadi Kesalahan</AlertTitle>
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}
                <WelcomeSection />

                {/* Statistik Kartu */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Total Layanan */}
                    <div className="flex items-center justify-between rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm transition hover:shadow-md dark:border-blue-800 dark:from-blue-900/30 dark:to-indigo-900/20">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Layanan</p>
                            <h2 className="mt-1 text-3xl font-bold text-blue-700 dark:text-blue-400">{data.totalLayanan}</h2>
                            <p className="mt-1 text-xs text-muted-foreground">Jumlah seluruh layanan terdaftar</p>
                        </div>
                        <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-800/40">
                            <Folder className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                        </div>
                    </div>

                    {/* Total Layanan Aktif */}
                    <div className="flex items-center justify-between rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-sm transition hover:shadow-md dark:border-green-800 dark:from-green-900/30 dark:to-emerald-900/20">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Layanan Aktif</p>
                            <h2 className="mt-1 text-3xl font-bold text-green-700 dark:text-green-400">{data.totalLayananAktif}</h2>
                            <p className="mt-1 text-xs text-muted-foreground">Layanan yang masih berjalan</p>
                        </div>
                        <div className="rounded-full bg-green-100 p-3 dark:bg-green-800/40">
                            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                    </div>

                    {/* Total Laporan Kegiatan */}
                    <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm transition hover:shadow-md dark:border-amber-800 dark:from-amber-900/30 dark:to-orange-900/20">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground"> Laporan Kegiatan</p>
                            <h2 className="mt-1 text-3xl font-bold text-amber-700 dark:text-amber-400">{data.totalLaporanKegiatan}</h2>
                            <p className="mt-1 text-xs text-muted-foreground">Jumlah laporan kegiatan bidang</p>
                        </div>
                        <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-800/40">
                            <FileText className="h-6 w-6 text-amber-600 dark:text-amber-300" />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
