import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, ArrowUpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/pangkat/dashboard',
  }
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
  pegawaiNaikPangkat: Pegawai[];
}

export default function Dashboard() {
  const { totalPegawai, totalNaikPangkat, pegawaiNaikPangkat } =
    usePage().props as unknown as PageProps;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard Pangkat" />

      <div className="flex flex-col gap-6 p-4">

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-indigo-50">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-gray-700 font-semibold">Total Pegawai</h2>
                <p className="text-4xl font-bold">{totalPegawai}</p>
              </div>
              <Users className="text-indigo-500 w-10 h-10" />
            </CardContent>
          </Card>

          <Card className="bg-pink-50">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-gray-700 font-semibold">Total Naik Pangkat</h2>
                <p className="text-4xl font-bold">{totalNaikPangkat}</p>
              </div>
              <ArrowUpCircle className="text-pink-500 w-10 h-10" />
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">100%</p>
                <p className="text-sm text-gray-600">Kinerja Kenaikan Pangkat</p>
              </div>
            </CardContent>
          </Card>
        </div>

            <div className="flex justify-between items-center ">
              <h2 className="text-lg font-semibold">
                Daftar Kenaikan Pangkat Pegawai Tahun Ini
              </h2>
              <Link href={route('pegawai.index')}>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Lihat Semua
                </Button>
              </Link>
            </div>

            <div className="overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Nama</TableHead>
                    <TableHead>Golongan</TableHead>
                    <TableHead>Jenis Kelamin</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>TMT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pegawaiNaikPangkat.length > 0 ? (
                    pegawaiNaikPangkat.map((p, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{p.nama}</TableCell>
                        <TableCell>{p.golongan_ruang}</TableCell>
                        <TableCell>{p.jenis_kelamin}</TableCell>
                        <TableCell>{p.alamat}</TableCell>
                        <TableCell>{p.tmt_golongan}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-6 text-gray-500"
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
