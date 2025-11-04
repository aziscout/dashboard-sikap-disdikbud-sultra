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
  totalSudahNaikPangkat: number;
  pegawaiNaikPangkat: Pegawai[];
}

export default function Dashboard() {
  const { totalPegawai, totalNaikPangkat, totalSudahNaikPangkat, pegawaiNaikPangkat } =
    usePage().props as unknown as PageProps;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard Pangkat" />

      <div className="flex flex-col gap-6 p-4">

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="bg-gradient-to-br from-indigo-500 via-sky-500 to-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 border border-white/20 rounded-2xl">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-indigo-100 uppercase tracking-wide text-sm">Total Pegawai</h2>
                <p className="text-4xl font-extrabold mt-1 drop-shadow-md">{totalPegawai}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-md">
                <Users className="w-8 h-8 text-white" />
              </div>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="bg-gradient-to-br from-pink-500 via-rose-400 to-orange-400 text-white shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 border border-white/20 rounded-2xl">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-pink-100 uppercase tracking-wide text-sm">Siap Naik Pangkat</h2>
                <p className="text-4xl font-extrabold mt-1 drop-shadow-md">{totalNaikPangkat}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-md">
                <ArrowUpCircle className="w-8 h-8 text-white" />
              </div>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 border border-white/20 rounded-2xl">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-emerald-100 uppercase tracking-wide text-sm">
                  Sudah Naik Pangkat Tahun {new Date().getFullYear()}
                </h2>
                <p className="text-4xl font-extrabold mt-1 drop-shadow-md">
                  {totalSudahNaikPangkat}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-md">
                <ArrowUpCircle className="w-8 h-8 text-white" />
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
                  <TableRow key={index}>
                    <TableCell className="font-medium">{p.nama}</TableCell>
                    <TableCell>{p.golongan_ruang}</TableCell>
                    <TableCell className='capitalize'>{p.jenis_kelamin}</TableCell>
                    <TableCell className='capitalize'>{p.alamat}</TableCell>
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
