import React, { useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {CalendarDays, ListFilterPlus, MapPin, Megaphone, Plus, SquarePen, Trash2, Video} from "lucide-react";
import { PageProps as InertiaPageProps, router } from "@inertiajs/core";
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
        title: "Berita",
        href: "/berita" 
    }
];

interface Media {
    id?: number;
    file?: string;
    type?: string;
}

interface Berita {
    id: number;
    judul: string;
    deskripsi: string;
    coverImage: string;
    medias?: {
        file: Media[];
    } | null;
    category: string;
    instansi: string;
    lokasi: string;
    penyelenggara: string;
    created_at: string;
    updated_at: string;
}

interface CustomPageProps {
    flash: { message?: string };
    berita: Berita[];
    filters: { search?: string; instansi?: string };
}

type PageProps = InertiaPageProps & CustomPageProps;

export default function Index() {
    const { berita, flash } = usePage<PageProps>().props;
    const { processing, delete: destroy } = useForm();

    // 🔹 State untuk search dan filter
    const [sortOrder, setSortOrder] = useState<"terbaru" | "terlama">("terbaru");
    const [searchQuery, setSearchQuery] = useState("");
    const [instansiFilter, setInstansiFilter] = useState<"semua instansi" | "SMA" | "SLB" | "SMK" | "Umum">("semua instansi");
    const [categoryFilter] = useState<"all" | "foto" | "video">("all");
    // const [categoryFilter, setCategoryFilter] = useState<"all" | "foto" | "video">("all");
    
    // const handleDelete = (id: number, judul: string) => {
    //     if (!confirm(`Apakah anda yakin ingin menghapus "${judul}"?`)) return;
    //     destroy(route("berita.destroy", id));
    // };

    const handleEdit = (id: number) => {
        router.visit(route("berita.edit", id));
    };

    const getCoverUrl = (item: Berita) => {
        const cover = item.coverImage;
        if (!cover) return "/images/default-cover.jpg";
        if (cover.startsWith("http") || cover.startsWith("https")) return cover;
        if (cover.includes("/")) {
        if (cover.startsWith("/storage/")) return cover;
        return `/storage/${cover}`;
        }
        return `/storage/berita/cover/${cover}`;
    };

  // 🔹 Filtering + Sorting + Search
    const filteredBerita = useMemo(() => {
        return [...berita]
        .filter((item) => {
            if (!searchQuery) return true;

            const q = searchQuery.toLowerCase();

            const createdAt = new Date(item.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            }).toLowerCase();

            const updatedAt = new Date(item.updated_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            }).toLowerCase();

            return (
                item.judul.toLowerCase().includes(q) ||
                item.deskripsi.toLowerCase().includes(q) ||
                item.lokasi?.toLowerCase().includes(q) ||
                createdAt.includes(q) ||
                updatedAt.includes(q)
            );
        })

        .filter((item) =>
            instansiFilter === "semua instansi"
            ? true
            : item.instansi?.trim().toLowerCase().includes(instansiFilter.toLowerCase())
        )
        .filter((item) =>
            categoryFilter === "all" ? true : item.category?.toLowerCase() === categoryFilter
        )
        .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === "terbaru" ? dateB - dateA : dateA - dateB;
        });
    }, [berita, sortOrder, searchQuery, instansiFilter, categoryFilter]);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBerita, setSelectedBerita] = useState<{ id: number; judul: string } | null>(null);

    const handleOpenDialog = (id: number, judul: string) => {
    setSelectedBerita({ id, judul });
    setOpenDialog(true);
    };

    const handleConfirmDelete = () => {
    if (selectedBerita) {
        destroy(route("berita.destroy", selectedBerita.id));
    }
    setOpenDialog(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Berita" />

        {/* Header with filter */}
        <div className="m-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-semibold">Daftar Berita</h1>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
            {/* Search Bar */}
            <Input
                placeholder="Cari judul berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64"
            />

            <Link href={route("berita.create")}>
                <Button>
                <Plus /> Tambah
                </Button>
            </Link>

            {/* Sort Filter */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <ListFilterPlus /> {sortOrder}
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 capitalize">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setSortOrder("terbaru")}>
                    Terbaru
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("terlama")}>
                    Terlama
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Instansi Filter */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <ListFilterPlus /> {instansiFilter || "Instansi"}
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 capitalize">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setInstansiFilter("semua instansi")}>
                    Semua Instansi
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setInstansiFilter("Umum")}>
                    Umum
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setInstansiFilter("SMA")}>
                    SMA
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setInstansiFilter("SMK")}>
                    SMK
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setInstansiFilter("SLB")}>
                    SLB
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Category Filter */}
            {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <ListFilterPlus /> {categoryFilter}
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 capitalize">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                    Semua
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("foto")}>
                    Foto
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("video")}>
                    Video
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu> */}
            </div>
        </div>

        {/* Flash Message */}
        <div className="w-full md:w-1/2 px-4">
            {flash?.message && (
            <Alert>
                <Megaphone className="h-4 w-4" />
                <AlertTitle>Notification!</AlertTitle>
                <AlertDescription>{flash.message}</AlertDescription>
            </Alert>
            )}
        </div>

        {/* Grid Card */}
        <div className="m-4">
            {filteredBerita && filteredBerita.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBerita.map((item) => (
                <article
                    key={item.id}
                    className="bg-white dark:bg-background rounded-2xl shadow-sm hover:shadow-lg dark:hover:bg-sidebar transition flex flex-col overflow-hidden"
                >
                    {/* Gambar */}
                    <a
                        href={getCoverUrl(item)}
                        target="_blank"
                        className="block"
                        >
                        <img
                            src={getCoverUrl(item)}
                            alt={item.judul}
                            className="w-full h-48 object-cover"
                        />
                    </a>

                    {/* Isi */}
                    <div className="p-4 flex flex-col flex-grow">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">
                            {item.judul}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-3 min-h-[60px]">
                            {item.deskripsi}
                        </p>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                            <strong>Penyelenggara:</strong> {item.penyelenggara}
                        </p>

                        {item.medias?.file && (() => {
                            const video = item.medias.file.find(
                                (m) => m.type === "video" && m.file
                            );
                            return video ? (
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 flex items-center gap-2">
                                <Video className="w-4 h-4" />
                                <a
                                    href={video.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {/* {video.file} */}
                                    Tonton video terkait
                                </a>
                                </p>
                            ) : null;
                            })()}

                        <div className="flex justify-between">
                            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2 mb-2">
                                <CalendarDays className="w-4 h-4" />
                                {new Date(item.updated_at ?? item.created_at).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                                <MapPin className="inline h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                                {item.instansi} - {item.lokasi}
                            </p>
                        </div>
                    {/* Aksi */}
                        <div className="mt-auto flex gap-2">
                            <Button
                                onClick={() => handleEdit(item.id)}
                                className="bg-blue-950 hover:bg-blue-900 text-white flex-1"
                            >
                                <SquarePen />Ubah
                            </Button>
                            <Button
                                disabled={processing}
                                onClick={() => handleOpenDialog(item.id, item.judul)}
                                className="bg-red-600 hover:bg-red-500 text-white flex-1"
                                >
                                <Trash2 />Hapus
                            </Button>
                        </div>
                    </div>
                </article>
                ))}
            </div>
            ) : (
            <div className="text-center text-gray-500 mt-10">
                <p className="mb-4">Belum ada berita</p>
            </div>
            )}
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
