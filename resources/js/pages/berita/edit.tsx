import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CircleAlert, Plus, Save, SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { 
    title: 'Berita',
    href: '/berita' 
  },
  { 
    title: 'Ubah Berita',
    href: '/berita/edit' 
  },
];

interface MediaItem {
  file: string;
  type: string;
}

interface Berita {
  id: number;
  judul: string;
  penyelenggara: string;
  deskripsi: string;
  coverImage: string | null;
  medias: { file: MediaItem[] } | null;
  category: string;
  instansi: string;
  lokasi: string;
  created_at: string;
}

interface Props {
  berita: Berita;
}

export default function Edit({ berita }: Props) {
  const { data, setData, post, errors, processing } = useForm({
    judul: berita.judul || '',
    deskripsi: berita.deskripsi || '',
    coverImage: null as File | null,
    penyelenggara: berita.penyelenggara || '',
    files: [] as File[],            // untuk foto baru
    replace_files: [] as { index: number; file: File }[], // untuk foto yang diubah
    video_urls: (berita.medias?.file || [])
      .filter((m) => m.type === 'video' && m.file.startsWith('http'))
      .map((m) => m.file),
    category: berita.category || '',
    instansi: berita.instansi || '',
    lokasi: berita.lokasi || '',
    deleted_files: [] as string[],
    _method: 'PUT',
  });


  const [previewCoverUrl, setPreviewCoverUrl] = useState<string | null>(
    berita.coverImage ? `/storage/${berita.coverImage}` : null,
  );
  const [previewFileUrls, setPreviewFileUrls] = useState<string[]>(
    (berita.medias?.file || [])
      .filter((m) => m.type === 'foto' || (m.type === 'video' && !m.file.startsWith('http')))
      .map((m) => `/storage/${m.file}`),
  );
  const [videoUrlInput, setVideoUrlInput] = useState('');

  const MAX_FILES = 5;

  // ===== HANDLERS =====
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('berita.update', berita.id), { forceFormData: true });
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('coverImage', file);
      setPreviewCoverUrl(URL.createObjectURL(file));
    }
  };

  const handleAddVideoUrl = () => {
    if (videoUrlInput.trim() !== '') {
      setData('video_urls', [...data.video_urls, videoUrlInput.trim()]);
      setVideoUrlInput('');
    }
  };

  const handleVideoUrlChange = (index: number, value: string) => {
    const updatedUrls = [...data.video_urls];
    updatedUrls[index] = value;
    setData('video_urls', updatedUrls);
  };

  const handleVideoUrlRemove = (index: number) => {
    const updatedUrls = data.video_urls.filter((_, i) => i !== index);
    setData('video_urls', updatedUrls);
  };

  // Tambah foto baru
const handleAddPhotos = (files: FileList | null) => {
  if (files) {
    const incoming = Array.from(files);

    if (data.files.length + incoming.length > MAX_FILES) {
      alert(`Maksimal ${MAX_FILES} foto yang dapat diupload.`);
      return;
    }

    const newFiles = [...data.files, ...incoming];
    setData("files", newFiles);

    const newPreview = [...previewFileUrls, ...incoming.map((f) => URL.createObjectURL(f))];
    setPreviewFileUrls(newPreview);
  }
};

const handleChangePhoto = (index: number, file: File) => {
  const removedFile = berita.medias?.file[index]?.file;
  if (removedFile) {
    setData("deleted_files", [...data.deleted_files, removedFile]);
  }

  const newPreviews = [...previewFileUrls];
  newPreviews[index] = URL.createObjectURL(file);
  setPreviewFileUrls(newPreviews);

  setData("files", [...data.files, file]);
};

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Berita" />
      <div className="flex flex-col gap-6 p-4 md:flex-row">
        {/* FORM KIRI */}
        <div className="w-full md:w-1/2">
          <form onSubmit={handleUpdate} className="space-y-4" encType="multipart/form-data">
            {Object.keys(errors).length > 0 && (
              <Alert>
                <CircleAlert className="h-4 w-4" />
                <AlertTitle>Errors!</AlertTitle>
                <AlertDescription>
                  <ul>
                    {Object.entries(errors).map(([key, message]) => (
                      <li key={key}>{message as string}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div>
              <Label>Judul</Label>
              <Input value={data.judul} onChange={(e) => setData('judul', e.target.value)} />
            </div>
            <div>
              <Label>Penyelenggara</Label>
              <Input value={data.penyelenggara} onChange={(e) => setData('penyelenggara', e.target.value)} />
            </div>
            <div>
              <Label>Kategori</Label>
              <Input value={data.category}  onChange={(e) => setData('category', e.target.value)} />
            </div>

            <div>
              <Label>Deskripsi</Label>
              <Textarea
                className="h-34"
                value={data.deskripsi}
                onChange={(e) => setData('deskripsi', e.target.value)}
              />
            </div>

            <div>
              <Label>Link Video</Label>
              <div className="space-y-2">
                {data.video_urls.map((url, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input type="url" value={url} onChange={(e) => handleVideoUrlChange(idx, e.target.value)} />
                    <Button
                      type="button"
                      onClick={() => handleVideoUrlRemove(idx)}
                      className="flex-shrink-0 bg-red-600 hover:bg-red-500 text-white"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}

                <div className="mt-2 flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://youtube.com/..."
                    value={videoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                  />
                  <Button type="button" onClick={handleAddVideoUrl} className="flex-shrink-0">
                    <Plus />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label>Instansi</Label>
              <Select value={data.instansi} onValueChange={(val) => setData('instansi', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Instansi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="umum">Umum</SelectItem>
                  <SelectItem value="sma">SMA</SelectItem>
                  <SelectItem value="smk">SMK</SelectItem>
                  <SelectItem value="slb">SLB</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Lokasi</Label>
              <Input value={data.lokasi} onChange={(e) => setData('lokasi', e.target.value)} />
            </div>

            <div className="flex space-x-2">
                          <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : <><Save /> Simpan</>}
                          </Button>
                          <Button type="button" variant="outline" onClick={() => router.get(route('berita.index'))}>
                            Batal
                          </Button>
            </div>
          </form>
        </div>

        {/* PREVIEW + UPLOAD DI KANAN */}
        <div className="w-full md:w-1/2">
          <div className="space-y-4 overflow-hidden rounded border p-4">
            {/* COVER IMAGE */}
            <div>
              <Label>Cover Image</Label>
              <Input type="file" accept="image/*" onChange={handleCoverImageChange} />
              {previewCoverUrl ? (
                <div className="mt-2">
                  <p className="font-semibold">Preview Cover Image:</p>
                  <img src={previewCoverUrl} alt="Preview Cover" className="h-30 w-46 rounded object-cover" />
                </div>
              ) : (
                <div className="mt-2 flex h-64 items-center justify-center rounded border text-gray-500">
                  Belum ada cover dipilih
                </div>
              )}
            </div>

            {/* UPLOAD FOTO */}
            <div>
              <Label>Upload Foto (max {MAX_FILES})</Label>

              {previewFileUrls.length > 0 ? (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {previewFileUrls.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt={`Foto ${i}`} className="h-30 w-full rounded object-cover" />
                      <div className="mt-2 flex gap-2">
                        {/* Tombol ubah foto */}
                        <Button
                          type="button"
                          className="w-24 flex items-center gap-1 bg-blue-950 hover:bg-blue-900 text-white"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e: Event) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                handleChangePhoto(i, file); // <<< PAKAI INI
                              }
                            };
                            input.click();
                          }}
                        >
                          <SquarePen /> Ubah
                        </Button>

                        {/* Tombol hapus foto */}
                        <Button
                          type="button"
                          className="w-24 flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white"
                          onClick={() => {
                            // simpan path lama ke deleted_files agar backend tahu
                            const removedFile = berita.medias?.file[i]?.file;
                            if (removedFile) {
                              setData("deleted_files", [...data.deleted_files, removedFile]);
                            }

                            // hapus preview lokal
                            const newFiles = data.files.filter((_, idx) => idx !== i);
                            const newPreview = previewFileUrls.filter((_, idx) => idx !== i);
                            setData('files', newFiles);
                            setPreviewFileUrls(newPreview);
                          }}
                        >
                          <Trash2 /> Hapus
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {previewFileUrls.length < MAX_FILES && (
                    <div
                      className="flex h-30 w-full cursor-pointer items-center justify-center rounded border border-dashed text-gray-500 hover:bg-gray-100"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.multiple = true;
                        input.onchange = (e: Event) => {
                          handleAddPhotos((e.target as HTMLInputElement).files);
                        };
                        input.click();
                      }}
                    >
                      <Plus /> Tambah Foto
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="mt-2 flex h-40 cursor-pointer flex-col items-center justify-center rounded border border-dashed text-gray-500 hover:bg-gray-100"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.multiple = true;
                    input.onchange = (e: Event) => {
                      handleAddPhotos((e.target as HTMLInputElement).files);
                    };
                    input.click();
                  }}
                >
                  <Plus /> Tambah Foto
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
