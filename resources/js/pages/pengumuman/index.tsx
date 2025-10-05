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
import { CalendarDays, FileText, ListFilterPlus, MapPin, Megaphone } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Pengumuman',
    href: '/pengumuman',
  },
];

interface Pengumuman {
  id: number;
  judul: string;
  penyelenggara: string;
  lokasi: string;
  instansi: string;
  category: string;
  file?: string; // foto atau video
  created_at: string;
  updated_at: string;
}

interface PageProps {
  flash: { message?: string };
  pengumuman: Pengumuman[];
}

export default function Index() {
  const [sortOrder, setSortOrder] = useState<'terbaru' | 'terlama'>('terbaru');
  const [searchQuery, setSearchQuery] = useState('');
  const [instansiFilter, setInstansiFilter] = useState<'all' | 'SMA' | 'SLB' | 'SMK'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'foto' | 'video'>('all'); // 🔹 new filter

  const { pengumuman, flash } = usePage().props as unknown as PageProps;
  const { processing, delete: destroy } = useForm();

  const handleDelete = (id: number, judul: string) => {
    if (!confirm(`Apakah anda yakin ingin menghapus "${judul}"?`)) return;
    destroy(route('pengumuman.destroy', id));
  };

  const handleEdit = (id: number) => {
    router.visit(route('pengumuman.edit', id));
  };

  // Sorting + Filtering + Search
  const filteredPengumuman = useMemo(() => {
    return [...pengumuman]
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
  }, [pengumuman, sortOrder, searchQuery, instansiFilter, categoryFilter]);


  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pengumuman" />

      {/* Header with filter */}
      <div className="m-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Daftar Pengumuman</h1>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          {/* Search Bar */}
          <Input
            placeholder="Cari judul pengumuman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64"
          />

          <Link href={route('pengumuman.create')}>
            <Button>Tambah</Button>
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
                <DropdownMenuItem onClick={() => setSortOrder('terbaru')}>
                  Terbaru
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('terlama')}>
                  Terlama
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Instansi Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ListFilterPlus /> {instansiFilter ||  'Instansi'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 capitalize">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setInstansiFilter('all')}>
                  Semua Instansi
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

          {/* 🔹 Category Filter (Foto / Video) */}
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

      {/* Grid Cards */}
      <div className="m-4">
        {filteredPengumuman.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPengumuman.map((item) => (
              <article
                key={item.id}
                className="flex flex-col overflow-hidden rounded-2xl bg-white shadow transition hover:shadow-lg"
              >
                {/* Content */}
                <div className="flex flex-grow flex-col p-4">
                  <h2 className="mb-2 line-clamp-2 text-lg font-bold text-gray-800 capitalize">
                    {item.judul}
                  </h2>

                  <p className="mb-2 text-sm text-gray-600">
                    <strong>Penyelenggara:</strong> {item.penyelenggara}
                  </p>
                  <p className="mb-2 text-sm text-gray-600">
                    <MapPin className="mr-1 inline h-4 w-4 text-gray-500" />
                    {item.instansi} - {item.lokasi}
                  </p>
                  <p className="mb-2 text-sm text-gray-600">
                    <strong>Kategori:</strong> {item.category}
                  </p>

                  {/* File or Video */}
                  {item.file && (
                    <a
                      href={item.file.startsWith('http') ? item.file : `/storage/${item.file}`}
                      target="_blank"
                      className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      {item.category === 'video' ? 'Lihat Video' : 'Lihat Foto'}
                    </a>
                  )}

                  {/* Date */}
                  <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                    <CalendarDays className="h-4 w-4" />
                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>

                  {/* Actions */}
                  <div className="mt-auto flex gap-2">
                    <Button
                      onClick={() => handleEdit(item.id)}
                      className="flex-1 bg-blue-950 hover:bg-blue-900"
                    >
                      Edit
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
            <p className="mb-4 capitalize">Belum ada pengumuman</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
