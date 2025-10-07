import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CircleAlert, Plus, Save } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tambah Inovasi',
    href: '/inovasi/create',
  },
];

export default function create() {
  const { data, setData, post, errors } = useForm({
    judul: '',
    deskripsi: '',
    cover_image: null as File | null,
    files: [] as File[],
    video_urls: [] as string[],
    category: '',
    instansi: '',
    lokasi: '',
  });

  const [previewCoverUrl, setPreviewCoverUrl] = useState<string | null>(null);
  const [previewFileUrls, setPreviewFileUrls] = useState<string[]>([]);
  const [videoUrlInput, setVideoUrlInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('inovasi.store'), {
      forceFormData: true,
    });
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('cover_image', file);
      setPreviewCoverUrl(URL.createObjectURL(file));
    }
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...data.files, ...newFiles];
      setData('files', updatedFiles);
      setPreviewFileUrls(updatedFiles.map((f) => URL.createObjectURL(f)));
    }
  };

  const handleAddVideoUrl = () => {
    if (videoUrlInput.trim() !== '') {
      const updatedUrls = [...data.video_urls, videoUrlInput.trim()];
      setData('video_urls', updatedUrls);
      setVideoUrlInput('');
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Inovasi" />
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
              <Input
                placeholder="Masukkan Judul"
                value={data.judul}
                onChange={(e) => setData('judul', e.target.value)}
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
              <Label htmlFor="instansi">Instansi</Label>
              <Select onValueChange={(val) => setData('instansi', val)}>
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
              <Label htmlFor="lokasi">Lokasi</Label>
              <Input
                placeholder="Masukkan Lokasi"
                value={data.lokasi}
                onChange={(e) => setData('lokasi', e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full md:w-auto">
              <Save />Simpan
            </Button>
          </form>
        </div>

        {/* FORM KANAN (Cover + Foto) */}
        <div className="w-full md:w-1/2 space-y-6">
          {/* COVER IMAGE */}
          <div className="space-y-2 rounded border p-4">
            <Label htmlFor="cover_image">Cover Image</Label>
            <Input type="file" accept="image/*" onChange={handleCoverImageChange} />
            {previewCoverUrl ? (
              <img
                src={previewCoverUrl}
                alt="Preview Cover"
                className="mt-2 h-30 w-46 rounded object-cover"
              />
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
              <div className="grid grid-cols-3 gap-2 mt-2">
                {previewFileUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Preview File ${i}`}
                    className="h-30 w-full rounded object-cover"
                  />
                ))}

                {/* Card tambah foto */}
                <div
                  className="flex h-30 w-full items-center justify-center rounded border border-dashed text-gray-500 cursor-pointer hover:bg-gray-100"
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
                  <Plus />Tambah Foto
                </div>
              </div>
            ) : (
              <div
                className="flex h-40 items-center justify-center rounded border border-dashed text-gray-500 cursor-pointer hover:bg-gray-100"
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
                <Plus />Tambah Foto
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
