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
import { CalendarDays, FileText, ListFilterPlus, Megaphone, Plus, Shield, SquarePen, Trash2 } from 'lucide-react';
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
        title: 'PPID',
        href: '/ppid',
    },
];

const informasiOptions = [
    { value: "Berkala", label: "Berkala" },
    { value: "Setiap Saat", label: "Setiap Saat" },
    { value: "Serta Merta", label: "Serta Merta" },
    { value: "Dikecualikan", label: "Dikecualikan" },
];

interface Ppid {
    id: number;
    judul: string;
    tahun: string;
    informasi: string;
    dokumens: string;
    created_at: string;
}

interface CustomPageProps {
    flash: {
        message?: string;
        success?: string;
    };
    ppid_data: Ppid[];
}

type PageProps = InertiaPageProps & CustomPageProps;

export default function Index() {
    const [sortOrder, setSortOrder] = useState<'terbaru' | 'terlama'>('terbaru');
    const [searchQuery, setSearchQuery] = useState('');
    const [informasiFilter, setInformasiFilter] = useState<string>('all');

    const { ppid_data, flash } = usePage<PageProps>().props;

    const { processing, delete: destroy } = useForm();

    // 🔹 Search + Filter + Sort Logic
    const filteredData = useMemo(() => {
        return [...ppid_data]
            .filter((item) =>
                item.judul?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .filter((item) => {
                if (informasiFilter === 'all') return true;
                return item.informasi === informasiFilter;
            })
            .sort((a, b) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return sortOrder === 'terbaru' ? dateB - dateA : dateA - dateB;
            });
    }, [ppid_data, sortOrder, searchQuery, informasiFilter]);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPpid, setSelectedPpid] = useState<{ id: number; judul: string } | null>(null);

    const handleOpenDialog = (id: number, judul: string) => {
        setSelectedPpid({ id, judul });
        setOpenDialog(true);
    };

    const handleConfirmDelete = () => {
        if (selectedPpid) {
            destroy(route("ppid.destroy", selectedPpid.id));
        }
        setOpenDialog(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="PPID" />

            {/* Header Section */}
            <div className="m-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-semibold">Daftar PPID</h1>
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    {/* 🔍 Search */}
                    <Input
                        placeholder="Cari judul PPID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-64"
                    />

                    {/* ➕ Tambah */}
                    <Link href={route('ppid.create')}>
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

                    {/* 📚 Informasi Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <ListFilterPlus />
                                {informasiFilter === 'all'
                                    ? 'Semua Informasi'
                                    : informasiOptions.find(i => i.value === informasiFilter)?.label}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => setInformasiFilter('all')}>
                                    Semua Informasi
                                </DropdownMenuItem>
                                {informasiOptions.map((info) => (
                                    <DropdownMenuItem
                                        key={info.value}
                                        onClick={() => setInformasiFilter(info.value)}
                                    >
                                        {info.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Flash Message */}
            <div className="w-full md:w-1/2 px-4">
                {(flash?.message || flash?.success) && (
                    <Alert>
                        <Megaphone className="h-4 w-4" />
                        <AlertTitle>Notifikasi!</AlertTitle>
                        <AlertDescription>{flash.message || flash.success}</AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Daftar PPID */}
            {filteredData.length > 0 ? (
                <div className="m-4 space-y-4">
                    {filteredData.map((ppid) => (
                        <div
                            key={ppid.id}
                            className="bg-white dark:bg-background rounded-2xl shadow-sm p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between dark:hover:bg-sidebar transition"
                        >
                            {/* Info PPID */}
                            <div className="space-y-2 flex-1">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                    <Shield />
                                    {ppid.judul}
                                </h2>
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                    Tahun: {ppid.tahun}
                                </p>
                                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                    Informasi: {ppid.informasi}
                                </p>

                                <p className="text-gray-600 dark:text-gray-300">{/* No description */}</p>

                                <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2 mt-2">
                                    <CalendarDays className='w-4 h-4'/>
                                    {new Date(ppid.created_at).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                                {ppid.dokumens ? (
                                    <a
                                        href={`/storage/${ppid.dokumens}`}
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
                                <Link href={route("ppid.edit", ppid.id)}>
                                    <Button className="bg-blue-950 text-white hover:bg-blue-900 w-full sm:w-auto">
                                        <SquarePen /> Ubah
                                    </Button>
                                </Link>
                                <Button
                                    disabled={processing}
                                    onClick={() => handleOpenDialog(ppid.id, ppid.judul)}
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
                        {searchQuery || informasiFilter !== 'all'
                            ? 'Tidak ada PPID yang sesuai dengan pencarian'
                            : 'Belum ada PPID'}
                    </p>
                </div>
            )}
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertTitle>Konfirmasi Hapus</AlertTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus data PPID ini? Tindakan ini tidak dapat dibatalkan.
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
