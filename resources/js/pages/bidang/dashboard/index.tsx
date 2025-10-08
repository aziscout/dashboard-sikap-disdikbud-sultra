import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Folder, CheckCircle, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';

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

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard Bidang', href: '/bidang/dashboard' },
];

export default function Dashboard() {
  const { flash, data } = usePage<PageProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard Bidang" />

      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
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

        {/* Statistik Kartu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Layanan */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 flex justify-between items-center shadow-sm hover:shadow-md transition">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Layanan</p>
              <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mt-1">{data.totalLayanan}</h2>
              <p className="text-xs text-muted-foreground mt-1">Jumlah seluruh layanan terdaftar</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-800/40">
              <Folder className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>

          {/* Total Layanan Aktif */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 flex justify-between items-center shadow-sm hover:shadow-md transition">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Layanan Aktif</p>
              <h2 className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{data.totalLayananAktif}</h2>
              <p className="text-xs text-muted-foreground mt-1">Layanan yang masih berjalan</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-800/40">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>

          {/* Total Laporan Kegiatan */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 flex justify-between items-center shadow-sm hover:shadow-md transition">
            <div>
              <p className="text-sm text-muted-foreground font-medium"> Laporan Kegiatan</p>
              <h2 className="text-3xl font-bold text-amber-700 dark:text-amber-400 mt-1">{data.totalLaporanKegiatan}</h2>
              <p className="text-xs text-muted-foreground mt-1">Jumlah laporan kegiatan bidang</p>
            </div>
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-800/40">
              <FileText className="w-6 h-6 text-amber-600 dark:text-amber-300" />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
