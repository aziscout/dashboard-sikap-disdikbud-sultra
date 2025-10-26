import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Download, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pegawai', href: '/pangkat/pegawai' },
    { title: 'Detail Pegawai', href: '#' },
];

interface DataDiri {
    golongan_ruang: string;
    jenis_kp: string;
    masa_gk_tahunan: number;
    masa_gk_bulanan: number;
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

    const daftarBerkas = [
        { label: 'SK CPNS', key: 'sk_cpns' },
        { label: 'SK PNS', key: 'sk_pns' },
        { label: 'SK GAJI BERKALA', key: 'sk_gaji_berkala' },
        { label: 'SK PANGKAT TERAKHIR', key: 'sk_pangkat_terakhir' },
        { label: 'SK JABATAN', key: 'sk_jabatan' },
    ];

    const dataDiri = [
        { label: 'Golongan', value: data_diri?.golongan_ruang },
        { label: 'Jenis Kenaikan Pangkat (KP)', value: data_diri?.jenis_kp },
        { label: 'Masa Kerja Golongan (Tahun)', value: data_diri?.masa_gk_tahunan },
        { label: 'Masa Kerja Golongan (Bulan)', value: data_diri?.masa_gk_bulanan },
        { label: 'TMT Golongan', value: data_diri?.tmt_golongan },
        { label: 'Nomor Surat Keputusan (SK)', value: data_diri?.nomor_sk },
        { label: 'Tanggal Surat Keputusan (SK)', value: data_diri?.tanggal_sk },
        { label: 'Nomor Pertek BKN', value: data_diri?.nomor_pertek_bkn },
        { label: 'Tanggal Pertek BKN', value: data_diri?.tanggal_pertek_bkn },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Pegawai - ${pegawai.nama}`} />

            <div className="p-4">
                <Card>
                    <CardHeader>
                        <div className="mb-4 flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">Detail</CardTitle>
                            <Button className="bg-blue-500 text-white hover:bg-blue-600">Cek Status</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <ul className="divide-y divide-gray-100 text-sm">
                                {dataDiri.map((item, index) => (
                                    <li key={index} className="grid grid-cols-2 px-4 py-2 sm:px-6">
                                        <span className="font-bold text-gray-700">{item.label}</span>
                                        <span className="text-gray-900">: {item.value || '-'}</span>
                                    </li>
                                ))}
                            </ul>
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
                                    {daftarBerkas.map((item) => (
                                        <TableRow key={item.key}>
                                            <TableCell>{item.label}</TableCell>
                                            <TableCell>{berkas[0]?.[item.key as keyof Berkas] || '-'}</TableCell>
                                            <TableCell className="flex justify-center gap-2">
                                                {berkas[0]?.[item.key as keyof Berkas] && (
                                                    <>
                                                        <a
                                                            href={`/storage/${berkas[0][item.key as keyof Berkas]}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                                                            title="Lihat"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </a>
                                                        <a
                                                            href={`/storage/${berkas[0][item.key as keyof Berkas]}`}
                                                            download
                                                            className="rounded bg-green-500 p-2 text-white hover:bg-green-600"
                                                            title="Download"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-sm text-gray-500">Belum ada berkas yang diupload.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
