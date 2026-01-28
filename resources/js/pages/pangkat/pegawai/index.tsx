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
    { title: 'Pegawai', href: '/pangkat/pegawai' },
];

interface Pegawai {
    id: number;
    nama: string;
    nip: string;
    nomor: number;
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

interface PegawaiPagination {
    data: Pegawai[];
    links: PaginationLink[];
    current_page: number;
    per_page: number;
}

interface PageProps {
    flash: { message?: string };
    pegawai: PegawaiPagination;
}

export default function Index() {
    const { pegawai } = usePage().props as unknown as PageProps;
    const [sortOrder, setSortOrder] = useState<'Terbaru' | 'Terlama'>('Terbaru');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPegawai = useMemo(() => {
        return [...pegawai.data]
            .filter((item) =>
            // item.nama.toLowerCase().includes(searchQuery.toLowerCase())
            (item.nama ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.nip ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.unit_kerja ?? '').toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'Terbaru' ? dateB - dateA : dateA - dateB;
        });
    }, [pegawai.data, sortOrder, searchQuery]);

    const renderValue = (value?: string | number | null) =>
    value !== null && value !== undefined && value !== '' ? value : '-';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Data Pegawai" />

            <div className="container mx-auto p-6 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h1
                    className="text-2xl font-bold bg-gradient-to-r text-indigo-500 
                    bg-clip-text tracking-tight"
                    >
                    Daftar Pegawai
                    </h1>

                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    {/*  Search */}
                    <Input
                        placeholder="Cari nama,nip, atau unit kerja..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-64 border-indigo-200 dark:border-indigo-800 focus:ring-2 focus:ring-indigo-400"
                    />

                    {/*  Sort */}
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
                    className="overflow-hidden rounded-lg border border-indigo-100 
                    dark:border-indigo-900/50 shadow-md backdrop-blur-md transition-all"
                >
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
                            {filteredPegawai.length > 0 ? (
                            filteredPegawai.map((item, index) => (
                                <TableRow
                                key={item.id}
                                className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/40 transition-all"
                                >
                                    {/* <TableCell className="text-center">{index + 1}</TableCell> */}
                                    <TableCell className="text-center">
                                        {(pegawai.current_page - 1) * pegawai.per_page + (index + 1)}
                                    </TableCell>
                                    <TableCell>{item.nama}</TableCell>
                                    <TableCell>{renderValue(item.nip)}</TableCell>
                                    <TableCell>{renderValue(item.nomor)}</TableCell>
                                    <TableCell>{renderValue(item.email)}</TableCell>
                                    <TableCell className="capitalize">
                                        {renderValue(item.unit_kerja)}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {renderValue(item.tmt_golongan)}
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={route('pegawai.show', item.id)}
                                            title="Detail"
                                        >
                                            <Button
                                            className="bg-indigo-500 
                                            hover:bg-indigo-600 text-white shadow-md 
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
                                className="text-center text-gray-500 py-6"
                                >
                                Tidak ada data pegawai.
                                </TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
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
                                ? 'bg-indigo-500 hover:bg-indigo-600 to-purple-500 text-white shadow-lg shadow-indigo-500/30 dark:shadow-purple-800/40 scale-105'
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
