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
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CalendarDays, FileText, ListFilterPlus, Megaphone, Plus, Scale, SquarePen, Trash2 } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { useMemo, useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produk Hukum',
        href: '/produk-hukum',
    },
];

const categories = [
    { value: "perda", label: "Peraturan Daerah" },
    { value: "keputusan", label: "Keputusan" },
    { value: "surat-edaran", label: "Surat Edaran" },
    { value: "instruksi", label: "Instruksi" },
    { value: "pedoman", label: "Pedoman" },
    { value: "peraturan", label: "Peraturan Kepala Dinas" },
];

interface ProdukHukum {
    id: number;
    judul: string;
    deskripsi: string;
    category?: string;
    dokumen: string;
    created_at: string;
}

interface CustomPageProps {
    flash: {
        message?: string;
    };
    produk_hukum: ProdukHukum[];
}

type PageProps = InertiaPageProps & CustomPageProps;

export default function Index() {
    const [sortOrder, setSortOrder] = useState<'terbaru' | 'terlama'>('terbaru');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const { produk_hukum, flash } = usePage<PageProps>().props;

    const { processing, delete: destroy } = useForm();

    // const handleDelete = (id: number, judul: string) => {
    //     if (confirm(`Apakah anda yakin ingin menghapus - ${id}. ${judul}`)) {
    //         destroy(`/produk-hukum/${id}`);
    //     }
    // };

    // 🔹 Search + Filter + Sort Logic
    const filteredData = useMemo(() => {
        return [...produk_hukum]
            .filter((item) =>
                item.judul?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .filter((item) => {
                if (categoryFilter === 'all') return true;
                return item.category === categoryFilter;
            })
            .sort((a, b) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return sortOrder === 'terbaru' ? dateB - dateA : dateA - dateB;
            });
    }, [produk_hukum, sortOrder, searchQuery, categoryFilter]);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProdukHukum, setSelectedProdukHukum] = useState<{ id: number; judul: string } | null>(null);

    const handleOpenDialog = (id: number, judul: string) => {
    setSelectedProdukHukum({ id, judul });
    setOpenDialog(true);
    };

    const handleConfirmDelete = () => {
    if (selectedProdukHukum) {
        destroy(route("produk-hukum.destroy", selectedProdukHukum.id));
    }
    setOpenDialog(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produk Hukum" />

            {/* Header Section */}
            <div className="m-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-semibold">Daftar Produk Hukum</h1>
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    {/* 🔍 Search */}
                    <Input
                        placeholder="Cari judul produk hukum..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-64"
                    />

                    {/* ➕ Tambah */}
                    <Link href={route('produk-hukum.create')}>
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

                    {/* 📚 Category Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <ListFilterPlus /> 
                                {categoryFilter === 'all' 
                                    ? 'Semua Kategori' 
                                    : categories.find(c => c.value === categoryFilter)?.label}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                                    Semua Kategori
                                </DropdownMenuItem>
                                {categories.map((category) => (
                                    <DropdownMenuItem 
                                        key={category.value}
                                        onClick={() => setCategoryFilter(category.value)}
                                    >
                                        {category.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Flash Message */}
            <div className="w-full md:w-1/2 px-4">
                {flash?.message && (
                    <Alert>
                        <Megaphone className="h-4 w-4" />
                        <AlertTitle>Notifikasi!</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Daftar Produk Hukum */}
            {filteredData.length > 0 ? (
                <div className="m-4 space-y-4">
                    {filteredData.map((produk) => (
                        <div
                            key={produk.id}
                            className="bg-white dark:bg-background rounded-2xl shadow-sm p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between dark:hover:bg-sidebar transition"
                        >
                            {/* Info Produk */}
                            <div className="space-y-2 flex-1">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                    <Scale />
                                    {produk.judul}
                                </h2>
                                {produk.category && (
                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                        {categories.find(c => c.value === produk.category)?.label}
                                    </p>
                                )}

                                <p className="text-gray-600 dark:text-gray-300">{produk.deskripsi}</p>

                                <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2 mt-2">
                                    <CalendarDays className='w-4 h-4'/>
                                    {new Date(produk.created_at).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                                {produk.dokumen ? (
                                    <a
                                        href={`/storage/${produk.dokumen}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm flex gap-1 w-30"
                                    >
                                        <FileText className='w-4 h-4'/>Lihat Dokumen
                                    </a>
                                    ) : (
                                    <p className="text-gray-400 text-sm mt-2">Tidak ada dokumen</p>
                                )}
                            </div>

                            {/* Aksi */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <Link href={route("produk-hukum.edit", produk.id)}>
                                    <Button className="bg-blue-950 text-white  hover:bg-blue-900 w-full sm:w-auto">
                                        <SquarePen /> Ubah
                                    </Button>
                                </Link>
                                <Button
                                    disabled={processing}
                                    onClick={() => handleOpenDialog(produk.id, produk.judul)}
                                    className="bg-red-600 hover:bg-red-500 text-white flex-1"
                                >
                                    <Trash2 />Hapus
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="m-4 text-center text-gray-500">
                    <p className="mb-4">
                        {searchQuery || categoryFilter !== 'all' 
                            ? 'Tidak ada produk hukum yang sesuai dengan pencarian'
                            : 'Belum ada produk hukum'}
                    </p>
                </div>
            )}
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
