import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Download } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Pegawai', href: '/pangkat/pegawai' },
  { title: 'Detail Pegawai', href: '#' },
];

interface DataDiri {
  golongan: string;
  jenis_kp: string;
  masa_kerja_tahun: number;
  masa_kerja_bulan: number;
  tmt_golongan: string;
  nomor_sk: string;
  tanggal_sk: string;
  nomor_pertek_bkn: string;
  tanggal_pertek_bkn: string;
}

interface Berkas {
  id: number;
  sk_cpns?: string;
  sk_pns?: string;
  sk_gaji_berkala?: string;
  sk_pangkat_terakhir?: string;
  sk_jabatan?: string;
  file_sk?: string;
  created_at: string;
}

interface Pegawai {
  id: number;
  nama: string;
}

interface PageProps {
  pegawai: Pegawai;
  data_diri: DataDiri;
  berkas: Berkas[];
}

export default function Show() {
  const { pegawai, data_diri, berkas } = usePage().props as unknown as PageProps;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Detail Pegawai - ${pegawai.nama}`} />

      <div className="max-w-5xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          {/* <Link href={route('pangkat.pegawai')}> */}
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </Button>
          {/* </Link> */}

          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Cek Status
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Detail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
              <p>Golongan <span className="ml-2">: {data_diri?.golongan || '-'}</span></p>
              <p>Jenis Kenaikan Pangkat (KP) <span className="ml-2">: {data_diri?.jenis_kp || '-'}</span></p>
              <p>Masa Kerja Golongan (Tahun) <span className="ml-2">: {data_diri?.masa_kerja_tahun || '-'}</span></p>
              <p>Masa Kerja Golongan (Bulan) <span className="ml-2">: {data_diri?.masa_kerja_bulan || '-'}</span></p>
              <p>TMT Golongan <span className="ml-2">: {data_diri?.tmt_golongan || '-'}</span></p>
              <p>Nomor Surat Keputusan (SK) <span className="ml-2">: {data_diri?.nomor_sk || '-'}</span></p>
              <p>Tanggal Surat Keputusan (SK) <span className="ml-2">: {data_diri?.tanggal_sk || '-'}</span></p>
              <p>Nomor Pertek BKN <span className="ml-2">: {data_diri?.nomor_pertek_bkn || '-'}</span></p>
              <p>Tanggal Pertek BKN <span className="ml-2">: {data_diri?.tanggal_pertek_bkn || '-'}</span></p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Daftar Berkas</CardTitle>
          </CardHeader>
          <CardContent>
            {berkas.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jenis Dokumen</TableHead>
                    <TableHead>Nama Dokumen</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {berkas.map((item) => (
                    Object.entries(item).map(([key, value]) => {
                      if (!value || ['id', 'created_at'].includes(key)) return null;
                      return (
                        <TableRow key={`${item.id}-${key}`}>
                          <TableCell>{key.replace(/_/g, ' ').toUpperCase()}</TableCell>
                          <TableCell>{String(value).split('/').pop()}</TableCell>
                          <TableCell className="flex justify-center gap-2">
                            <a
                              href={`/storage/${value}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                              title="Lihat"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <a
                              href={`/storage/${value}`}
                              download
                              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500 text-sm">Belum ada berkas yang diupload.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
