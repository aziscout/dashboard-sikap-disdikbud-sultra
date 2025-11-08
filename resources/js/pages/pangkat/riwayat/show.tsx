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

            <div className="container mx-auto p-6 space-y-6">
                {/* Header Title */}
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tight mb-2">
                    Detail Riwayat Pegawai
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Informasi lengkap riwayat kenaikan pangkat dan berkas {pegawai.nama}.
                </p>

                {/* Data Pegawai */}
                <Card className="border border-indigo-200 dark:border-indigo-900/50 bg-white/70 dark:bg-gray-900/60 shadow-lg rounded-2xl backdrop-blur-md transition-all">
                    <CardHeader className="border-indigo-100 dark:border-indigo-800/50 text-center">
                        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Data Pegawai
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {[
                                { label: 'Nama', value: pegawai.nama },
                                { label: 'Email', value: pegawai.email },
                                { label: 'Jenis Kelamin', value: pegawai.jenis_kelamin },
                                { label: 'Alamat', value: pegawai.alamat },
                            ].map((item, index) => (
                                <li
                                    key={index}
                                    className="grid grid-cols-2 py-2 px-2 sm:px-4 text-sm sm:text-base hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30 transition-all rounded-lg"
                                >
                                    <span className="font-medium text-sm text-gray-700 dark:text-indigo-300">
                                        {item.label}
                                    </span>
                                    <span className="text-gray-900 text-sm dark:text-gray-200">
                                        : {item.value || '-'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Data Kenaikan Pangkat */}
                <Card className="border border-indigo-200 dark:border-indigo-900/50 bg-white/70 dark:bg-gray-900/60 shadow-lg rounded-2xl backdrop-blur-md transition-all">
                    <CardHeader className=" border-indigo-100 dark:border-indigo-800/50 text-center">
                        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Data Kenaikan Pangkat
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {dataDiriList.map((item, index) => (
                                <li
                                    key={index}
                                    className="grid grid-cols-2 py-2 px-2 sm:px-4 text-sm sm:text-base hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30 transition-all rounded-lg"
                                >
                                    <span className="font-medium text-sm text-gray-700 dark:text-indigo-300">
                                        {item.label}
                                    </span>
                                    <span className="text-gray-900 text-sm dark:text-gray-200">
                                        : {item.value || '-'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Daftar Berkas */}
                <Card className="border border-indigo-200 dark:border-indigo-900/50 bg-white/70 dark:bg-gray-900/60 shadow-lg rounded-2xl backdrop-blur-md transition-all">
                    <CardHeader className=" border-indigo-100 dark:border-indigo-800/50 text-center">
                        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Daftar Berkas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-indigo-100/40 dark:bg-indigo-900/40">
                                    <TableHead className="text-gray-700 dark:text-gray-300">
                                        No
                                    </TableHead>
                                    <TableHead className="text-gray-700 dark:text-gray-300">
                                        Jenis Dokumen
                                    </TableHead>
                                    <TableHead className="text-gray-700 dark:text-gray-300">
                                        Status
                                    </TableHead>
                                    <TableHead className="text-center text-gray-700 dark:text-gray-300">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {daftarBerkas.map((item, index) => {
                                    const tersedia = berkas?.[item.key as keyof Berkas];
                                    return (
                                        <TableRow
                                            key={index}
                                            className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/40 transition-all"
                                        >
                                            <TableCell className="font-medium text-gray-800 dark:text-gray-200">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-800 dark:text-gray-200">
                                                {item.label}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                                                        tersedia
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                                            : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                                    }`}
                                                >
                                                    {tersedia ? 'Tersedia' : 'Belum Ada'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="flex justify-center gap-2">
                                                {tersedia && (
                                                    <>
                                                        <a
                                                            href={`/storage/${berkas[item.key as keyof Berkas]}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm transition-all"
                                                            title="Lihat Dokumen"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </a>
                                                        <a
                                                            href={`/storage/${berkas[item.key as keyof Berkas]}`}
                                                            download
                                                            className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white shadow-sm transition-all"
                                                            title="Download Dokumen"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
