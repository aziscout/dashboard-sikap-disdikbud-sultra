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
import { Eye, ListFilterPlus } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usulan Kenaikan Pangkat', href: '/pangkat/usulan-pangkat' },
];

interface BerkasObject {
    file: string;
    created_at?: string;
}

interface Berkas {
    sk_cpns?: string;
    sk_pns?: string;
    sk_gaji_berkala?: BerkasObject[];
    sk_pangkat_terakhir?: BerkasObject[];
    sk_jabatan?: BerkasObject[];
}

interface Pegawai {
    id: number;
    nip: string;
    nama: string;
    nomor: string;
    created_at: string;
    berkas?: Berkas[]; 
}

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
    from: number; 
    to: number; 
}

interface PageProps {
    flash: { message?: string };
    pegawai: PegawaiPagination; 
}

export default function Index() {
    const { pegawai } = usePage().props as unknown as PageProps; 
    const [sortOrder, setSortOrder] = useState<'Terbaru' | 'Terlama'>('Terbaru');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAndSortedPegawai = useMemo(() => {
        return [...pegawai.data]
        .filter((item) =>
            item.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.nip.includes(searchQuery)
        )
        .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'Terbaru' ? dateB - dateA : dateA - dateB;
        });
    }, [pegawai.data, sortOrder, searchQuery]);

    const getLatestBerkas = (
        pegawai: Pegawai,
        key: keyof Berkas
    ): string | null => {
        const value = pegawai.berkas?.[0]?.[key];

        if (!value) return null;

        if (typeof value === 'string') {
            return value;
        }

        if (Array.isArray(value) && value.length > 0) {
            const lastItem = value[value.length - 1];

            if (lastItem && typeof lastItem === 'object' && 'file' in lastItem) {
                return lastItem.file;
            }
        }

        return null;
    };


    const isBerkasLengkap = (pegawai: Pegawai): boolean => {
        const requiredKeys: (keyof Berkas)[] = [
            'sk_cpns',
            'sk_pns',
            'sk_pangkat_terakhir',
            'sk_gaji_berkala',
            'sk_jabatan',
        ];

        return requiredKeys.every((key) => {
            const value = pegawai.berkas?.[0]?.[key];

            if (!value) return false;

            if (typeof value === 'string') return true;

            if (Array.isArray(value)) {
                return value.length > 0 && typeof value[0]?.file === 'string';
            }

            return false;
        });
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Usulan Pangkat" />

        <div className="container mx-auto p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h1
                className="text-2xl font-bold 
                bg-clip-text text-indigo-500 tracking-tight"
            >
                Usulan Kenaikan Pangkat
            </h1>

            <div className="flex flex-col gap-2 md:flex-row md:items-center">
                {/* Search */}
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
                    <DropdownMenuItem onClick={() => setSortOrder('Terbaru')}>
                        Terbaru
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder('Terlama')}>
                        Terlama
                    </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
            </div>

            {/* Table Section */}
            <div
            className="overflow-x-auto rounded-lg border border-indigo-100 
            dark:border-indigo-900/50 shadow-md backdrop-blur-md transition-all"
            >
            <Table className="w-full min-w-[900px]">
                <TableHeader>
                <TableRow className="bg-indigo-100/40 dark:bg-indigo-900/40">
                    <TableHead className="w-[60px] text-center">No</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>NIP</TableHead>
                    {/* <TableHead>Nomor</TableHead> */}
                    <TableHead className="text-center">SK CPNS</TableHead>
                    <TableHead className="text-center">SK PNS</TableHead>
                    <TableHead className="text-center">SK Pangkat Terakhir</TableHead>
                    <TableHead className="text-center">SK Gaji Berkala</TableHead>
                    <TableHead className="text-center">SK Jabatan</TableHead>
                    <TableHead className="text-center">Status</TableHead>
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
                        <TableCell className="capitalize">
                        {item.nama}
                        </TableCell>
                        <TableCell>{item.nip}</TableCell>
                        {/* <TableCell>{item.nomor}</TableCell> */}

                        {[
                            'sk_cpns',
                            'sk_pns',
                            'sk_pangkat_terakhir',
                            'sk_gaji_berkala',
                            'sk_jabatan',
                        ].map((key) => {
                            const berkasFile = getLatestBerkas(item, key as keyof Berkas);
                            return (
                                <TableCell key={key} className="text-center">
                                    {berkasFile ? (
                                        <a
                                            href={`/storage/${berkasFile}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button
                                            className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs 
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
                            {isBerkasLengkap(item) ? (
                                <Link
                                    href={route('pangkat.usulan-pangkat.status', item.id)}
                                    title="Cek Status Usulan"
                                >
                                    <Button
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white 
                                        shadow-md hover:shadow-lg transition-all"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    disabled
                                    className="bg-gray-300 dark:bg-gray-700 
                                    text-gray-500 dark:text-gray-400 
                                    cursor-not-allowed shadow-none"
                                    title="Berkas belum lengkap"
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                            )}
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
                    onClick={() => link.url && (window.location.href = link.url)}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`
                        min-w-[40px] h-9 rounded-full text-sm font-medium
                        transition-all duration-200 ease-in-out
                        ${
                        link.active
                            ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 dark:shadow-purple-800/40 scale-105'
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