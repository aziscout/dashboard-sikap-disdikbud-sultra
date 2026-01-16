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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usulan Pangkat', href: '/pangkat/usulanPangkat' },
];

interface Berkas {
    sk_cpns?: string;
    sk_pns?: string;
    sk_gaji_berkala?: string;
    sk_pangkat_terakhir?: string;
    sk_jabatan?: string;
    // Tambahkan properti lain yang mungkin ada di model Berkas jika diperlukan
}

interface Pegawai {
    id: number;
    nip: string;
    nama: string;
    nomor: string;
    created_at: string;
    berkas?: Berkas[]; // Pastikan ini adalah array of Berkas atau ambil data berkas tunggal
}

// Interface untuk data Pagination dari Laravel
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PegawaiPagination {
    data: Pegawai[];
    links: PaginationLink[];
    current_page: number;
    per_page: number;
    from: number; // Untuk menghitung nomor urut
    to: number; // Untuk menghitung nomor urut
}

interface PageProps {
    flash: { message?: string };
    pegawai: PegawaiPagination; // Ubah ke format pagination
}

export default function Index() {
    // Ambil data dari props, pastikan pegawai adalah objek pagination
    const { pegawai, flash } = usePage().props as unknown as PageProps; 
    const [sortOrder, setSortOrder] = useState<'terbaru' | 'terlama'>('terbaru');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAndSortedPegawai = useMemo(() => {
        // Lakukan filtering dan sorting HANYA pada data di halaman saat ini
        // Filtering dan sorting menyeluruh (across all pages) harusnya dilakukan di backend, 
        // tapi karena filtering kompleks sudah dilakukan di backend, kita hanya melakukan sorting/searching dari data yang diterima.
        return [...pegawai.data]
        .filter((item) =>
            item.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.nip.includes(searchQuery) // Tambahkan pencarian NIP
        )
        .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'terbaru' ? dateB - dateA : dateA - dateB;
        });
    }, [pegawai.data, sortOrder, searchQuery]);

    // Fungsi untuk mendapatkan data berkas yang relevan (misalnya yang pertama)
    const getBerkas = (pegawai: Pegawai, key: keyof Berkas) => {
        return pegawai.berkas?.[0]?.[key];
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Usulan Pangkat" />

        <div className="container mx-auto p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h1
                className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 
                bg-clip-text text-transparent tracking-tight"
            >
                Usulan Pangkat Pegawai
            </h1>

            <div className="flex flex-col gap-2 md:flex-row md:items-center">
                {/* 🔍 Search */}
                <Input
                placeholder="Cari nama/NIP pegawai..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 border-indigo-200 dark:border-indigo-800 focus:ring-2 focus:ring-indigo-400"
                />

                {/* 🔽 Sort */}
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                    variant="outline"
                    className="flex items-center gap-2 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all"
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

            {/* Notifikasi */}
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

            {/* Table Section */}
            <div
            className="overflow-x-auto rounded-xl border border-indigo-100 
            dark:border-indigo-900/50 shadow-md backdrop-blur-md transition-all"
            >
            <Table className="w-full min-w-[900px]">
                <TableHeader>
                <TableRow className="bg-indigo-100/40 dark:bg-indigo-900/40">
                    <TableHead className="w-[60px] text-center">No</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead className="text-center">NIP</TableHead>
                    <TableHead className="text-center">Nomor</TableHead>
                    <TableHead className="text-center">SK CPNS</TableHead>
                    <TableHead className="text-center">SK PNS</TableHead>
                    <TableHead className="text-center">SK Pangkat Terakhir</TableHead>
                    <TableHead className="text-center">SK Gaji Berkala</TableHead>
                    <TableHead className="text-center">SK Jabatan</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
                </TableHeader>

                <TableBody>
                {filteredAndSortedPegawai.length > 0 ? (
                    filteredAndSortedPegawai.map((item, index) => (
                    <TableRow
                        key={item.id}
                        className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/40 transition-all"
                    >
                        <TableCell className="text-center">
                            {(pegawai.current_page - 1) * pegawai.per_page + (index + 1)}
                        </TableCell>
                        <TableCell className="font-medium capitalize">
                        {item.nama}
                        </TableCell>
                        <TableCell className="text-center">{item.nip}</TableCell>
                        <TableCell className="text-center">{item.nomor}</TableCell>

                        {[
                        'sk_pns',
                        'sk_cpns',
                        'sk_gaji_berkala',
                        'sk_jabatan',
                        'sk_pangkat_terakhir',
                        ].map((key) => {
                            const berkasFile = getBerkas(item, key as keyof Berkas);
                            return (
                                <TableCell key={key} className="text-center">
                                    {berkasFile ? (
                                        <a
                                            href={`/storage/${berkasFile}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button
                                            className="bg-gradient-to-r from-indigo-500 to-indigo-500 
                                            hover:from-indigo-600 hover:to-purple-600 text-white text-xs 
                                            px-3 py-1 shadow-md hover:shadow-lg transition-all"
                                            >
                                            Lihat Dokumen
                                            </Button>
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 dark:text-gray-500">
                                            -
                                        </span>
                                    )}
                                </TableCell>
                            );
                        })}

                        <TableCell className="text-center">
                        <Link
                            href={route('pangkat.usulanPangkat.status', item.id)}
                            title="Cek Status"
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
                        colSpan={9}
                        className="text-center text-gray-500 py-6 dark:text-gray-400"
                    >
                        Tidak ada data pegawai yang memenuhi syarat usulan pangkat.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </div>
            
            {/* Pagination Links */}
            <div className="flex justify-end items-center gap-2 my-8 flex-wrap">
                {pegawai.links.map((link, i) => (
                    <Button
                    key={i}
                    size="sm"
                    variant={link.active ? 'default' : 'outline'}
                    disabled={!link.url}
                    // Menggunakan Link Inertia atau window.location untuk navigasi pagination
                    onClick={() => link.url && (window.location.href = link.url)}
                    // Menggunakan dangerouslySetInnerHTML untuk menampilkan simbol navigasi (seperti << atau >>)
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
            {/* End Pagination Links */}

        </div>
        </AppLayout>
    );
}