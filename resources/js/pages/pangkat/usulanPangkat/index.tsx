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
        title: 'Usulan Pangkat',
        href: '/pangkat/usulanPangkat',
    },
];

interface Berkas {
    sk_cpns?: string;
    sk_pns?: string;
    sk_gaji_berkala?: string;
    sk_pangkat_terakhir?: string;
    sk_jabatan?: string;
}

interface Pegawai {
    id: number;
    nip: string;
    nama: string;
    nomor: string;
    created_at: string;
    berkas?: Berkas[];
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
    }, [pegawai,sortOrder, searchQuery]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Pegawai" />

            <div className="m-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-semibold">Usulan Pangkat</h1>

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
                            <TableHead className="text-center">NIP</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Nomor</TableHead>
                            <TableHead>SK PNS</TableHead>
                            <TableHead>SK CPNS</TableHead>
                            <TableHead>SK Gaji Berkala</TableHead>
                            <TableHead>SK Jabatan</TableHead>
                            <TableHead>SK Pangkat Terakhir</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredPegawai.length > 0 ? (
                        filteredPegawai.map((pegawai) => (
                            <TableRow key={pegawai.id}>
                            <TableCell>{pegawai.nip}</TableCell>
                            <TableCell className="capitalize">{pegawai.nama}</TableCell>
                            <TableCell>{pegawai.nomor}</TableCell>

                            {/* Berkas Mapping */}
                            <TableCell>
                                {pegawai.berkas?.[0]?.sk_pns ? (
                                <a
                                    href={`/storage/${pegawai.berkas[0].sk_pns}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button className="bg-blue-900 hover:bg-blue-800 text-white text-xs px-3">
                                    {pegawai.berkas[0].sk_pns.slice(0, 8)}...
                                    </Button>
                                </a>
                                ) : (
                                <span className="text-gray-400">-</span>
                                )}
                            </TableCell>

                            <TableCell>
                                {pegawai.berkas?.[0]?.sk_cpns ? (
                                <a
                                    href={`/storage/${pegawai.berkas[0].sk_cpns}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button className="bg-blue-900 hover:bg-blue-800 text-white text-xs px-3">
                                    {pegawai.berkas[0].sk_cpns.slice(0, 8)}...
                                    </Button>
                                </a>
                                ) : (
                                <span className="text-gray-400">-</span>
                                )}
                            </TableCell>

                            <TableCell>
                                {pegawai.berkas?.[0]?.sk_gaji_berkala ? (
                                <a
                                    href={`/storage/${pegawai.berkas[0].sk_gaji_berkala}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button className="bg-blue-900 hover:bg-blue-800 text-white text-xs px-3">
                                    {pegawai.berkas[0].sk_gaji_berkala.slice(0, 8)}...
                                    </Button>
                                </a>
                                ) : (
                                <span className="text-gray-400">-</span>
                                )}
                            </TableCell>

                            <TableCell>
                                {pegawai.berkas?.[0]?.sk_jabatan ? (
                                <a
                                    href={`/storage/${pegawai.berkas[0].sk_jabatan}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button className="bg-blue-900 hover:bg-blue-800 text-white text-xs px-3">
                                    {pegawai.berkas[0].sk_jabatan.slice(0, 8)}...
                                    </Button>
                                </a>
                                ) : (
                                <span className="text-gray-400">-</span>
                                )}
                            </TableCell>

                            <TableCell>
                                {pegawai.berkas?.[0]?.sk_pangkat_terakhir ? (
                                <a
                                    href={`/storage/${pegawai.berkas[0].sk_pangkat_terakhir}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button className="bg-blue-900 hover:bg-blue-800 text-white text-xs px-3">
                                    {pegawai.berkas[0].sk_pangkat_terakhir.slice(0, 8)}...
                                    </Button>
                                </a>
                                ) : (
                                <span className="text-gray-400">-</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <Link href={route('usulanPangkat.show', pegawai.id)} title='Detail'>
                                    <Button className='bg-blue-500 hover:bg-blue-600'>
                                        <Eye/>
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center text-gray-500 py-4">
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
