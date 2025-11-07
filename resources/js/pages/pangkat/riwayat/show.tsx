import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Download, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Riwayat', href: '/pangkat/riwayat' },
    { title: 'Detail Riwayat', href: '#' },
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
    pangkat: string;
    gaji_pokok: number;
}

interface Berkas {
    id: number;
    sk_cpns?: string;
    sk_pns?: string;
    sk_gaji_berkala?: string;
    sk_pangkat_terakhir?: string;
    sk_jabatan?: string;
    file_sk?: string;
    status?: string;
    created_at: string;
}

interface Pegawai {
    id: number;
    nama: string;
    email: string;
    jenis_kelamin: string;
    alamat: string;
}

interface PageProps {
    pegawai: Pegawai;
    data_diri: DataDiri;
    berkas: Berkas;
}

export default function Show() {
    const { pegawai, data_diri, berkas } = usePage().props as unknown as PageProps;

    const daftarBerkas = [
        { label: 'SK CPNS', key: 'sk_cpns' },
        { label: 'SK PNS', key: 'sk_pns' },
        { label: 'SK Gaji Berkala', key: 'sk_gaji_berkala' },
        { label: 'SK Pangkat Terakhir', key: 'sk_pangkat_terakhir' },
        { label: 'SK Jabatan', key: 'sk_jabatan' },
        { label: 'File SK Naik Pangkat', key: 'file_sk' },
    ];

    const dataDiriList = [
        { label: 'Golongan / Ruang', value: data_diri?.golongan_ruang },
        { label: 'Jenis Kenaikan Pangkat (KP)', value: data_diri?.jenis_kp },
        { label: 'Masa Kerja Golongan (Tahun)', value: data_diri?.masa_gk_tahunan },
        { label: 'Masa Kerja Golongan (Bulan)', value: data_diri?.masa_gk_bulanan },
        { label: 'TMT Golongan', value: data_diri?.tmt_golongan },
        { label: 'Nomor SK', value: data_diri?.nomor_sk },
        { label: 'Tanggal SK', value: data_diri?.tanggal_sk },
        { label: 'Nomor Pertek BKN', value: data_diri?.nomor_pertek_bkn },
        { label: 'Tanggal Pertek BKN', value: data_diri?.tanggal_pertek_bkn },
        { label: 'Pangkat', value: data_diri?.pangkat },
        {
            label: 'Gaji Pokok',
            value: data_diri?.gaji_pokok
                ? `Rp ${data_diri.gaji_pokok.toLocaleString('id-ID')}`
                : '-',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Riwayat - ${pegawai.nama}`} />

            <div className="p-4">
                {/* Data Pegawai */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Pegawai</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                            <li className="grid grid-cols-2 px-4 py-2 sm:px-6">
                                <span className="font-bold text-gray-700 dark:text-white">Nama</span>
                                <span className="text-gray-900 dark:text-white">: {pegawai.nama}</span>
                            </li>
                            <li className="grid grid-cols-2 px-4 py-2 sm:px-6">
                                <span className="font-bold text-gray-700 dark:text-white">Email</span>
                                <span className="text-gray-900 dark:text-white">: {pegawai.email}</span>
                            </li>
                            <li className="grid grid-cols-2 px-4 py-2 sm:px-6">
                                <span className="font-bold text-gray-700 dark:text-white">Jenis Kelamin</span>
                                <span className="text-gray-900 dark:text-white capitalize">: {pegawai.jenis_kelamin}</span>
                            </li>
                            <li className="grid grid-cols-2 px-4 py-2 sm:px-6">
                                <span className="font-bold text-gray-700 dark:text-white">Alamat</span>
                                <span className="text-gray-900 dark:text-white">: {pegawai.alamat}</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Data Kenaikan Pangkat */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Data Kenaikan Pangkat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                            {dataDiriList.map((item, index) => (
                                <li key={index} className="grid grid-cols-2 px-4 py-2 sm:px-6">
                                    <span className="font-bold text-gray-700 dark:text-white">{item.label}</span>
                                    <span className="text-gray-900 dark:text-white">: {item.value || '-'}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Daftar Berkas */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Daftar Berkas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Jenis Dokumen</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-center">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {daftarBerkas.map((item) => (
                                    <TableRow key={item.key}>
                                        <TableCell>{item.label}</TableCell>
                                        <TableCell>
                                            {berkas?.[item.key as keyof Berkas] ? 'Tersedia' : '-'}
                                        </TableCell>
                                        <TableCell className="flex justify-center gap-2">
                                            {berkas?.[item.key as keyof Berkas] && (
                                                <>
                                                    <a
                                                        href={`/storage/${berkas[item.key as keyof Berkas]}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                                                        title="Lihat"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </a>
                                                    <a
                                                        href={`/storage/${berkas[item.key as keyof Berkas]}`}
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
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
