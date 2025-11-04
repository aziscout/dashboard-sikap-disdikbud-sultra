import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, ListFilterPlus, Megaphone } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import { Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { 
        title: 'Riwayat', 
        href: '/pangkat/riwayat' 
    },
];

interface Riwayat {
    id: number;
    nama: string;
    email: string;
    jenis_kelamin: string;
    alamat: string;
    tmt_golongan: string;
    tanggal_naik_pangkat: string;
}

interface PageProps {
    flash?: { message?: string };
    riwayat: Riwayat[];
}

export default function RiwayatIndex() {
    const { riwayat, flash } = usePage().props as unknown as PageProps;
    const [sortOrder, setSortOrder] = useState<'terbaru' | 'terlama'>('terbaru');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = useMemo(() => {
        return [...riwayat]
        .filter((item) => item.nama.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            const dateA = new Date(a.tanggal_naik_pangkat.split('/').reverse().join('-')).getTime();
            const dateB = new Date(b.tanggal_naik_pangkat.split('/').reverse().join('-')).getTime();
            return sortOrder === 'terbaru' ? dateB - dateA : dateA - dateB;
        });
    }, [riwayat, sortOrder, searchQuery]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat" />

            <div className="m-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-semibold">Riwayat</h1>

                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <Input
                    placeholder="Cari nama pegawai..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-64"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <ListFilterPlus /> {sortOrder}
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40 capitalize">
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setSortOrder('terbaru')}>Terbaru</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortOrder('terlama')}>Terlama</DropdownMenuItem>
                    </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
            </div>

            {flash?.message && (
                <div className="w-full px-4 md:w-1/2">
                <Alert>
                    <Megaphone className="h-4 w-4" />
                    <AlertTitle>Notifikasi</AlertTitle>
                    <AlertDescription>{flash.message}</AlertDescription>
                </Alert>
                </div>
            )}

            <div className="mt-4 overflow-hidden shadow-sm m-4">
                <Table className="w-full">
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[60px] text-center">No</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Jenis Kelamin</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Tanggal Naik Pangkat</TableHead>
                    <TableHead>TMT</TableHead>
                    {/* <TableHead>Aksi</TableHead> */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                        <TableRow key={item.id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell className="font-medium">{item.nama}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell className="capitalize">{item.jenis_kelamin}</TableCell>
                        <TableCell className="capitalize">{item.alamat}</TableCell>
                        <TableCell>{item.tanggal_naik_pangkat}</TableCell>
                        <TableCell>{item.tmt_golongan}</TableCell>
                        <TableCell>
                            <Link href={route('pegawai.show', item.id)} title="Detail">
                                <Button className="bg-blue-500 hover:bg-blue-600 dark:text-white">
                                    <Eye />
                                </Button>
                            </Link>
                        </TableCell>
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={8} className="text-center text-gray-500 py-4">
                        Tidak ada data pegawai naik pangkat.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
