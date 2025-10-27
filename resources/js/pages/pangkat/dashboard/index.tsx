import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
import { Users, ArrowUpCircle } from 'lucide-react';

interface Pegawai {
  nama: string;
  jenis_kelamin: string;
  alamat: string;
  tmt_golongan: string;
}

interface PageProps {
  totalPegawai: number;
  totalNaikPangkat: number;
  pegawaiNaikPangkat: Pegawai[];
}

export default function Dashboard() {
  const { totalPegawai, totalNaikPangkat, pegawaiNaikPangkat } = usePage().props as unknown as PageProps;

  return (
    <AppLayout>
      <Head title="Dashboard Pangkat" />

      <div className="flex flex-col gap-6 p-4">
        <h1 className="text-2xl font-semibold">Dashboard Kenaikan Pangkat</h1>

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

        {/* Daftar Pegawai Naik Pangkat */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Daftar Kenaikan Pangkat Pegawai Tahun Ini</h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border p-2 text-left">Nama</th>
                <th className="border p-2 text-left">Jenis Kelamin</th>
                <th className="border p-2 text-left">Alamat</th>
                <th className="border p-2 text-left">TMT</th>
              </tr>
            </thead>
            <tbody>
              {pegawaiNaikPangkat.length > 0 ? (
                pegawaiNaikPangkat.map((p, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border p-2">{p.nama}</td>
                    <td className="border p-2">{p.jenis_kelamin}</td>
                    <td className="border p-2">{p.alamat}</td>
                    <td className="border p-2">{p.tmt_golongan}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    Tidak ada pegawai yang naik pangkat tahun ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* <div className="mt-4 text-center">
            <Link href={route('pangkat.usulanPangkat.index')}>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Lihat Semua</Button>
            </Link>
          </div> */}
        </div>
      </div>
    </AppLayout>
  );
}
