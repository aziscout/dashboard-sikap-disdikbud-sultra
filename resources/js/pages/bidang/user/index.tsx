import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ListFilterPlus, Megaphone, Plus, SquarePen, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bidang',
        href: '/bidang/user',
    },
];

interface UserBidang {
    id: number;
    name: string;
    role: string;
    email: string;
    password: string;
    created_at: string;
}

interface PageProps {
    flash: { message?: string};
    bidang: UserBidang[];
}

export default function Index() {
    const [sortOrder, setSortOrder] = useState<'terbaru' | 'terlama'>('terbaru');

    const [searchQuery, setSearchQuery] = useState('');

    const [userFilter, setUserFilter] = useState<'semua bidang' | 'Bidang Pembinaan SMA' | 'Bidang Pembinaan SMK' | 'Bidang Pembinaan PK-LK' | 'Bidang GTK' | 'Bidang Perencanaan dan Penganggaran' | 'Bidang Kebudayaan'>('semua bidang');
    
    const { bidang, flash } = usePage().props as unknown as PageProps;
    const { processing, delete: destroy } = useForm();

    const filteredUserBidang = useMemo(() => {
        return [...bidang]
        .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter((item) =>
            userFilter === 'semua bidang'
            ? true
            : item.name?.trim().toLowerCase().includes(userFilter.toLowerCase())
        )
        .sort((a,b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'terbaru' ? dateB - dateA : dateA -dateB;
        });
    }, [bidang, sortOrder, searchQuery, userFilter]);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUserBidang, setSelectedUserBidang] = useState<{ id:number; name:string} | null>(null);

    const handleOpenDialog = (id:number, name:string) => {
        setSelectedUserBidang({id, name});
        setOpenDialog(true);
    };

    const handleConfirmDelete = () => {
        if (selectedUserBidang) {
            destroy(route("user.destroy", selectedUserBidang.id));
        }
        setOpenDialog(false);
    };
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bidang" />
            <div className="m-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-semibold">Daftar User Bidang</h1>
                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    {/* 🔍 Search */}
                    <Input
                        placeholder="Cari user bidang..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-64"
                    />

                    {/* ➕ Tambah */}
                    <Link href={route('user.create')}>
                        <Button>
                            <Plus /> Tambah
                        </Button>
                    </Link>

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

                    {/* 🏫 Instansi Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <ListFilterPlus /> {userFilter}
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 capitalize">
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => setUserFilter('semua bidang')}>
                            Semua Instansi
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setUserFilter('Bidang Pembinaan SMA')}>
                            Bidang Pembinaan SMA
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setUserFilter('Bidang Pembinaan SMK')}>
                            Bidang Pembinaan SMK
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setUserFilter('Bidang Pembinaan PK-LK')}>
                            Bidang Pembinaan PK-LK
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setUserFilter('Bidang GTK')}>
                            Bidang GTK
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setUserFilter('Bidang Perencanaan dan Penganggaran')}>
                            Bidang Perencanaan dan Penganggaran
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setUserFilter('Bidang Kebudayaan')}>
                            Bidang Kebudayaan
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* 📷 Category Filter (Foto/Video/Dokumen) */}
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <ListFilterPlus /> {categoryFilter}
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 capitalize">
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                            Semua
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setCategoryFilter('foto')}>
                            Foto
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setCategoryFilter('video')}>
                            Video
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setCategoryFilter('dokumen')}>
                            Dokumen
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu> */}
                    </div>
            </div>
                <div className="w-full px-4 md:w-1/2">
                    {flash?.message && (
                        <Alert>
                            <Megaphone className="h-4 w-4" />
                            <AlertTitle>Notifikasi!</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <div className="mt-4 overflow-hidden shadow-sm m-4">
                    <Table className="w-full">
                        <TableHeader>
                        <TableRow className="bg-muted">
                            <TableHead className="w-[60px] text-center">No</TableHead>
                            <TableHead>Nama Bidang</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-center w-[150px]">
                            Aksi
                            </TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {filteredUserBidang.length > 0 ? (
                            filteredUserBidang.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell className="text-center">
                                {index + 1}
                                </TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell className="capitalize">{item.role}</TableCell>
                                <TableCell className="flex justify-center gap-2">
                                <Link href={route("user.edit", item.id)}>
                                    <Button
                                    size="sm"
                                    className="bg-blue-950 hover:bg-blue-900 text-white"
                                    >
                                    <SquarePen className="w-4 h-4" />Ubah
                                    </Button>
                                </Link>
                                <Button
                                    size="sm"
                                    disabled={processing}
                                    onClick={() => handleOpenDialog(item.id, item.name)}
                                    className="bg-red-600 hover:bg-red-500 text-white"
                                >
                                    <Trash2 className="w-4 h-4" />Hapus
                                </Button>
                                </TableCell>
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell
                                colSpan={5}
                                className="text-center text-gray-500 py-4"
                            >
                                Tidak ada data bidang.
                            </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                    <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus{" "}
                    data ini ? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
        
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                    onClick={handleConfirmDelete}
                    className="bg-red-600 hover:bg-red-500 text-white"
                    >
                    Ya, Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}