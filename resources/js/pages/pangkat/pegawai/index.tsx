import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head,  Link,  usePage } from '@inertiajs/react';
import {  Eye, ListFilterPlus, Megaphone } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pegawai',
        href: '/pangkat/pegawai',
    },
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
        .filter((item) => item.nama.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'terbaru' ? dateB - dateA : dateA - dateB;
        });
    }, [pegawai, sortOrder, searchQuery]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Pegawai" />

            <div className="m-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-semibold">Daftar Pegawai</h1>

                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                {/* 🔍 Search */}
                <Input
                    placeholder="Cari nama pegawai..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-64"
                />

                {/* 🔽 Sort */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <ListFilterPlus /> {sortOrder}
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40 capitalize">
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

            <div className="w-full px-4 md:w-1/2">
                {flash?.message && (
                <Alert>
                    <Megaphone className="h-4 w-4" />
                    <AlertTitle>Notifikasi</AlertTitle>
                    <AlertDescription>{flash.message}</AlertDescription>
                </Alert>
                )}
            </div>

            <div className="mt-4 overflow-hidden shadow-sm m-4">
                <Table className="w-full">
                <TableHeader>
                    <TableRow>
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
                        <TableRow key={item.id}>
                            <TableCell className="text-center">{index + 1}</TableCell>
                            <TableCell className="font-medium">{item.nama}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell className="capitalize">{item.jenis_kelamin}</TableCell>
                            <TableCell className='capitalize'>{item.alamat}</TableCell>
                            <TableCell className='capitalize'>{item.tmt_golongan}</TableCell>
                            <TableCell>
                                <span
                                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                                        item.status === 'Siap'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}
                                >
                                    {item.status}
                                </span>
                            </TableCell>
                            <TableCell>
                                    {item.is_active ? (
                                        <Link href={route('pegawai.show', item.id)} title="Detail">
                                            <Button className="bg-blue-500 hover:bg-blue-600">
                                                <Eye />
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button disabled className="bg-gray-300 text-gray-600 cursor-not-allowed">
                                            <Eye />
                                        </Button>
                                    )}
                                </TableCell>
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                        Tidak ada data pegawai.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
