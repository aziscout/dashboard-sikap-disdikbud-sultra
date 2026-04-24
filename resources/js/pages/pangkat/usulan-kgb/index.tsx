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
import { Eye, ListFilterPlus, Search, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usulan Kenaikan Gaji Berkala', href: '/pangkat/usulan-kgb' },
];

interface DataDiri {
    gaji_pokok: number;
    kgb_terakhir: string;
}

interface Pegawai {
    id: number;
    nip: string;
    nama: string;
    nomor: string;
    email: string;
    unit_kerja: string;
    created_at: string;
    data_diri?: DataDiri;
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
            (item.unit_kerja ?? '').toLowerCase().includes(searchQuery.toLowerCase()) || 
            (item.nip ?? '').includes(searchQuery)
        )
        .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'Terbaru' ? dateB - dateA : dateA - dateB;
        });
    }, [pegawai.data, sortOrder, searchQuery]);

    const isDataLengkap = (p: Pegawai): boolean => {
        const profileKeys: (keyof Pegawai)[] = ['nama', 'nip', 'nomor', 'email', 'unit_kerja'];
        const profileOk = profileKeys.every(key => p[key] !== null && p[key] !== '');
        
        if (!p.data_diri) return false;

        const dataDiriOk = p.data_diri.gaji_pokok !== null && p.data_diri.kgb_terakhir !== null;

        return profileOk && dataDiriOk;
    };

    const formatRupiah = (number: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(number));
    };

    const formatTanggalIndo = (dateString: string | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usulan Gaji Berkala" />

            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 md:p-8 space-y-6">
                
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                            Usulan <span className="text-indigo-500">KGB</span>
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">
                            Monitoring usulan kenaikan gaji berkala pegawai
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                placeholder="Cari nama, NIP, atau unit..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-72 pl-10 border-indigo-100 dark:border-indigo-900 focus:ring-indigo-500/20 rounded-xl bg-white dark:bg-slate-900 shadow-sm"
                            />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded-xl border-indigo-100 dark:border-indigo-900 text-indigo-600 gap-2 hover:bg-indigo-50 bg-white dark:bg-slate-900">
                                    <ListFilterPlus className="w-4 h-4" /> {sortOrder}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-xl border-indigo-50 dark:border-indigo-900">
                                <DropdownMenuItem onClick={() => setSortOrder('Terbaru')} className="cursor-pointer">Terbaru</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOrder('Terlama')} className="cursor-pointer">Terlama</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-900 shadow-xl shadow-indigo-500/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-indigo-50/40 dark:bg-indigo-900/20">
                                <TableRow className="hover:bg-transparent border-b border-indigo-100 dark:border-indigo-900">
                                    <TableHead className="w-[50px] text-center font-bold text-indigo-600 uppercase text-[10px] tracking-widest">No</TableHead>
                                    <TableHead className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">Nama</TableHead>
                                    <TableHead className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">NIP</TableHead>
                                    <TableHead className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">Nomor</TableHead>
                                    <TableHead className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">Email</TableHead>
                                    <TableHead className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">Unit Kerja</TableHead>
                                    <TableHead className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">Gaji Pokok</TableHead>
                                    <TableHead className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">KGB Terakhir</TableHead>
                                    <TableHead className="text-center font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredAndSortedPegawai.length > 0 ? (
                                    filteredAndSortedPegawai.map((item, index) => (
                                        <TableRow key={item.id} className="group hover:bg-indigo-50/30 transition-colors border-indigo-50 dark:border-indigo-900/30">
                                            <TableCell className="text-center font-mono text-[10px] text-slate-400">
                                                {(pegawai.current_page - 1) * pegawai.per_page + (index + 1)}
                                            </TableCell>
                                            
                                            <TableCell className="font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                                                {item.nama}
                                            </TableCell>

                                            <TableCell className="font-mono text-slate-500 tracking-tighter">
                                                {item.nip}
                                            </TableCell>

                                            <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                                                {item.nomor ?? '-'}
                                            </TableCell>

                                            <TableCell className="text-xs text-slate-500">
                                                {item.email ?? '-'}
                                            </TableCell>

                                            <TableCell className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                                {item.unit_kerja ?? '-'}
                                            </TableCell>

                                            <TableCell>
                                                <span className="inline-flex items-center px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 text-[11px] font-bold whitespace-nowrap">
                                                    {item.data_diri?.gaji_pokok ? formatRupiah(item.data_diri.gaji_pokok) : '-'}
                                                </span>
                                            </TableCell>

                                            <TableCell className="text-xs text-slate-500 font-medium whitespace-nowrap">
                                                {item.data_diri?.kgb_terakhir ? formatTanggalIndo(item.data_diri.kgb_terakhir) : '-'}
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <div className="flex justify-center items-center">
                                                    {isDataLengkap(item) ? (
                                                        <Link href={route('pangkat.usulan-kgb.status', item.id)}>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all shadow-sm active:scale-95">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                    ) : (
                                                        <div title="Lengkapi Profil dan Data Diri">
                                                            <Button disabled size="icon" variant="ghost" className="h-8 w-8 opacity-20 cursor-not-allowed">
                                                                <XCircle className="w-4 h-4 text-slate-400" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-32 text-center text-slate-400 italic">
                                            Tidak ada data usulan kenaikan gaji berkala.
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
                            className={`h-8 min-w-[32px] rounded-xl text-xs font-bold transition-all ${
                                link.active 
                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                                    : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}