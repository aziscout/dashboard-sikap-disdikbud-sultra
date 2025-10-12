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
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { CalendarDays, FileText, ListFilterPlus, Megaphone } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Laporan Kegiatan',
    href: '/laporan-kegiatan',
  },
];

interface LaporanKegiatan {
  id: number;
  judul: string;
  deskripsi: string;
  lokasi: string;
  penyelenggara: string;
  file?: string;
  category?: string; // 🔹 new filter type (foto/video)
  created_at: string;
  updated_at: string;
}

interface PageProps {
  flash: { message?: string };
  laporan_kegiatan: LaporanKegiatan[];
}

export default function Index() {
  const [sortOrder, setSortOrder] = useState<'terbaru' | 'terlama'>('terbaru');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'foto' | 'video'>('all');

  const { laporan_kegiatan, flash } = usePage().props as unknown as PageProps;
  const { processing, delete: destroy } = useForm();

  const handleDelete = (id: number, judul: string) => {
    if (!confirm(`Apakah anda yakin ingin menghapus "${judul}"?`)) return;
    destroy(route('laporan-kegiatan.destroy', id));
  };

  const handleEdit = (id: number) => {
    router.visit(route('laporan-kegiatan.edit', id));
  };

  // 🔹 Search + Filter + Sort Logic
 const filteredData = useMemo(() => {
  return [...laporan_kegiatan]
    .filter((item) =>
      item.judul?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((item) => {
      if (categoryFilter === 'all') return true;

      const file = item.file?.toLowerCase() || '';
      const category = item.category?.toLowerCase() || '';

      // Fallback detection based on file extension (in case category is missing)
      const isFoto = /\.(jpg|jpeg|png|gif|svg|webp|bmp|tiff)$/.test(file);
      const isVideo = /\.(mp4|mov|avi)$/.test(file);

      const actualCategory = category || (isFoto ? 'foto' : isVideo ? 'video' : '');

      return actualCategory === categoryFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'terbaru' ? dateB - dateA : dateA - dateB;
    });
}, [laporan_kegiatan, sortOrder, searchQuery, categoryFilter]);
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
          <Link href={route('laporan-kegiatan.create')}>
            <Button>Tambah</Button>
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

          {/* 📷 Category Filter (Foto/Video) */}
          <DropdownMenu>
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
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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

      {/* Card Grid */}
      <div className="m-4">
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredData.map((item) => (
              <article
                key={item.id}
                className="flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-background shadow-sm transition hover:shadow-lg dark:hover:bg-sidebar"
              >
                <div className="flex flex-grow flex-col p-4">
                  <h2 className="mb-2 line-clamp-2 text-lg font-bold text-gray-800 dark:text-gray-100 capitalize">
                    {item.judul}
                  </h2>

                  <p className="mb-1 text-sm text-gray-600 dark:text-gray-300">
                    <strong>Penyelenggara:</strong> {item.penyelenggara}
                  </p>
                  <p className="mb-1 text-sm text-gray-600 dark:text-gray-300">
                    <strong>Lokasi:</strong> {item.lokasi}
                  </p>
                  {item.category && (
                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-300">
                      <strong>Kategori:</strong> {item.category}
                    </p>
                  )}
                  <p className="mb-3 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                    {item.deskripsi}
                  </p>

                  {/* File (Foto/Video) */}
                  {item.file && (
                    <a
                      href={item.file.startsWith('http') ? item.file : `/storage/${item.file}`}
                      target="_blank"
                      className="mt-2 flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      {item.category === 'video' ? 'Lihat Video' : 'Lihat File'}
                    </a>
                  )}

                  {/* Date */}
                  <p className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CalendarDays className="h-4 w-4" />
                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>

                  {/* Actions */}
                  <div className="mt-auto flex gap-2 pt-3">
                    <Button
                      onClick={() => handleEdit(item.id)}
                      className="flex-1 bg-blue-950 hover:bg-blue-900"
                    >
                      Ubah
                    </Button>
                    <Button
                      disabled={processing}
                      onClick={() => handleDelete(item.id, item.judul)}
                      className="flex-1 bg-red-600 hover:bg-red-500"
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 text-center text-gray-500">
            <p className="mb-4 capitalize">Belum ada laporan kegiatan</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
