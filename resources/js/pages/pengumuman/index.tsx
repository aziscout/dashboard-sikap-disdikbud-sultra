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
import { CalendarDays, ListFilterPlus, MapPin, Megaphone, Plus, SquarePen, Trash2, Video } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Pengumuman',
    href: '/pengumuman',
  },
];

interface Media {
  id?: number;
  file?: string;
  type?: string;
}

interface Pengumuman {
  id: number;
  judul: string;
  deskripsi: string;
  coverImage: string | null;
  category: string;
  instansi: string;
  lokasi: string;
  penyelenggara: string;
  created_at: string;
  updated_at: string;
  medias?: {
    file: Media[];
  } | null;
}

interface PageProps {
  flash: { message?: string };
  pengumuman: Pengumuman[];
}

export default function Index() {
  const [sortOrder, setSortOrder] = useState<'terbaru' | 'terlama'>('terbaru');
  const [searchQuery, setSearchQuery] = useState('');
  const [instansiFilter, setInstansiFilter] = useState<'all' | 'SMA' | 'SLB' | 'SMK'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'foto' | 'video' | 'dokumen'>('all');

  const { pengumuman, flash } = usePage().props as unknown as PageProps;
  const { processing, delete: destroy } = useForm();

  const handleDelete = (id: number, judul: string) => {
    if (!confirm(`Apakah anda yakin ingin menghapus "${judul}"?`)) return;
    destroy(route('pengumuman.destroy', id));
  };

  const handleEdit = (id: number) => {
    router.visit(route('pengumuman.edit', id));
  };

  const getCoverUrl = (item: Pengumuman) => {
    const cover = item.coverImage;
    if (!cover) return "/images/default-cover.jpg";
    if (cover.startsWith("http")) return cover;
    if (cover.includes("/")) {
      if (cover.startsWith("/storage/")) return cover;
      return `/storage/${cover}`;
    }
    return `/storage/pengumuman/cover/${cover}`;
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

          {/* Category Filter */}
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
                <DropdownMenuItem onClick={() => setCategoryFilter('dokumen')}>
                  Dokumen
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
                className="bg-white dark:bg-background rounded-2xl shadow-sm hover:shadow-lg dark:hover:bg-sidebar transition flex flex-col overflow-hidden"
              >
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

                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="capitalize text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">
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
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
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

                  <div className="mt-auto flex gap-2">
                    <Button
                      onClick={() => handleEdit(item.id)}
                      className="bg-blue-950 text-white hover:bg-blue-900 flex-1"
                    >
                      <SquarePen />Ubah
                    </Button>
                    <Button
                      disabled={processing}
                      onClick={() => handleDelete(item.id, item.judul)}
                      className="bg-red-600 text-white hover:bg-red-500 flex-1"
                    >
                      <Trash2 />Hapus
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
