import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
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
import { Eye, FileText, ListFilterPlus, Search, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usulan Kenaikan Pangkat', href: '/pangkat/usulan-pangkat' },
];

// --- Interfaces ---
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
                (item.nama ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.nip ?? '').includes(searchQuery)
            )
            .sort((a, b) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return sortOrder === 'Terbaru' ? dateB - dateA : dateA - dateB;
            });
    }, [pegawai.data, sortOrder, searchQuery]);

    const getLatestBerkas = (pegawai: Pegawai, key: keyof Berkas): string | null => {
        const value = pegawai.berkas?.[0]?.[key];
        if (!value) return null;
        if (typeof value === 'string') return value;
        if (Array.isArray(value) && value.length > 0) {
            const lastItem = value[value.length - 1];
            return lastItem && typeof lastItem === 'object' && 'file' in lastItem ? lastItem.file : null;
        }
        return null;
    };

    const isBerkasLengkap = (pegawai: Pegawai): boolean => {
        const requiredKeys: (keyof Berkas)[] = ['sk_cpns', 'sk_pns', 'sk_pangkat_terakhir', 'sk_gaji_berkala', 'sk_jabatan'];
        return requiredKeys.every((key) => !!getLatestBerkas(pegawai, key));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usulan Pangkat" />

            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 md:p-8 space-y-6">
                
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                            Usulan <span className="text-indigo-500">Pangkat</span>
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">
                            Monitoring kelengkapan berkas kenaikan pangkat pegawai
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                placeholder="Cari nama atau NIP..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-72 pl-10 border-indigo-100 dark:border-indigo-900 focus:ring-indigo-500/20 rounded-xl bg-white dark:bg-slate-900"
                            />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded-xl border-indigo-100 dark:border-indigo-900 text-indigo-600 gap-2 hover:bg-indigo-50">
                                    <ListFilterPlus className="w-4 h-4" /> {sortOrder}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                <DropdownMenuItem onClick={() => setSortOrder('Terbaru')}>Terbaru</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOrder('Terlama')}>Terlama</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900 shadow-xl shadow-indigo-500/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-indigo-50/50 dark:bg-indigo-900/20">
                                <TableRow className="hover:bg-transparent border-b border-indigo-100 dark:border-indigo-900">
                                    <TableHead className="w-[50px] text-center font-bold text-indigo-600 uppercase text-[10px] tracking-widest">No</TableHead>
                                    <TableHead className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">Nama</TableHead>
                                    <TableHead className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">NIP</TableHead>
                                    <TableHead className="text-center font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">SK CPNS</TableHead>
                                    <TableHead className="text-center font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">SK PNS</TableHead>
                                    <TableHead className="text-center font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">SK Pangkat</TableHead>
                                    <TableHead className="text-center font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">SK Jabatan</TableHead>
                                    <TableHead className="text-center font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">SK KGB</TableHead>
                                    <TableHead className="text-center font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAndSortedPegawai.length > 0 ? (
                                    filteredAndSortedPegawai.map((item, index) => (
                                        <TableRow key={item.id} className="group hover:bg-indigo-50/30 transition-colors border-indigo-50 dark:border-indigo-900/30">
                                            <TableCell className="text-center font-mono text-xs text-slate-400">
                                                {(pegawai.current_page - 1) * pegawai.per_page + (index + 1)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-700 dark:text-slate-200">{item.nama}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-mono text-slate-500 uppercase tracking-tighter">{item.nip}</span>
                                                </div>
                                            </TableCell>
                                            
                                            {/* Data Fields Mapping */}
                                            <TableCell className="text-center"><DocBadge href={getLatestBerkas(item, 'sk_cpns')} label="FILE" color="emerald"/></TableCell>
                                            <TableCell className="text-center"><DocBadge href={getLatestBerkas(item, 'sk_pns')} label="FILE" color="emerald"/></TableCell>
                                            <TableCell className="text-center"><DocBadge href={getLatestBerkas(item, 'sk_pangkat_terakhir')} label="FILE" color="emerald" /></TableCell>
                                            <TableCell className="text-center"><DocBadge href={getLatestBerkas(item, 'sk_jabatan')} label="FILE" color="emerald" /></TableCell>
                                            <TableCell className="text-center"><DocBadge href={getLatestBerkas(item, 'sk_gaji_berkala')} label="FILE" color="emerald" /></TableCell>

                                            <TableCell className="text-center">
                                                {isBerkasLengkap(item) ? (
                                                    <Link href={route('pangkat.usulan-pangkat.status', item.id)}>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all shadow-sm">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <div title="Berkas Belum Lengkap">
                                                        <Button disabled size="icon" variant="ghost" className="h-8 w-8 opacity-30 cursor-not-allowed">
                                                            <XCircle className="w-4 h-4 text-slate-400" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-32 text-center text-slate-400 italic">
                                            Data tidak ditemukan atau tidak tersedia.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex justify-center md:justify-end gap-1.5 pt-4">
                    {pegawai.links.map((link, i) => (
                        <Button
                            key={i}
                            variant="ghost"
                            disabled={!link.url}
                            onClick={() => link.url && (window.location.href = link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`h-8 min-w-[32px] rounded-lg text-xs font-bold ${link.active ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:bg-indigo-50'}`}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}

function DocBadge({ href, label, color = 'slate' }: { href: string | null; label: string; color?: 'slate' | 'indigo' | 'emerald' }) {
    const colorClasses = {
        slate: 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-700',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/30 dark:border-indigo-800',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800',
    };

    if (!href) return <span className="text-[10px] text-slate-300 font-bold tracking-tighter">—</span>;

    return (
        <a 
            href={`/storage/${href}`} 
            target="_blank" 
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-black transition-all hover:scale-105 ${colorClasses[color]}`}
        >
            <FileText className="w-3 h-3" />
            {label}
        </a>
    );
}