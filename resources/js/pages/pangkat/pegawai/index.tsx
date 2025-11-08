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
    { title: 'Pegawai', href: '/pangkat/pegawai' },
];

interface Pegawai {
    id: number;
    nama: string;
    email: string;
    jenis_kelamin: string;
    alamat: string;
    status: string;
    tmt_golongan: string;
    is_active: boolean;
    created_at: string;
}

interface PageProps {
    flash: { message?: string };
    pegawai: Pegawai[];
}

export default function Index() {
    const { pegawai, flash } = usePage().props as unknown as PageProps;
    const [sortOrder, setSortOrder] = useState<'terbaru' | 'terlama'>('terbaru');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPegawai = useMemo(() => {
        return [...pegawai]
            .filter((item) =>
            item.nama.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'terbaru' ? dateB - dateA : dateA - dateB;
        });
    }, [pegawai, sortOrder, searchQuery]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Data Pegawai" />

            <div className="container mx-auto p-6 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h1
                    className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 
                    bg-clip-text text-transparent tracking-tight"
                    >
                    Daftar Pegawai
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
                        <TableHead>TMT</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPegawai.length > 0 ? (
                        filteredPegawai.map((item, index) => (
                            <TableRow
                            key={item.id}
                            className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/40 transition-all"
                            >
                            <TableCell className="text-center">{index + 1}</TableCell>
                            <TableCell className="font-medium">{item.nama}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell className="capitalize">
                                {item.jenis_kelamin}
                            </TableCell>
                            <TableCell className="capitalize">
                                {item.alamat}
                            </TableCell>
                            <TableCell className="capitalize">
                                {item.tmt_golongan}
                            </TableCell>
                            <TableCell>
                                <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    item.status === 'Siap'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                                }`}
                                >
                                {item.status}
                                </span>
                            </TableCell>
                            <TableCell>
                                {item.is_active ? (
                                <Link
                                    href={route('pegawai.show', item.id)}
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
                                ) : (
                                <Button
                                    disabled
                                    className="bg-gray-300 text-gray-600 cursor-not-allowed"
                                >
                                    <Eye />
                                </Button>
                                )}
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
            </div>
        </AppLayout>
    );
}
