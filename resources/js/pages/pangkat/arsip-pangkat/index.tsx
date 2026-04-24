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
import { Eye, ListFilterPlus, Search } from 'lucide-react';
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

    const renderValue = (value?: string | number | null) => 
        (value !== null && value !== undefined && value !== '' ? value : '-');

    const filteredArsip = useMemo(() => {
        return [...arsip.data]
            .filter(
                (item) =>
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

            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 md:p-8 space-y-6">
                
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                            Arsip <span className="text-indigo-500">Naik Pangkat</span>
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">
                            Ditemukan {filteredArsip.length} berkas arsip tersimpan
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                placeholder="Cari nama, NIP, unit..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-72 pl-10 border-indigo-100 dark:border-indigo-900 focus:ring-indigo-500/20 rounded-xl bg-white dark:bg-slate-900 shadow-sm"
                            />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded-xl border-indigo-100 dark:border-indigo-900 text-indigo-600 gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 shadow-sm transition-all">
                                    <ListFilterPlus className="w-4 h-4" /> {sortOrder}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-xl border-indigo-50 dark:border-indigo-900">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => setSortOrder('Terbaru')} className="cursor-pointer">Terbaru</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortOrder('Terlama')} className="cursor-pointer">Terlama</DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Table Card Section */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900 shadow-xl shadow-indigo-500/5 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-indigo-50/40 dark:bg-indigo-900/20">
                            <TableRow className="hover:bg-transparent border-b border-indigo-100 dark:border-indigo-900">
                                <TableHead className="w-[60px] text-center font-bold text-indigo-600 uppercase text-[10px] tracking-widest">No</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">Nama Pegawai</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">NIP</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">Nomor</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">Unit Kerja</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">TMT Golongan</TableHead>
                                <TableHead className="text-center font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredArsip.length > 0 ? (
                                filteredArsip.map((item, index) => (
                                    <TableRow key={item.id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors border-indigo-50/50 dark:border-indigo-900/20">
                                        <TableCell className="text-center font-mono text-xs text-slate-400">
                                            {(arsip.current_page - 1) * arsip.per_page + (index + 1)}
                                        </TableCell>
                                        <TableCell className="font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
                                            {item.nama}
                                        </TableCell>
                                        <TableCell className="font-mono text-slate-500">
                                            {renderValue(item.nip)}
                                        </TableCell>
                                        <TableCell className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                            {renderValue(item.nomor)}
                                        </TableCell>
                                        <TableCell>
                                            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-tight border border-indigo-100 dark:border-indigo-800">
                                                {renderValue(item.unit_kerja)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-xs font-semibold text-rose-600 dark:text-rose-400 capitalize">
                                            {renderValue(item.tmt_golongan)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Link href={route('pangkat.arsip-pangkat.show', item.id)}>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-300">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-slate-400 italic">
                                        Data arsip tidak ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center md:justify-end items-center gap-1.5 pt-4">
                    {arsip.links.map((link, i) => (
                        <Button
                            key={i}
                            variant="ghost"
                            disabled={!link.url}
                            onClick={() => link.url && (window.location.href = link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`
                                h-9 min-w-[36px] rounded-xl text-xs font-bold transition-all
                                ${link.active 
                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                                    : 'text-slate-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                                }
                                ${!link.url ? 'opacity-20 cursor-not-allowed' : ''}
                            `}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}