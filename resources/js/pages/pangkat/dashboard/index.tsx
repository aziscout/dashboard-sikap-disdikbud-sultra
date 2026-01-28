import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowUpCircle, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Beranda', href: '/pangkat/dashboard' }];

interface Pegawai {
    nama: string;
    email: string;
    unit_kerja: string;
    tmt_golongan: string;
    golongan_ruang: string;
    nomor: number;
    nip: number;
}

interface PageProps {
    totalPegawai: number;
    totalNaikPangkat: number;
    totalSudahNaikPangkat: number;
    pegawaiNaikPangkat: Pegawai[];
}

export default function Index() {
    const { totalPegawai, totalNaikPangkat, totalSudahNaikPangkat, pegawaiNaikPangkat } = usePage().props as unknown as PageProps;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Pangkat" />

            <div className="flex flex-col gap-6 p-6">
                {/* 🔹 Statistik Cards */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Total Pegawai */}
                    <Card className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-100 to-blue-50 shadow-lg transition-all duration-300 hover:shadow-indigo-300/40 dark:border-indigo-500/30 dark:from-indigo-500/20 dark:to-blue-500/10 dark:hover:shadow-indigo-500/30">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <h2 className="text-sm font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-300">Total Pegawai</h2>
                                <p className="mt-1 text-4xl font-extrabold">{totalPegawai}</p>
                            </div>
                            <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-500/20">
                                <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Siap Naik Pangkat */}
                    <Card className="rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-100 to-orange-50 shadow-lg transition-all duration-300 hover:shadow-pink-300/40 dark:border-pink-500/30 dark:from-pink-500/20 dark:to-orange-500/10 dark:hover:shadow-pink-500/30">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <h2 className="text-sm font-semibold tracking-wide text-pink-600 uppercase dark:text-pink-300">Siap Naik Pangkat</h2>
                                <p className="mt-1 text-4xl font-extrabold">{totalNaikPangkat}</p>
                            </div>
                            <div className="rounded-full bg-pink-100 p-3 dark:bg-pink-500/20">
                                <ArrowUpCircle className="h-8 w-8 text-pink-600 dark:text-pink-300" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sudah Naik Pangkat */}
                    <Card className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-100 to-teal-50 shadow-lg transition-all duration-300 hover:shadow-emerald-300/40 dark:border-emerald-500/30 dark:from-emerald-500/20 dark:to-teal-500/10 dark:hover:shadow-emerald-500/30">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <h2 className="text-sm font-semibold tracking-wide text-emerald-600 uppercase dark:text-emerald-300">
                                    Sudah Naik Pangkat Tahun {new Date().getFullYear()}
                                </h2>
                                <p className="mt-1 text-4xl font-extrabold">{totalSudahNaikPangkat}</p>
                            </div>
                            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-500/20">
                                <ArrowUpCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 🔹 Table Header */}
                <div className=" flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-indigo-500 dark:text-gray-200">Daftar pegawai siap naik pangkat</h2>
                    {pegawaiNaikPangkat.length > 0 && (
                        <Link href={route('pangkat.usulan-pangkat')}>
                            <Button className="rounded-md bg-indigo-500 font-medium text-white shadow-md transition-all hover:bg-indigo-600">
                                Lihat Semua
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="overflow-hidden rounded-lg border border-indigo-100 shadow-md backdrop-blur-md transition-all dark:border-indigo-900/50">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="bg-indigo-100/40 dark:bg-indigo-900/40">
                                <TableHead className="w-[60px] text-center">No</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>NIP</TableHead>
                                <TableHead>Nomor</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Unit Kerja</TableHead>
                                <TableHead>Golongan/Ruang</TableHead>
                                <TableHead>TMT Golongan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pegawaiNaikPangkat.length > 0 ? (
                                pegawaiNaikPangkat.map((p, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="text-center">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{p.nama}</TableCell>
                                        <TableCell className="font-medium">{p.nip}</TableCell>
                                        <TableCell className="capitalize">{p.nomor}</TableCell>
                                        <TableCell>{p.email}</TableCell>
                                        <TableCell className="capitalize">{p.unit_kerja}</TableCell>
                                        <TableCell>{p.golongan_ruang}</TableCell>
                                        <TableCell>{p.tmt_golongan}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-6 pl-60 text-center text-gray-500 dark:text-gray-400">
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
