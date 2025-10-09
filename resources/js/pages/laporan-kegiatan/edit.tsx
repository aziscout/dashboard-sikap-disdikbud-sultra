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
  { title: 'Laporan Kegiatan', href: '/laporan-kegiatan' },
  { title: 'Edit Laporan Kegiatan', href: '/laporan-kegiatan/edit' },
];

interface MediaItem {
  file: string;
  type: string;
}

interface LaporanKegiatan {
  id: number;
  judul: string;
  deskripsi: string;
  lokasi: string;
  penyelenggara: string;
  instansi: string;
  tabel: string;
  coverImage: string | null;
  medias: { file: MediaItem[] } | null;
  created_at: string;
}

interface PageProps {
  laporanKegiatan: LaporanKegiatan;
}

export default function Edit() {
  const { laporanKegiatan } = usePage().props as unknown as PageProps;

  const { data, setData, post, errors, processing } = useForm({
    judul: laporanKegiatan.judul || '',
    penyelenggara: laporanKegiatan.penyelenggara || '',
    lokasi: laporanKegiatan.lokasi || '',
    instansi: laporanKegiatan.instansi || '',
    deskripsi: laporanKegiatan.deskripsi || '',
    tabel: laporanKegiatan.tabel || '',
    coverImage: null as File | null,
    files: [] as File[],
    video_urls: (laporanKegiatan.medias?.file || [])
      .filter((m) => m.type === 'video' && m.file.startsWith('http'))
      .map((m) => m.file),
    _method: 'PUT',
  });

  const [previewCoverUrl, setPreviewCoverUrl] = useState<string | null>(
    laporanKegiatan.coverImage ? `/storage/${laporanKegiatan.coverImage}` : null
  );

  const [previewFileUrls, setPreviewFileUrls] = useState<string[]>(
    (laporanKegiatan.medias?.file || [])
      .filter((m) => m.type === 'foto' || (m.type === 'video' && !m.file.startsWith('http')))
      .map((m) => `/storage/${m.file}`)
  );

  const [videoUrlInput, setVideoUrlInput] = useState('');
  const MAX_FILES = 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('laporan-kegiatan.update', laporanKegiatan.id), {
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
      if (data.files.length + incoming.length > MAX_FILES) {
        alert(`Maksimal ${MAX_FILES} foto yang dapat diupload.`);
        return;
      }
      setData('files', [...data.files, ...incoming]);
      setPreviewFileUrls([...previewFileUrls, ...incoming.map((f) => URL.createObjectURL(f))]);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Laporan Kegiatan" />
      <div className="flex flex-col gap-6 p-4 md:flex-row">
        {/* FORM KIRI */}
        <div className="w-full md:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <CircleAlert className="h-4 w-4" />
                <AlertTitle>Terjadi Kesalahan!</AlertTitle>
                <AlertDescription>
                  <ul className="ml-5 list-disc">
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
              <Input value={data.penyelenggara} onChange={(e) => setData('penyelenggara', e.target.value)} />
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
                  {data.video_urls.map((url: string, idx: number) => (
                    <li key={idx}>{url}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={processing}>
                {processing ? 'Updating...' : (<><Save /> Update</>)}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.get(route('laporan-kegiatan.index'))}>
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
