import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CircleAlert, Plus, Save, SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Agenda', href: '/agenda' },
  { title: 'Edit Agenda', href: '/agenda/edit' },
];

interface MediaItem {
  file: string;
  type: string; // 'foto' | 'video'
}

interface Agenda {
  id: number;
  judul: string;
  deskripsi: string;
  lokasi: string;
  penyelenggara: string;
  category: string;
  instansi: string;
  tabel: string;
  medias: { file: MediaItem[] } | null;
  coverImage: string | null;
  files: string[];
  video_urls: string[];
  created_at: string;
}

interface PageProps {
  agenda: Agenda;
}

export default function Edit() {
  const { agenda } = usePage().props as unknown as PageProps;

  const { data, setData, post, errors, processing } = useForm({
    judul: agenda.judul || '',
    penyelenggara: agenda.penyelenggara || '',
    lokasi: agenda.lokasi || '',
    instansi: agenda.instansi || '',
    deskripsi: agenda.deskripsi || '',
    tabel: agenda.tabel || '',
    category: agenda.category || '',
    coverImage: null as File | null,
    files: [] as File[],
    video_urls: (agenda.medias?.file || [])
      .filter((m) => m.type === 'video' && m.file.startsWith('http'))
      .map((m) => m.file),
    _method: 'PUT',
  });

  const [previewCoverUrl, setPreviewCoverUrl] = useState<string | null>(
    agenda.coverImage ? `/storage/${agenda.coverImage}` : null,
  );
  const [previewFileUrls, setPreviewFileUrls] = useState<string[]>(
    (agenda.medias?.file || [])
      .filter((m) => m.type === 'foto' || (m.type === 'video' && !m.file.startsWith('http')))
      .map((m) => `/storage/${m.file}`),
  );
  const [videoUrlInput, setVideoUrlInput] = useState('');

  const MAX_FILES = 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('agenda.update', agenda.id), {
      preserveScroll: true,
      forceFormData: true,
    });
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('coverImage', file);
      setPreviewCoverUrl(URL.createObjectURL(file));
    }
  };

  const handleFilesChange = (files: FileList | null) => {
    if (files) {
      const incoming = Array.from(files);

      // limit total files
      if (data.files.length + incoming.length > MAX_FILES) {
        alert(`Maksimal ${MAX_FILES} foto yang dapat diupload.`);
        return;
      }

      const newFiles = [...data.files, ...incoming];
      setData('files', newFiles);

      const newPreview = [...previewFileUrls, ...incoming.map((f) => URL.createObjectURL(f))];
      setPreviewFileUrls(newPreview);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Agenda" />
      <div className="flex flex-col gap-6 p-4 md:flex-row">
        {/* FORM KIRI */}
        <div className="w-full md:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
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
              <Label htmlFor="judul">Judul</Label>
              <Input value={data.judul} onChange={(e) => setData('judul', e.target.value)} />
            </div>

            <div>
              <Label htmlFor="penyelenggara">Penyelenggara</Label>
              <Input
                value={data.penyelenggara}
                onChange={(e) => setData('penyelenggara', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                className="h-34"
                value={data.deskripsi}
                onChange={(e) => setData('deskripsi', e.target.value)}
              />
            </div>

            <div>
              <Label>Tambah Link Video</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://youtube.com/..."
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (videoUrlInput.trim() !== '') {
                      setData('video_urls', [...data.video_urls, videoUrlInput.trim()]);
                      setVideoUrlInput('');
                    }
                  }}
                >
                  <Plus />
                </Button>
              </div>
              {data.video_urls.length > 0 && (
                <ul className="mt-2 list-disc pl-4 text-sm text-gray-600">
                  {data.video_urls.map((url, idx) => (
                    <li key={idx}>{url}</li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <Label htmlFor="category">Kategori</Label>
              <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foto">Foto</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="instansi">Instansi</Label>
              <Select value={data.instansi} onValueChange={(value) => setData('instansi', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Instansi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="umum">Umum</SelectItem>
                  <SelectItem value="slb">SLB</SelectItem>
                  <SelectItem value="smk">SMK</SelectItem>
                  <SelectItem value="sma">SMA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="lokasi">Lokasi</Label>
              <Input value={data.lokasi} onChange={(e) => setData('lokasi', e.target.value)} />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={processing}>
                {processing ? 'Updating...' : <><Save /> Update</>}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.get(route('agenda.index'))}>
                Batal
              </Button>
            </div>
          </form>
        </div>

        {/* FORM KANAN (Cover + Foto) */}
        <div className="w-full space-y-6 md:w-1/2">
          {/* COVER IMAGE */}
          <div className="space-y-2 rounded border p-4">
            <Label htmlFor="coverImage">Cover Image</Label>
            <Input type="file" accept="image/*" onChange={handleCoverImageChange} />
            {previewCoverUrl ? (
              <img src={previewCoverUrl} alt="Preview Cover" className="mt-2 h-30 w-46 rounded object-cover" />
            ) : (
              <div className="flex h-30 items-center justify-center rounded border text-gray-500">
                Belum ada cover dipilih
              </div>
            )}
          </div>

          {/* UPLOAD FOTO */}
          <div className="space-y-2 rounded border p-4">
            <Label className="mr-5">Upload Foto (max {MAX_FILES})</Label>
            {previewFileUrls.length > 0 ? (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {previewFileUrls.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt={`Preview File ${i}`} className="h-30 w-full rounded object-cover" />
                    <div className="mt-2 flex gap-2">
                      {/* Ubah foto */}
                      <Button
                        type="button"
                        className="flex w-24 items-center gap-1 bg-blue-950 hover:bg-blue-900"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e: Event) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              const newFiles = [...data.files];
                              newFiles[i] = file;
                              setData('files', newFiles);

                              const newPreview = [...previewFileUrls];
                              newPreview[i] = URL.createObjectURL(file);
                              setPreviewFileUrls(newPreview);
                            }
                          };
                          input.click();
                        }}
                      >
                        <SquarePen /> Ubah
                      </Button>

                      {/* Hapus foto */}
                      <Button
                        type="button"
                        className="flex w-24 items-center gap-1 bg-red-600 hover:bg-red-500"
                        onClick={() => {
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

                {/* Tambah foto card (only if less than MAX_FILES) */}
                {previewFileUrls.length < MAX_FILES && (
                  <div
                    className="flex h-30 w-full cursor-pointer items-center justify-center rounded border border-dashed text-gray-500 hover:bg-gray-100"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.multiple = true;
                      input.onchange = (e: Event) => {
                        handleFilesChange((e.target as HTMLInputElement).files);
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
                className="flex h-40 cursor-pointer items-center justify-center rounded border border-dashed text-gray-500 hover:bg-gray-100"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.multiple = true;
                  input.onchange = (e: Event) => {
                    handleFilesChange((e.target as HTMLInputElement).files);
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
    </AppLayout>
  );
}
