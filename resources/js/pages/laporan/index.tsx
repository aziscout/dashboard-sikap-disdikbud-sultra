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
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BookOpen, CalendarDays, ListFilterPlus, MapPin, Megaphone, Plus, SquarePen, Trash2, Users } from 'lucide-react';
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
    title: 'Laporan Kegiatan',
    href: '/laporan',
  },
];

interface Laporan {
  id: number;
  judul: string;
  deskripsi: string;
  peserta: number | null;
  category: string;
  instansi: string;
  lokasi: string;
  penyelenggara: string;
  dokumens: {
    id: number;
    dokumen: string;
  } | null;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  flash: { message?: string };
  laporan: Laporan[];
}

export default function Index() {
  const [sortOrder, setSortOrder] = useState<'terbaru' | 'terlama'>('terbaru');
  const [searchQuery, setSearchQuery] = useState('');
  const [instansiFilter, setInstansiFilter] = useState<'all' | 'SMA' | 'SLB' | 'SMK'>('all');
  const [categoryFilter] = useState<'all' | 'foto' | 'video' | 'dokumen'>('all');

  const { laporan, flash } = usePage().props as unknown as PageProps;
  const { processing, delete: destroy } = useForm();

  // const handleDelete = (id: number, judul: string) => {
  //   if (!confirm(`Apakah anda yakin ingin menghapus "${judul}"?`)) return;
  //   destroy(route('laporan.destroy', id));
  // };

  const filteredLaporan = useMemo(() => {
    return [...laporan]
      .filter((item) => item.judul.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter((item) =>
        instansiFilter === 'all'
          ? true
          : item.instansi?.trim().toLowerCase().includes(instansiFilter.toLowerCase())
      )
      .filter((item) =>
        categoryFilter === 'all' ? true : item.category?.toLowerCase() === categoryFilter
      )
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === 'terbaru' ? dateB - dateA : dateA - dateB;
      });
  }, [laporan, sortOrder, searchQuery, instansiFilter, categoryFilter]);

  const [openDialog, setOpenDialog] = useState(false);
    const [selectedLaporan, setSelectedLaporan] = useState<{ id: number; judul: string } | null>(null);
  
    const handleOpenDialog = (id: number, judul: string) => {
      setSelectedLaporan({ id, judul });
      setOpenDialog(true);
    };
  
    const handleConfirmDelete = () => {
      if (selectedLaporan) {
        destroy(route("laporan.destroy", selectedLaporan.id));
      }
      setOpenDialog(false);
    };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Laporan Kegiatan" />

      {/* Header Section */}
      <div className="m-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Daftar Laporan Kegiatan</h1>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          {/* 🔍 Search */}
          <Input
            placeholder="Cari judul laporan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64"
          />

          {/* ➕ Tambah */}
          <Link href={route('laporan.create')}>
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
                <ListFilterPlus /> {instansiFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 capitalize">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setInstansiFilter('all')}>
                  Semua
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setInstansiFilter('SMA')}>
                  SMA
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setInstansiFilter('SLB')}>
                  SLB
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setInstansiFilter('SMK')}>
                  SMK
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

      {/* Flash Message */}
      <div className="w-full px-4 md:w-1/2">
        {flash?.message && (
          <Alert>
            <Megaphone className="h-4 w-4" />
            <AlertTitle>Notification!</AlertTitle>
            <AlertDescription>{flash.message}</AlertDescription>
          </Alert>
        )}
      </div>

      {filteredLaporan.length > 0 && (
                <div className="m-4 space-y-4">
                    {filteredLaporan.map((laporan) => (
                        <div
                            key={laporan.id}
                            className="bg-white dark:bg-background rounded-2xl shadow-sm p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between dark:hover:bg-sidebar transition"
                        >
                            {/* Info Laporan */}
                            <div className="space-y-2 flex-1">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                    <BookOpen />
                                    {laporan.judul}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-5">{laporan.deskripsi}</p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 items-center font-bold">
                                    Penyelenggara: {laporan.penyelenggara}
                                  </p>
                                <div className="flex items-center gap-4">
                                  <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4" />
                                    {new Date(laporan.created_at).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </p>
                                  <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    {laporan.instansi} - {laporan.lokasi}
                                  </p>
                                  <p className="text-gray-600 dark:text-gray-300 flex gap-2 text-sm items-center">
                                    <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    {laporan.peserta} Peserta
                                  </p>
                                </div>
                            </div>

                            {/* Aksi */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <Link href={route("laporan.edit", laporan.id)}>
                                    <Button className="bg-blue-950 hover:bg-blue-900 text-white w-full sm:w-auto">
                                        <SquarePen /> Ubah
                                    </Button>
                                </Link>
                                <Button
                                  disabled={processing}
                                  onClick={() => handleOpenDialog(laporan.id, laporan.judul)}
                                  className="bg-red-600 hover:bg-red-500 text-white flex-1"
                                >
                                  <Trash2 />Hapus
                                </Button>
                            </div>
                        </div>
                    ))}
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
