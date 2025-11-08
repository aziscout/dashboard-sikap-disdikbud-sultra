import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { getCustomErrors } from '@/lib/custom-errors';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Agenda',
        href: '/agenda',
    },
    {
        title: 'Tambah Agenda',
        href: '/agenda/create',
    },
];

const MAX_FILES = 5;

export default function Index() {
  const { url } = usePage();
  const currentTable = url.split('/')[1];

  const { data, setData, post, errors } = useForm({
    judul: '',
    deskripsi: '',
    penyelenggara: '',
    coverImage: null as File | null,
    files: [] as File[],
    video_urls: '' as string,
    category: '',
    instansi: '',
    lokasi: '',
    tabel: currentTable,
  });

  const customErrors = getCustomErrors(errors);

  const [previewCoverUrl, setPreviewCoverUrl] = useState<string | null>(null);
  const [previewFileUrls, setPreviewFileUrls] = useState<string[]>([]);
  const [formatDokumentasi, setFormatDokumentasi] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');
  const [coverError, setCoverError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('agenda.store'), { forceFormData: true });
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 3MB)
      if (file.size > 3 * 1024 * 1024) {
        setCoverError('Ukuran file maksimal 3MB');
        return;
      }
      setCoverError('');
      setData('coverImage', file);
      setPreviewCoverUrl(URL.createObjectURL(file));
    }
  };

  const handleFormatChange = (value: string) => {
    setFormatDokumentasi(value);
    // Reset video_urls if switching from video to foto
    if (value.toLowerCase() !== 'video') {
      setData('video_urls', '');
    }
    // Clear files if switching from foto to video
    if (value.toLowerCase() === 'video') {
      setData('files', []);
      setPreviewFileUrls([]);
    }
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = data.files.length + newFiles.length;

      if (totalFiles > MAX_FILES) {
        setFileError(`Maksimal hanya bisa upload ${MAX_FILES} foto`);
        return;
      }

      // Validate file size (max 3MB per file)
      const invalidFiles = newFiles.filter(file => file.size > 3 * 1024 * 1024); // 3MB in bytes
      if (invalidFiles.length > 0) {
        setFileError('Ukuran file maksimal 3MB per foto');
        return;
      }

      setFileError('');
      const updatedFiles = [...data.files, ...newFiles];
      setData('files', updatedFiles);
      setPreviewFileUrls(updatedFiles.map((f) => URL.createObjectURL(f)));
    }
  };

  // const handleAddVideoUrl = () => {
  //   if (videoUrlInput.trim() !== '') {
  //     const updatedUrls = [...data.video_urls, videoUrlInput.trim()];
  //     setData('video_urls', updatedUrls);
  //     setVideoUrlInput('');
  //   }
  // };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Agenda" />
      <div className="flex flex-col gap-6 p-4 md:flex-row">
        {/* FORM KIRI */}
        <div className="w-full md:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div>
              <Label htmlFor="judul">Judul</Label>
              <Input
                placeholder="Masukkan Judul"
                defaultValue={data.judul}
                onChange={(e) => setData('judul', e.target.value)}
              />
              {customErrors.judul && <p className="mt-1 text-sm text-red-600">{customErrors.judul}</p>}
            </div>

            <div>
              <Label htmlFor="penyelenggara">Penyelenggara</Label>
              <Input
                placeholder="Masukkan Penyelenggara"
                defaultValue={data.penyelenggara}
                onChange={(e) => setData('penyelenggara', e.target.value)}
              />
              {customErrors.penyelenggara && <p className="mt-1 text-sm text-red-600">{customErrors.penyelenggara}</p>}
            </div>

            <div>
              <Label htmlFor="kategori">Kategori</Label>
              <Select value={data.category} onValueChange={(val) => setData('category', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Monitoring">Monitoring</SelectItem>
                  <SelectItem value="Sosialisasi">Sosialisasi</SelectItem>
                  <SelectItem value="Pelatihan">Pelatihan</SelectItem>
                  <SelectItem value="Lomba">Lomba</SelectItem>
                  <SelectItem value="Evaluasi">Evaluasi</SelectItem>
                </SelectContent>
              </Select>
              {customErrors.category && <p className="mt-1 text-sm text-red-600">{customErrors.category}</p>}
            </div>


            <div>
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                className="h-34"
                placeholder="Deskripsi"
                defaultValue={data.deskripsi}
                onChange={(e) => setData('deskripsi', e.target.value)}
              />
              {customErrors.deskripsi && <p className="mt-1 text-sm text-red-600">{customErrors.deskripsi}</p>}
            </div>

            <div>
              <Label htmlFor="format_dokumentasi">Format Dokumentasi</Label>
              <Select value={formatDokumentasi} onValueChange={handleFormatChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Format Dokumentasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foto">Foto</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>



            <div>
              <Label htmlFor="instansi">Instansi</Label>
              <Select defaultValue={data.instansi} onValueChange={(val) => setData('instansi', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Instansi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="umum">Umum</SelectItem>
                  <SelectItem value="sma">SMA</SelectItem>
                  <SelectItem value="smk">SMK</SelectItem>
                  <SelectItem value="slb">SLB</SelectItem>
                </SelectContent>
              </Select>
              {customErrors.instansi && <p className="mt-1 text-sm text-red-600">{customErrors.instansi}</p>}
            </div>

            <div>
              <Label htmlFor="lokasi">Lokasi</Label>
              <Input
                placeholder="Masukkan Lokasi"
                defaultValue={data.lokasi}
                onChange={(e) => setData('lokasi', e.target.value)}
              />
              {customErrors.lokasi && <p className="mt-1 text-sm text-red-600">{customErrors.lokasi}</p>}
            </div>

            <div className=' flex space-x-2'>
            <Button type="submit" className="w-full md:w-auto">
              <Save />Simpan
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
            {coverError && <p className="text-red-500 text-sm">{coverError}</p>}
            {previewCoverUrl ? (
              <div className="mt-2">
                <img
                  src={previewCoverUrl}
                  alt="Preview Cover"
                  className="h-30 w-46 rounded object-cover"
                />
                {/* <div className="mt-2 flex justify-center">
                  <Button
                    type="button"
                    className="flex items-center gap-1 bg-red-600 hover:bg-red-500"
                    onClick={() => {
                      setData('coverImage', null);
                      setPreviewCoverUrl(null);
                    }}
                  >
                    <Trash2 /> Hapus
                  </Button>
                </div> */}
              </div>
            ) : (
              <div className="flex h-30 items-center justify-center rounded border text-gray-500">
                Belum ada cover dipilih
              </div>
            )}
          </div>

          {formatDokumentasi.toLowerCase() === 'video' && (
              <div>
                <Label>Link Video</Label>
                <Input
                  type="url"
                  placeholder="https://youtube.com/..."
                  value={data.video_urls}
                  onChange={(e) => setData('video_urls', e.target.value)}
                />
              </div>
            )}
          {/* UPLOAD FOTO */}
          {formatDokumentasi.toLowerCase() !== 'video' && (
            <div className="space-y-2 rounded border p-4">
              <Label className="mr-5">Upload Foto (max {MAX_FILES})</Label>
              {fileError && <p className="text-red-500 text-sm">{fileError}</p>}
              {previewFileUrls.length > 0 ? (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {previewFileUrls.map((url, i) => (
                    <div key={i}>
                      <img
                        src={url}
                        alt={`Preview File ${i}`}
                        className="h-30 w-full rounded object-cover"
                      />
                      <div className="mt-2 flex justify-center">
                        <Button
                          type="button"
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-500"
                          onClick={() => {
                            const updatedFiles = data.files.filter((_, idx) => idx !== i);
                            setData('files', updatedFiles);
                            setPreviewFileUrls(updatedFiles.map((f) => URL.createObjectURL(f)));
                          }}
                        >
                          <Trash2 /> Hapus
                        </Button>
                      </div>
                    </div>
                  ))}
                  {data.files.length < MAX_FILES && (
                    <div
                      className="flex h-30 w-full cursor-pointer items-center justify-center rounded border border-dashed text-gray-500 hover:bg-gray-100"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.multiple = true;
                        input.onchange = (e: Event) => {
                          handleFilesChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
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
                      handleFilesChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
                    };
                    input.click();
                  }}
                >
                  <Plus /> Tambah Foto
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
