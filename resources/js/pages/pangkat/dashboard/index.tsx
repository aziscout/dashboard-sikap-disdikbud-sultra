import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, ArrowUpCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/pangkat/dashboard' },
];

interface Pegawai {
  nama: string;
  jenis_kelamin: string;
  alamat: string;
  tmt_golongan: string;
  golongan_ruang: string;
}

interface PageProps {
  totalPegawai: number;
  totalNaikPangkat: number;
  totalSudahNaikPangkat: number;
  pegawaiNaikPangkat: Pegawai[];
}

export default function Index() {
  const { totalPegawai, totalNaikPangkat, totalSudahNaikPangkat, pegawaiNaikPangkat } =
    usePage().props as unknown as PageProps;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard Pangkat" />

      <div className="flex flex-col gap-6 p-6">

        {/* 🔹 Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Sparkles className="text-indigo-500 dark:text-indigo-400 animate-pulse" />
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
              Dashboard Kenaikan Pangkat
            </span>
          </h1>
        </div>

        {/* 🔹 Statistik Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Pegawai */}
          <Card className="bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-500/20 dark:to-blue-500/10 border border-indigo-200 dark:border-indigo-500/30 shadow-lg hover:shadow-indigo-300/40 dark:hover:shadow-indigo-500/30 transition-all duration-300 rounded-2xl">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-indigo-600 dark:text-indigo-300 uppercase tracking-wide text-sm font-semibold">
                  Total Pegawai
                </h2>
                <p className="text-4xl font-extrabold mt-1">{totalPegawai}</p>
              </div>
              <div className="bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-full">
                <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-300" />
              </div>
            </CardContent>
          </Card>

          {/* Siap Naik Pangkat */}
          <Card className="bg-gradient-to-br from-pink-100 to-orange-50 dark:from-pink-500/20 dark:to-orange-500/10 border border-pink-200 dark:border-pink-500/30 shadow-lg hover:shadow-pink-300/40 dark:hover:shadow-pink-500/30 transition-all duration-300 rounded-2xl">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-pink-600 dark:text-pink-300 uppercase tracking-wide text-sm font-semibold">
                  Siap Naik Pangkat
                </h2>
                <p className="text-4xl font-extrabold mt-1">{totalNaikPangkat}</p>
              </div>
              <div className="bg-pink-100 dark:bg-pink-500/20 p-3 rounded-full">
                <ArrowUpCircle className="w-8 h-8 text-pink-600 dark:text-pink-300" />
              </div>
            </CardContent>
          </Card>

          {/* Sudah Naik Pangkat */}
          <Card className="bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-500/20 dark:to-teal-500/10 border border-emerald-200 dark:border-emerald-500/30 shadow-lg hover:shadow-emerald-300/40 dark:hover:shadow-emerald-500/30 transition-all duration-300 rounded-2xl">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-emerald-600 dark:text-emerald-300 uppercase tracking-wide text-sm font-semibold">
                  Sudah Naik Pangkat Tahun {new Date().getFullYear()}
                </h2>
                <p className="text-4xl font-extrabold mt-1">{totalSudahNaikPangkat}</p>
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-500/20 p-3 rounded-full">
                <ArrowUpCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 🔹 Table Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Daftar Kenaikan Pangkat Pegawai Tahun Ini
          </h2>
          <Link href={route('pegawai.index')}>
            <Button className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-md transition-all">
              Lihat Semua
            </Button>
          </Link>
        </div>

        {/* 🔹 Table Section */}
        <div className="overflow-hidden rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-md backdrop-blur-md transition-all">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-indigo-100/40 dark:bg-indigo-900/40">
                <TableHead className="w-[60px] text-center">No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Golongan</TableHead>
                <TableHead>Jenis Kelamin</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>TMT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pegawaiNaikPangkat.length > 0 ? (
                pegawaiNaikPangkat.map((p, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/40 transition-all"
                  >
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="font-medium">{p.nama}</TableCell>
                    <TableCell>{p.golongan_ruang}</TableCell>
                    <TableCell className="capitalize">{p.jenis_kelamin}</TableCell>
                    <TableCell className="capitalize">{p.alamat}</TableCell>
                    <TableCell>{p.tmt_golongan}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 dark:text-gray-400 py-6"
                  >
                    Tidak ada pegawai yang naik pangkat tahun ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
