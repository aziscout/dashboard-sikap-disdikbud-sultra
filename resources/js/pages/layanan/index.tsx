import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Mail, Search, User } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Layanan',
        href: '/layanan',
    },
];

interface Layanan {
    id: number;
    judul: string;
    nama_pengirim: string;
    email_pengirim: string;
    kode_tracking: string;
    status: 'Diterima' | 'Diproses' | 'Selesai' | 'Ditolak';
    created_at: string;
    bidang: string;
}

interface PageProps {
    auth: any;
    layanans: Layanan[];
}

export default function index() {
    const { auth, layanans } = usePage<PageProps>().props;

    const [filterStatus, setFilterStatus] = useState<'Semua' | 'Diterima' | 'Diproses' | 'Selesai' | 'Ditolak'>('Semua');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLayanan = useMemo(() => {
        let filtered = layanans || [];

        // Filter by status
        if (filterStatus !== 'Semua') {
            filtered = filtered.filter((l) => l.status === filterStatus);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (l) =>
                    l.judul.toLowerCase().includes(query) ||
                    l.nama_pengirim.toLowerCase().includes(query) ||
                    l.email_pengirim.toLowerCase().includes(query) ||
                    l.kode_tracking.toLowerCase().includes(query) ||
                    l.bidang.toLowerCase().includes(query),
            );
        }

        return filtered;
    }, [layanans, filterStatus, searchQuery]);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Diterima':
                return 'bg-blue-100 text-blue-800 border-blue-200'; // Biru
            case 'Diproses':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Kuning
            case 'Selesai':
                return 'bg-green-100 text-green-800 border-green-200'; // Hijau
            case 'Ditolak':
                return 'bg-red-100 text-red-800 border-red-200'; // Merah
            default:
                return 'bg-black-100 text-black-800 border-black-200';
        }
    };

    const handleDetail = (id: number) => {
        router.visit(`/layanan/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Layanan" />
            <div className="container mx-auto space-y-6 p-6">
                {/* Header Compact - Overview dan Filter dalam satu baris */}
                <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Manajemen Layanan</h1>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-muted-foreground">Total: {layanans.length}</span>
                            <div className="flex flex-wrap gap-3">
                                <Badge variant="default" className="border-blue-200 bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                    Diterima: {layanans.filter((l) => l.status === 'Diterima').length}
                                </Badge>
                                <Badge variant="secondary" className="border-yellow-200 bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                                    Diproses: {layanans.filter((l) => l.status === 'Diproses').length}
                                </Badge>
                                <Badge variant="destructive" className="border-green-200 bg-green-100 px-2 py-1 text-xs text-green-800">
                                    Selesai: {layanans.filter((l) => l.status === 'Selesai').length}
                                </Badge>
                                <Badge variant="outline" className="border-red-200 bg-red-100 px-2 py-1 text-xs text-red-800">
                                    Ditolak: {layanans.filter((l) => l.status === 'Ditolak').length}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Search dan Filter dalam satu baris */}
                    <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari laporan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-9 pl-8"
                            />
                        </div>
                        <div className="w-full sm:w-36">
                            <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val as typeof filterStatus)}>
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Semua">Semua Status</SelectItem>
                                    <SelectItem value="Diterima">Diterima</SelectItem>
                                    <SelectItem value="Diproses">Diproses</SelectItem>
                                    <SelectItem value="Selesai">Selesai</SelectItem>
                                    <SelectItem value="Ditolak">Ditolak</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {filteredLayanan.length === 0 ? (
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center text-muted-foreground">
                                <p className="font-medium">Tidak ada laporan</p>
                                <p className="mt-1 text-sm">
                                    {searchQuery || filterStatus !== 'Semua'
                                        ? 'Coba ubah filter atau kata kunci pencarian'
                                        : 'Belum ada laporan yang masuk'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Judul Laporan</TableHead>
                                        <TableHead>Pengirim</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Tracking</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Waktu/Tanggal</TableHead>
                                        <TableHead className="text-center">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLayanan.map((l) => (
                                        <TableRow key={l.id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">
                                                <div className="max-w-[200px] truncate" title={l.judul}>
                                                    {l.judul}
                                                </div>
                                                <div className="mt-1 text-xs text-muted-foreground capitalize">
                                                    {l.bidang
                                                        .split('_')
                                                        .map((item) => {
                                                            if (item.length === 3) {
                                                                return item.toUpperCase();
                                                            }
                                                            return item;
                                                        })
                                                        .join(' ')}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <User className="h-3 w-3 text-muted-foreground" />
                                                    {l.nama_pengirim}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                                    <span className="max-w-[120px] truncate" title={l.email_pengirim}>
                                                        {l.email_pengirim}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <code className="rounded bg-muted px-2 py-1 font-mono text-xs">{l.kode_tracking}</code>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${getStatusVariant(l.status)} text-xs`}>{l.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(l.created_at).toLocaleTimeString('id-ID', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                    <div className="text-xs text-muted-foreground">
                                                        {new Date(l.created_at).toLocaleDateString('id-ID')}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center gap-3">
                                                    <Button
                                                        // size="lg"
                                                        variant="outline"
                                                        onClick={() => handleDetail(l.id)}
                                                        className="w-fit p-1.5"
                                                        title="Detail"
                                                    >
                                                        Detail
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
