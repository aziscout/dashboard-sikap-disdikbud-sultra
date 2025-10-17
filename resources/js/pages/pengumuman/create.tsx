import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { CircleAlert, Plus, Save } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Pengumuman',
    href: '/pengumuman',
  },
  {
    title: 'Tambah Pengumuman',
    href: '/pengumuman/create',
  },
];

const MAX_FILES = 5;


export default function CreatePengumuman() {
  const { url } = usePage();
  const currentTable = url.split('/')[1];

  const { data, setData, post, errors } = useForm({
    judul: '',
    penyelenggara: '',
    lokasi: '',
    tabel: currentTable,
    files: [] as File[],
    video_urls: '' as string,
    deskripsi: '',
    instansi: '',
    coverImage: null as File | null,
  });

  const [previewCoverUrl, setPreviewCoverUrl] = useState<string | null>(null);
  const [previewFileUrls, setPreviewFileUrls] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('pengumuman.store'), {
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

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = data.files.length + newFiles.length;

      if (totalFiles > MAX_FILES) {
        alert(`Maksimal hanya bisa upload ${MAX_FILES} foto`);
        return;
      }

      const updatedFiles = [...data.files, ...newFiles];
      setData('files', updatedFiles);
      setPreviewFileUrls(updatedFiles.map((f) => URL.createObjectURL(f)));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Pengumuman" />
      <div className="flex flex-col gap-6 p-4 md:flex-row">
        {/* LEFT FORM */}
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
              <Input placeholder="Masukkan Judul" value={data.judul} onChange={(e) => setData('judul', e.target.value)} />
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
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                className="h-34"
                placeholder="Deskripsi"
                value={data.deskripsi}
                onChange={(e) => setData('deskripsi', e.target.value)}
              />
            </div>

            <div>
              <Label>Link Video</Label>
              <Input
                type="url"
                placeholder="https://youtube.com/..."
                defaultValue={data.video_urls}
                onChange={(e) => setData('video_urls', e.target.value)}
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
                  <SelectItem value="sma">SMA</SelectItem>
                  <SelectItem value="smk">SMK</SelectItem>
                  <SelectItem value="slb">SLB</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="lokasi">Lokasi</Label>
              <Input placeholder="Masukkan Lokasi" value={data.lokasi} onChange={(e) => setData('lokasi', e.target.value)} />
            </div>

            <Button type="submit" className="w-full md:w-auto">
              <Save /> Simpan
            </Button>
          </form>
        </div>

        {/* RIGHT SIDE (COVER + FOTO) */}
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
            <Label className="mr-5">Upload Foto</Label>

            {previewFileUrls.length > 0 ? (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {previewFileUrls.map((url, i) => (
                  <img key={i} src={url} alt={`Preview File ${i}`} className="h-30 w-full rounded object-cover" />
                ))}

                {/* Add Photo Card */}
                {previewFileUrls.length < 5 && (
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
        </div>
      </div>
    </AppLayout>
  );
}
