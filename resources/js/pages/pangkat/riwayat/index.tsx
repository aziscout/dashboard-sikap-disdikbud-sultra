import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, ListFilterPlus, Megaphone } from 'lucide-react';
import { useMemo, useState } from 'react';

// Asumsi: Anda menggunakan komponen Pagination yang diimpor
// import Pagination from '@/components/Pagination'; 
// Karena Anda memberikan implementasi pagination inline di kode pegawai, 
// saya akan mengikutinya.

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Riwayat', href: '/pangkat/riwayat' },
];

interface Riwayat {
    id: number;
    nama: string;
    email: string;
    jenis_kelamin: string;
    alamat: string;
    tmt_golongan: string;
    tanggal_naik_pangkat: string;
    // Tambahkan properti lain yang mungkin diperlukan dari model Berkas/Pegawai
}

// 1. Interfaces untuk Pagination
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface RiwayatPagination {
    data: Riwayat[];
    links: PaginationLink[];
    current_page: number;
    per_page: number;
}

// 2. Perubahan PageProps
interface PageProps {
    flash?: { message?: string };
    riwayat: RiwayatPagination; // Menggunakan tipe Pagination
}

export default function Index() {
    // Mengubah riwayat menjadi objek pagination
    const { riwayat, flash } = usePage().props as unknown as PageProps;
    const [sortOrder, setSortOrder] = useState<'terbaru' | 'terlama'>('terbaru');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRiwayat = useMemo(() => {
        // Menggunakan riwayat.data karena data sudah di-paginate oleh Controller
        return [...riwayat.data]
            .filter((item) =>
                item.nama.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
                // Pastikan format tanggal sudah diconvert dengan benar di controller (d/m/Y)
                const parseDate = (dateString: string) => {
                    const parts = dateString.split('/');
                    // Format: YYYY-MM-DD
                    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
                };
                
                const dateA = parseDate(a.tanggal_naik_pangkat);
                const dateB = parseDate(b.tanggal_naik_pangkat);
                
                return sortOrder === 'terbaru' ? dateB - dateA : dateA - dateB;
            });
    }, [riwayat.data, sortOrder, searchQuery]); // Menggunakan riwayat.data sebagai dependency

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Naik Pangkat" />

            <div className="container mx-auto p-6 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h1
                        className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 
                        bg-clip-text text-transparent tracking-tight"
                    >
                        Riwayat Naik Pangkat
                    </h1>

                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                        {/* 🔍 Search */}
                        <Input
                            placeholder="Cari nama pegawai..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 border-indigo-200 dark:border-indigo-800 focus:ring-2 focus:ring-indigo-400"
                        />

                        {/* 🔽 Sort */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 border-indigo-200 dark:border-indigo-800 
                                    text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all"
                                >
                                    <ListFilterPlus className="w-4 h-4" /> {sortOrder}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40 bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-800 shadow-lg backdrop-blur-md">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => setSortOrder('terbaru')}>
                                        Terbaru
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortOrder('terlama')}>
                                        Terlama
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* 🔔 Notifikasi */}
                {flash?.message && (
                    <div className="w-full md:w-1/2">
                        <Alert className="border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50">
                            <Megaphone className="h-4 w-4 text-indigo-500" />
                            <AlertTitle className="text-indigo-700 dark:text-indigo-300">
                                Notifikasi
                            </AlertTitle>
                            <AlertDescription className="text-gray-700 dark:text-gray-300">
                                {flash.message}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                {/* 📋 Table Section */}
                <div
                    className="overflow-hidden rounded-xl border border-indigo-100 
                    dark:border-indigo-900/50 shadow-md backdrop-blur-md transition-all"
                >
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="bg-indigo-100/40 dark:bg-indigo-900/40">
                                <TableHead className="w-[60px] text-center">No</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Jenis Kelamin</TableHead>
                                <TableHead>Alamat</TableHead>
                                <TableHead>Tanggal Naik Pangkat</TableHead>
                                <TableHead>TMT Golongan</TableHead>
                                <TableHead className="text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRiwayat.length > 0 ? (
                                filteredRiwayat.map((item, index) => (
                                    <TableRow
                                        key={item.id}
                                        className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/40 transition-all"
                                    >
                                        {/* 3. Penyesuaian Penomoran */}
                                        <TableCell className="text-center">
                                            {(riwayat.current_page - 1) * riwayat.per_page + (index + 1)}
                                        </TableCell>
                                        {/* --------------------------- */}
                                        <TableCell className="font-medium">{item.nama}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell className="capitalize">
                                            {item.jenis_kelamin}
                                        </TableCell>
                                        <TableCell className="capitalize">
                                            {item.alamat}
                                        </TableCell>
                                        <TableCell>{item.tanggal_naik_pangkat}</TableCell>
                                        <TableCell>{item.tmt_golongan}</TableCell>
                                        <TableCell className="text-center">
                                            <Link
                                                href={route('pangkat.riwayat.show', item.id)}
                                                title="Detail"
                                            >
                                                <Button
                                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 
                                                    hover:from-indigo-600 hover:to-purple-600 text-white shadow-md 
                                                    hover:shadow-lg transition-all"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center text-gray-500 dark:text-gray-400 py-6"
                                    >
                                        Tidak ada data riwayat naik pangkat.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                
                {/* 4. Implementasi Pagination (menggunakan style dari kode Pegawai Anda) */}
                <div className="flex justify-end items-center gap-2 my-8 flex-wrap">
                    {riwayat.links.map((link, i) => (
                        <Button
                            key={i}
                            size="sm"
                            // Menggunakan link.active untuk menentukan variant
                            variant={link.active ? 'default' : 'outline'}
                            disabled={!link.url}
                            // Menggunakan window.location.href (seperti kode pegawai Anda)
                            onClick={() => link.url && (window.location.href = link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`
                                min-w-[40px] h-9 rounded-full text-sm font-medium
                                transition-all duration-200 ease-in-out
                                ${
                                link.active
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 dark:shadow-purple-800/40 scale-105'
                                    : 'border border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                                }
                                ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}
                            `}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}