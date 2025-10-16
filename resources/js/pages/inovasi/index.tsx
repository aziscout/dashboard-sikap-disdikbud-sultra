import React, { useMemo, useState } from 'react';
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
import {
  CalendarDays,
  ListFilterPlus,
  MapPin,
  Megaphone,
  Plus,
  SquarePen,
  Trash2,
  Video,
} from 'lucide-react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inovasi',
    href: '/inovasi',
  },
];

interface Media {
  id?: number;
  file?: string;
  type?: string;
}

interface Inovasi {
  id: number;
  judul: string;
  deskripsi: string;
  coverImage: string;
  category: string;
  instansi: string;
  lokasi: string;
  created_at: string;
  medias?: {
    file: Media[];
  } | null;
}

interface CustomPageProps {
  flash: { message?: string };
  inovasi: Inovasi[];
}

type PageProps = InertiaPageProps & CustomPageProps;

export default function Index() {
  const { inovasi, flash } = usePage<PageProps>().props;
  const { processing, delete: destroy } = useForm();

  const [sortOrder, setSortOrder] = useState<'terbaru' | 'terlama'>('terbaru');
  const [searchQuery, setSearchQuery] = useState('');
  const [instansiFilter, setInstansiFilter] = useState<'all' | 'SMA' | 'SLB' | 'SMK'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const handleDelete = (id: number, judul: string) => {
    if (!confirm(`Apakah anda yakin ingin menghapus "${judul}"?`)) return;
    destroy(route('inovasi.destroy', id));
  };

  const getCoverUrl = (item: Inovasi) => {
    const cover = item.coverImage;
    if (!cover) return '/images/default-cover.jpg';
    if (cover.startsWith('http')) return cover;
    if (cover.includes('/')) {
      if (cover.startsWith('/storage/')) return cover;
      return `/storage/${cover}`;
    }
    return `/storage/inovasi/cover/${cover}`;
  };

  // Ambil semua kategori unik
  const availableCategories = useMemo(() => {
    const categories = new Set(inovasi.map(item => item.category).filter(Boolean));
    return Array.from(categories);
  }, [inovasi]);

  // Filter dan sorting
  const filteredInovasi = useMemo(() => {
    return [...inovasi]
      .filter(item => item.judul.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(item =>
        instansiFilter === 'all'
          ? true
          : item.instansi?.trim().toLowerCase() === instansiFilter.toLowerCase()
      )
      .filter(item =>
        categoryFilter === 'all'
          ? true
          : item.category?.toLowerCase() === categoryFilter.toLowerCase()
      )
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === 'terbaru' ? dateB - dateA : dateA - dateB;
      });
  }, [inovasi, sortOrder, searchQuery, instansiFilter, categoryFilter]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Inovasi" />

      {/* Header + Filters */}
      <div className="m-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Daftar Inovasi</h1>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Input
            placeholder="Cari judul inovasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64"
          />

          <Link href={route('inovasi.create')}>
            <Button>
              <Plus /> Tambah
            </Button>
          </Link>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ListFilterPlus /> {sortOrder}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setSortOrder('terbaru')}>Terbaru</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('terlama')}>Terlama</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Instansi */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ListFilterPlus /> {instansiFilter === 'all' ? 'Semua Instansi' : instansiFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuGroup>
                {['all', 'SMA', 'SLB', 'SMK'].map((instansi) => (
                  <DropdownMenuItem
                    key={instansi}
                    onClick={() => setInstansiFilter(instansi as any)}
                  >
                    {instansi === 'all' ? 'Semua Instansi' : instansi}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Category */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ListFilterPlus /> {categoryFilter === 'all' ? 'Semua Kategori' : categoryFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                  Semua Kategori
                </DropdownMenuItem>
                {availableCategories.map(category => (
                  <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                    {category}
                  </DropdownMenuItem>
                ))}
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

      {/* Grid Card */}
      <div className="m-4">
        {filteredInovasi.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {filteredInovasi.map((item) => (
              <article
                key={item.id}
                className="bg-white dark:bg-background rounded-2xl shadow-sm hover:shadow-lg dark:hover:bg-sidebar transition flex flex-col overflow-hidden"
              >
                {/* Cover hanya tampil gambar, tidak bisa diklik */}
                <img
                  src={getCoverUrl(item)}
                  alt={item.judul}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">
                    {item.judul}
                  </h2>
                  <p className="text-gray-600 dark:text-white-300 text-sm mb-2 line-clamp-3 min-h-[60px]">
                    {item.deskripsi}
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

                  {/* 📅 Tanggal + Kategori + Lokasi */}
                  <div className="flex justify-between">
                        <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2 mb-2">
                            <CalendarDays className="w-4 h-4" />
                            {new Date(item.created_at).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-3 flex items-center">
                        <MapPin className="w-4 h-4 m-1"/>
                          {item.instansi} - {item.lokasi}
                        </p>
                    </div>

                  <div className="mt-auto flex gap-2">
                    <Link href={route('inovasi.edit', item.id)} className="flex-1">
                      <Button className="text-white bg-blue-950 hover:bg-blue-900 w-full">
                        <SquarePen /> Ubah
                      </Button>
                    </Link>
                    <Button
                      disabled={processing}
                      onClick={() => handleDelete(item.id, item.judul)}
                      className="text-white bg-red-600 hover:bg-red-500 flex-1"
                    >
                      <Trash2 /> Hapus
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center text- y-500 mt-10">
            <p>Belum ada inovasi</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
