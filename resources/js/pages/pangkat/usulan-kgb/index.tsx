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
            item.unit_kerja.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.nip.includes(searchQuery)
        )
        .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'Terbaru' ? dateB - dateA : dateA - dateB;
        });
    }, [pegawai.data, sortOrder, searchQuery]);

    const isDataLengkap = (p: Pegawai): boolean => {
        const profileKeys: (keyof Pegawai)[] = [
            'nama', 'nip', 'nomor', 'email', 'unit_kerja'
        ];
        const profileOk = profileKeys.every(key => p[key] !== null && p[key] !== '');

        if (!p.data_diri) return false;
        const dataDiriKeys: (keyof DataDiri)[] = [
            'gaji_pokok', 'kgb_terakhir'
        ];
        const dataDiriOk = dataDiriKeys.every(key => 
            p.data_diri![key] !== null && p.data_diri![key] !== ''
        );

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
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Usulan Gaji Berkala" />

        <div className="container mx-auto p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h1
                className="text-2xl font-bold 
                bg-clip-text text-indigo-500 tracking-tight"
            >
                Usulan Kenaikan Gaji Berkala
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
                            <TableHead>Nomor</TableHead>
                            <TableHead>email</TableHead>
                            <TableHead>Unit Kerja</TableHead>
                            <TableHead>Gaji Pokok</TableHead>
                            <TableHead className="w-[120px]">KGB Terakhir</TableHead>
                            <TableHead>Detail</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        { filteredAndSortedPegawai.length > 0 ? (
                        filteredAndSortedPegawai.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell className="text-center">
                                    {(pegawai.current_page - 1) * pegawai.per_page + (index + 1)}
                                </TableCell>
                                <TableCell>{item.nama}</TableCell>
                            <TableCell>{item.nip}</TableCell>
                                <TableCell>{item.nomor ?? '-'}</TableCell>
                                <TableCell>{item.email ?? '-'}</TableCell>
                                <TableCell>{item.unit_kerja ?? '-'}</TableCell>
                                <TableCell>
                                    {item.data_diri?.gaji_pokok 
                                        ? formatRupiah(item.data_diri.gaji_pokok) 
                                        : '-'}
                                </TableCell>
                                <TableCell>
                                    {item.data_diri?.kgb_terakhir 
                                        ? formatTanggalIndo(item.data_diri.kgb_terakhir) 
                                        : '-'}
                                </TableCell>
                                <TableCell className="text-center">
                                    {isDataLengkap(item) ? (
                                        <Link href={route('pangkat.usulan-kgb.status', item.id)}>
                                            <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button 
                                            disabled 
                                            className="bg-gray-300 dark:bg-gray-700 text-gray-500"
                                            title="Lengkapi Profile dan Data Diri di menu Pegawai untuk mengaktifkan tombol ini"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={9} className="py-6 text-center text-gray-500">
                                Tidak ada data usulan kenaikan gaji berkala.
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