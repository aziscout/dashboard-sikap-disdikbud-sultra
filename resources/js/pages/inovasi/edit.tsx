import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CircleAlert, Plus, Save, SquarePen, Trash2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Inovasi', href: '/inovasi' },
  { title: 'Edit Inovasi', href: '/inovasi/edit' },
];

interface MediaItem {
  file: string;
  type: string;
}

interface Inovasi {
  id: number;
  judul: string;
  deskripsi: string;
  penyelenggara: string;
  instansi: string;
  lokasi: string;
  category: string;
  cover_image: string | null;
  medias: { file: MediaItem[] } | null;
}

interface PageProps {
  inovasi: Inovasi;
}

export default function EditInovasi() {
  const { inovasi } = usePage().props as unknown as PageProps;

  const existingPhotos = (inovasi.medias?.file || []).filter((m) => m.type === 'foto');

  const { data, setData, post, errors, processing } = useForm({
    judul: inovasi.judul || '',
    deskripsi: inovasi.deskripsi || '',
    penyelenggara: inovasi.penyelenggara || '',
    instansi: inovasi.instansi || '',
    lokasi: inovasi.lokasi || '',
    category: inovasi.category || '',
    cover_image: null as File | null,
    files: [] as File[],
    video_urls: (inovasi.medias?.file || [])
      .filter((m) => m.type === 'video' && m.file.startsWith('http'))
      .map((m) => m.file),
    deleted_files: [] as string[],
    _method: 'PUT',
  });

  const [previewCoverUrl, setPreviewCoverUrl] = useState<string | null>(
    inovasi.cover_image ? `/storage/${inovasi.cover_image}` : null,
  );
  const [existingFiles, setExistingFiles] = useState<MediaItem[]>(existingPhotos);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previewFileUrls, setPreviewFileUrls] = useState<string[]>(
    [...existingFiles.map((m) => `/storage/${m.file}`), ...newFiles.map((f) => URL.createObjectURL(f))],
  );
  const [videoUrlInput, setVideoUrlInput] = useState('');

  const [notifMessage, setNotifMessage] = useState<string | null>(null);
  const [notifType, setNotifType] = useState<'success' | 'error' | null>(null);

  const MAX_FILES = 5;

  const showNotif = (msg: string, type: 'success' | 'error') => {
    setNotifMessage(msg);
    setNotifType(type);
    setTimeout(() => setNotifMessage(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('inovasi.update', inovasi.id), {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => showNotif('Inovasi berhasil diperbarui ✅', 'success'),
      onError: () => showNotif('Gagal memperbarui inovasi ❌', 'error'),
    });
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('cover_image', file);
      setPreviewCoverUrl(URL.createObjectURL(file));
    }
  };

  const handleFilesChange = (files: FileList | null) => {
    if (files) {
      const incoming = Array.from(files);
      if (existingFiles.length + newFiles.length + incoming.length > MAX_FILES) {
        showNotif(`Maksimal ${MAX_FILES} foto yang dapat diupload.`, 'error');
        return;
      }
      const updatedNewFiles = [...newFiles, ...incoming];
      setNewFiles(updatedNewFiles);
      setData('files', updatedNewFiles);
      setPreviewFileUrls([...existingFiles.map((m) => `/storage/${m.file}`), ...updatedNewFiles.map((f) => URL.createObjectURL(f))]);
    }
  };

  const handleRemovePhoto = (i: number) => {
    if (i < existingFiles.length) {
      // existing
      const fileToDelete = existingFiles[i].file;
      setData('deleted_files', [...data.deleted_files, fileToDelete]);
      // update preview
      const updatedPreview = previewFileUrls.filter((_, idx) => idx !== i);
      setPreviewFileUrls(updatedPreview);
    } else {
      // new
      const newIndex = i - existingFiles.length;
      const updatedNewFiles = newFiles.filter((_, idx) => idx !== newIndex);
      setNewFiles(updatedNewFiles);
      setData('files', updatedNewFiles);
      // update preview
      const updatedPreview = previewFileUrls.filter((_, idx) => idx !== i);
      setPreviewFileUrls(updatedPreview);
    }
  };

  const handleReplacePhoto = (i: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (i < existingFiles.length) {
          // existing
          const fileToDelete = existingFiles[i].file;
          setData('deleted_files', [...data.deleted_files, fileToDelete]);
          // add new
          const updatedNewFiles = [...newFiles, file];
          setNewFiles(updatedNewFiles);
          setData('files', updatedNewFiles);
          // update preview
          const updatedPreview = [...previewFileUrls];
          updatedPreview[i] = URL.createObjectURL(file);
          setPreviewFileUrls(updatedPreview);
        } else {
          // new
          const newIndex = i - existingFiles.length;
          const updatedNewFiles = [...newFiles];
          updatedNewFiles[newIndex] = file;
          setNewFiles(updatedNewFiles);
          setData('files', updatedNewFiles);
          // update preview
          const updatedPreview = [...previewFileUrls];
          updatedPreview[i] = URL.createObjectURL(file);
          setPreviewFileUrls(updatedPreview);
        }
      }
    };
    input.click();
  };

  const handleAddVideoUrl = () => {
    if (videoUrlInput.trim() !== '') {
      setData('video_urls', [...data.video_urls, videoUrlInput.trim()]);
      setVideoUrlInput('');
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Inovasi" />
      <div className="flex flex-col gap-6 p-4 md:flex-row">
        {/* FORM KIRI */}
        <div className="w-full md:w-1/2">
          {notifMessage && (
            <Alert className={notifType === 'success' ? 'border-green-600' : 'border-red-600'}>
              {notifType === 'success' ? <CheckCircle className="h-4 w-4 text-green-600" /> : <CircleAlert className="h-4 w-4 text-red-600" />}
              <AlertTitle>{notifType === 'success' ? 'Berhasil' : 'Gagal'}</AlertTitle>
              <AlertDescription>{notifMessage}</AlertDescription>
            </Alert>
          )}

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

          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div>
              <Label>Judul</Label>
              <Input value={data.judul} onChange={(e) => setData('judul', e.target.value)} />
            </div>

            <div>
              <Label>Penyelenggara</Label>
              <Input value={data.penyelenggara} onChange={(e) => setData('penyelenggara', e.target.value)} />
            </div>

            <div>
              <Label>Deskripsi</Label>
              <Textarea value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} />
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
                <Button type="button" onClick={handleAddVideoUrl}>
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
              <Label>Instansi</Label>
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
              <Label>Lokasi</Label>
              <Input value={data.lokasi} onChange={(e) => setData('lokasi', e.target.value)} />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={processing}>
                {processing ? 'Updating...' : <><Save /> Update</>}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.get(route('inovasi.index'))}>
                Batal
              </Button>
            </div>
          </form>
        </div>

        {/* FORM KANAN */}
        <div className="w-full space-y-6 md:w-1/2">
          {/* Cover */}
          <div className="space-y-2 rounded border p-4">
            <Label>Cover Image</Label>
            <Input type="file" accept="image/*" onChange={handleCoverImageChange} />
            {previewCoverUrl ? (
              <img src={previewCoverUrl} alt="Preview Cover" className="mt-2 h-30 w-46 rounded object-cover" />
            ) : (
              <div className="flex h-30 items-center justify-center rounded border text-gray-500">
                Belum ada cover dipilih
              </div>
            )}
          </div>

          {/* Upload Foto */}
          <div className="space-y-2 rounded border p-4">
            <Label>Upload Foto (max {MAX_FILES})</Label>
            {previewFileUrls.length > 0 ? (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {previewFileUrls.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt={`Preview ${i}`} className="h-30 w-full rounded object-cover" />
                    <div className="mt-2 flex gap-2">
                      <Button
                        type="button"
                        className="flex w-24 items-center gap-1 bg-blue-950 hover:bg-blue-900"
                        onClick={() => handleReplacePhoto(i)}
                      >
                        <SquarePen /> Ubah
                      </Button>
                      <Button
                        type="button"
                        className="flex w-24 items-center gap-1 bg-red-600 hover:bg-red-500"
                        onClick={() => handleRemovePhoto(i)}
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
                      input.onchange = (e: Event) => handleFilesChange((e.target as HTMLInputElement).files);
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
                  input.onchange = (e: Event) => handleFilesChange((e.target as HTMLInputElement).files);
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
