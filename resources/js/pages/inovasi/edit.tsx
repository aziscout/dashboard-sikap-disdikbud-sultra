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
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Inovasi', href: '/inovasi' },
  { title: 'Ubah Inovasi', href: '/inovasi/edit' },
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
  format_dokumentasi?: string;
  coverImage: string | null;
  medias: { file: MediaItem[] } | null;
  files: string[];
  video_urls: string | null;
}

interface PageProps {
  inovasi: Inovasi;
}

export default function EditInovasi() {
  const { inovasi } = usePage().props as unknown as PageProps;

  const { data, setData, post, errors, processing } = useForm({
    judul: inovasi.judul || '',
    deskripsi: inovasi.deskripsi || '',
    penyelenggara: inovasi.penyelenggara || '',
    instansi: inovasi.instansi || '',
    lokasi: inovasi.lokasi || '',
    category: inovasi.category || '',
    coverImage: null as File | null,
    files: [] as File[],
    video_urls: (inovasi.medias?.file || [])
      .filter((m) => m.type === 'video' && m.file.startsWith('http'))
      .map((m) => m.file)[0] || '',
    deleted_files: [] as string[],
    _method: 'PUT',
  });

  const [formatDokumentasi, setFormatDokumentasi] = useState<string>(
    inovasi.medias?.file?.some((m) => m.type === 'video' && m.file.startsWith('http')) ? 'video' :
    inovasi.medias?.file?.some((m) => m.type === 'foto') ? 'foto' : ''
  );

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
      // Mark existing photos for deletion
      const photoFiles = inovasi.medias?.file?.filter((m) => m.type === 'foto').map((m) => m.file) || [];
      setData('deleted_files', [...data.deleted_files, ...photoFiles]);
    }
  };

   const [previewCoverUrl, setPreviewCoverUrl] = useState<string | null>(
      inovasi.coverImage ? `/storage/${inovasi.coverImage}` : null,
    );
  const [previewFileUrls, setPreviewFileUrls] = useState<string[]>(
    (inovasi.medias?.file || [])
      .filter((m) => m.type === 'foto' || (m.type === 'video' && !m.file.startsWith('http')))
      .map((m) => `/storage/${m.file}`),
  );
  const localMediaIndices = useMemo(() => {
    return (inovasi.medias?.file || []).map((m, idx) => ({m, idx})).filter(({m}) => m.type === 'foto' || (m.type === 'video' && !m.file.startsWith('http'))).map(({idx}) => idx);
  }, [inovasi.medias]);
  const [fileError, setFileError] = useState<string>('');
  const [coverError, setCoverError] = useState<string>('');
    
    const MAX_FILES = 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('inovasi.update', inovasi.id), {
      forceFormData: true,
      preserveScroll: true,
    });
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

  const handleFilesChange = (files: FileList | null) => {
    if (files) {
      const incoming = Array.from(files);

      // limit total files
      if (data.files.length + incoming.length > MAX_FILES) {
        setFileError(`Maksimal ${MAX_FILES} foto yang dapat diupload.`);
        return;
      }

      // Validate file size (max 3MB per file)
      const invalidFiles = incoming.filter(file => file.size > 3 * 1024 * 1024); // 3MB in bytes
      if (invalidFiles.length > 0) {
        setFileError('Ukuran file maksimal 3MB per foto');
        return;
      }

      setFileError('');
      const newFiles = [...data.files, ...incoming];
      setData('files', newFiles);

      const newPreview = [...previewFileUrls, ...incoming.map((f) => URL.createObjectURL(f))];
      setPreviewFileUrls(newPreview);
    }
  };

  const handleChangePhoto = (index: number, file: File) => {
    const originalIndex = localMediaIndices[index];
    const removedFile = inovasi.medias?.file[originalIndex]?.file;
    if (removedFile) {
      setData("deleted_files", [...data.deleted_files, removedFile]);
    }

    const newPreviews = [...previewFileUrls];
    newPreviews[index] = URL.createObjectURL(file);
    setPreviewFileUrls(newPreviews);

    setData("files", [...data.files, file]);
  };

  // const handleReplacePhoto = (i: number) => {
  //   const input = document.createElement('input');
  //   input.type = 'file';
  //   input.accept = 'image/*';
  //   input.onchange = (e: Event) => {
  //     const file = (e.target as HTMLInputElement).files?.[0];
  //     if (file) {
  //       if (i < existingFiles.length) {
  //         // existing
  //         const fileToDelete = existingFiles[i].file;
  //         setData('deleted_files', [...data.deleted_files, fileToDelete]);
  //         // add new
  //         const updatedNewFiles = [...newFiles, file];
  //         setNewFiles(updatedNewFiles);
  //         setData('files', updatedNewFiles);
  //         // update preview
  //         const updatedPreview = [...previewFileUrls];
  //         updatedPreview[i] = URL.createObjectURL(file);
  //         setPreviewFileUrls(updatedPreview);
  //       } else {
  //         // new
  //         const newIndex = i - existingFiles.length;
  //         const updatedNewFiles = [...newFiles];
  //         updatedNewFiles[newIndex] = file;
  //         setNewFiles(updatedNewFiles);
  //         setData('files', updatedNewFiles);
  //         // update preview
  //         const updatedPreview = [...previewFileUrls];
  //         updatedPreview[i] = URL.createObjectURL(file);
  //         setPreviewFileUrls(updatedPreview);
  //       }
  //     }
  //   };
  //   input.click();
  // };

  // const handleAddVideoUrl = () => {
  //   if (videoUrlInput.trim() !== '') {
  //     setData('video_urls', [...data.video_urls, videoUrlInput.trim()]);
  //     setVideoUrlInput('');
  //   }
  // };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Inovasi" />
      <div className="flex flex-col gap-6 p-4 md:flex-row">
        {/* FORM KIRI */}
        <div className="w-full md:w-1/2">
          {/* {notifMessage && (
            <Alert className={notifType === 'success' ? 'border-green-600' : 'border-red-600'}>
              {notifType === 'success' ? <CheckCircle className="h-4 w-4 text-green-600" /> : <CircleAlert className="h-4 w-4 text-red-600" />}
              <AlertTitle>{notifType === 'success' ? 'Berhasil' : 'Gagal'}</AlertTitle>
              <AlertDescription>{notifMessage}</AlertDescription>
            </Alert>
          )} */}

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
              <Label htmlFor="judul">Judul</Label>
              <Input
                placeholder="Masukkan Judul"
                value={data.judul}
                onChange={(e) => setData('judul', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="penyelenggara">Penyelenggara</Label>
              <Input
                placeholder="Masukkan Penyelenggara"
                value={data.penyelenggara}
                onChange={(e) => setData('penyelenggara', e.target.value)}
              />
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
            </div>

            <div>
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                className="h-34"
                placeholder="Deskripsi"
                value={data.deskripsi}
                onChange={(e) => setData('deskripsi', e.target.value)}
              />
            </div>
{/* 
            <div>
              <Label htmlFor="format_dokumentasi">Format Dokumentasi</Label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="format_dokumentasi"
                    value="foto"
                    checked={formatDokumentasi === 'foto'}
                    onChange={(e) => handleFormatChange(e.target.value)}
                    className="mr-2"
                  />
                  Foto
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="format_dokumentasi"
                    value="video"
                    checked={formatDokumentasi === 'video'}
                    onChange={(e) => handleFormatChange(e.target.value)}
                    className="mr-2"
                  />
                  Video
                </label>
              </div>
            </div> */}

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

            <div>
              <Label htmlFor="instansi">Instansi</Label>
              <Select value={data.instansi} onValueChange={(value) => setData('instansi', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Instansi" />
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
              <Label htmlFor="lokasi">Lokasi</Label>
              <Input
                placeholder="Masukkan Lokasi"
                value={data.lokasi}
                onChange={(e) => setData('lokasi', e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={processing}>
                {processing ? 'Menyimpan...' : <><Save /> Simpan</>}
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
            {coverError && <p className="text-red-500 text-sm">{coverError}</p>}
            {previewCoverUrl ? (
              <img src={previewCoverUrl} alt="Preview Cover" className="mt-2 h-30 w-46 rounded object-cover" />
            ) : (
              <div className="flex h-30 items-center justify-center rounded border text-gray-500">
                Belum ada cover dipilih
              </div>
            )}
          </div>

          {/* Upload Foto */}
          {formatDokumentasi.toLowerCase() !== 'video' && (
            <div className="space-y-2 rounded border p-4">
              <Label className="mr-5">Upload Foto (max {MAX_FILES})</Label>
              {fileError && <p className="text-red-500 text-sm">{fileError}</p>}
              {previewFileUrls.length > 0 ? (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {previewFileUrls.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt={`Preview File ${i}`} className="h-30 w-full rounded object-cover" />
                      <div className="mt-2 flex gap-2">
                        {/* Ubah foto */}
                        <Button
                          type="button"
                          className="flex w-24 items-center gap-1 bg-blue-950 hover:bg-blue-900 text-white"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e: Event) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                handleChangePhoto(i, file);
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
                          className="flex w-24 items-center gap-1 bg-red-600 hover:bg-red-500 text-white  "
                          onClick={() => {
                            const originalIndex = localMediaIndices[i];
                            const removedFile = inovasi.medias?.file[originalIndex]?.file;
                            if (removedFile) {
                              setData("deleted_files", [...data.deleted_files, removedFile]);
                            }

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
          )}
        </div>
      </div>
    </AppLayout>
  );
}
