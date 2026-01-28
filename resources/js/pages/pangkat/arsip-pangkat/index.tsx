import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, ListFilterPlus } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { 
        title: 'Arsip Kenaikan Pangkat', 
        href: '/pangkat/arsip-pangkat' 
    }
];

interface Arsip {
    id: number;
    nama: string;
    nomor: number;
    nip: string;
    email: string;
    unit_kerja: string;
    tmt_golongan: string;
    is_active: boolean;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ArsipPagination {
    data: Arsip[];
    links: PaginationLink[];
    current_page: number;
    per_page: number;
}

interface PageProps {
    arsip: ArsipPagination; 
}

export default function Index() {
    const { arsip } = usePage().props as unknown as PageProps;
    const [sortOrder, setSortOrder] = useState<'Terbaru' | 'Terlama'>('Terbaru');
    const [searchQuery, setSearchQuery] = useState('');

    const renderValue = (value?: string | number | null) => (value !== null && value !== undefined && value !== '' ? value : '-');

    const filteredArsip = useMemo(() => {
        return [...arsip.data]
            .filter(
                (item) =>
                    // item.nama.toLowerCase().includes(searchQuery.toLowerCase())
                    (item.nama ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (item.nip ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (item.unit_kerja ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (item.tmt_golongan ?? '').toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .sort((a, b) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return sortOrder === 'Terbaru' ? dateB - dateA : dateA - dateB;
            });
    }, [arsip.data, sortOrder, searchQuery]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Arsip Naik Pangkat" />

            <div className="container mx-auto space-y-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h1 className="bg-gradient-to-r bg-clip-text text-2xl font-bold tracking-tight text-indigo-500">Arsip Naik Pangkat</h1>

                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                        {/*  Search */}
                        <Input
                            placeholder="Cari nama,nip, atau unit kerja..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border-indigo-200 focus:ring-2 focus:ring-indigo-400 md:w-64 dark:border-indigo-800"
                        />

                        {/*  Sort */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 border-indigo-200 text-indigo-600 transition-all hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
                                >
                                    <ListFilterPlus className="h-4 w-4" /> {sortOrder}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40 border border-indigo-100 bg-white shadow-lg backdrop-blur-md dark:border-indigo-800 dark:bg-gray-900">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => setSortOrder('Terbaru')}>Terbaru</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortOrder('Terlama')}>Terlama</DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* 📋 Table Section */}
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
                                <TableHead>TMT Golongan</TableHead>
                                <TableHead>Detail</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredArsip.length > 0 ? (
                                filteredArsip.map((item, index) => (
                                    <TableRow key={item.id} className="transition-all hover:bg-indigo-50/50 dark:hover:bg-indigo-900/40">
                                        {/* <TableCell className="text-center">{index + 1}</TableCell> */}
                                        <TableCell className="text-center">{(arsip.current_page - 1) * arsip.per_page + (index + 1)}</TableCell>
                                        <TableCell>{item.nama}</TableCell>
                                        <TableCell>{renderValue(item.nip)}</TableCell>
                                        <TableCell>{renderValue(item.nomor)}</TableCell>
                                        <TableCell>{renderValue(item.email)}</TableCell>
                                        <TableCell className="capitalize">{renderValue(item.unit_kerja)}</TableCell>
                                        <TableCell className="capitalize">{renderValue(item.tmt_golongan)}</TableCell>
                                        <TableCell>
                                            <Link href={route('pangkat.arsip-pangkat.show', item.id)} title="Detail">
                                                <Button className="bg-indigo-500 text-white shadow-md transition-all hover:bg-indigo-600 hover:shadow-lg">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-6 text-center text-gray-500">
                                        Tidak ada data arsip naik pangkat.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* 4. Implementasi Pagination (menggunakan style dari kode Pegawai Anda) */}
                <div className="my-8 flex flex-wrap items-center justify-end gap-2">
                    {arsip.links.map((link, i) => (
                        <Button
                            key={i}
                            size="sm"
                            // Menggunakan link.active untuk menentukan variant
                            variant={link.active ? 'default' : 'outline'}
                            disabled={!link.url}
                            // Menggunakan window.location.href (seperti kode pegawai Anda)
                            onClick={() => link.url && (window.location.href = link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`h-9 min-w-[40px] rounded-full text-sm font-medium transition-all duration-200 ease-in-out ${
                                link.active
                                    ? 'scale-105 bg-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 dark:shadow-purple-800/40'
                                    : 'border border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/30'
                            } ${!link.url ? 'cursor-not-allowed opacity-40' : ''} `}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
