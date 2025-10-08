import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CircleAlert, Save } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Laporan Kegiatan',
    href: '/laporan-kegiatan',
  },
  {
    title: 'Tambah Laporan Kegiatan',
    href: '/laporan-kegiatan/create',
  },
];

export default function CreateLaporanKegiatan() {
  const { data, setData, post, errors, processing, reset } = useForm({
    judul: '',
    penyelenggara: '',
    lokasi: '',
    deskripsi: '',
    dokumen: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('laporan-kegiatan.store'), {
      forceFormData: true, // required for file upload
      onSuccess: () => {
        reset();
        setPreviewUrl(null);
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('dokumen', file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Laporan Kegiatan" />

      <div className="flex flex-col md:flex-row gap-6 p-4">
        {/* FORM SECTION */}
        <div className="w-full md:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ERROR ALERT */}
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

            {/* INPUT FIELDS */}
            <div>
              <Label htmlFor="judul">Judul</Label>
              <Input
                id="judul"
                placeholder="Masukkan judul laporan"
                value={data.judul}
                onChange={(e) => setData('judul', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="penyelenggara">Penyelenggara</Label>
              <Input
                id="penyelenggara"
                placeholder="Masukkan nama penyelenggara"
                value={data.penyelenggara}
                onChange={(e) => setData('penyelenggara', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="lokasi">Lokasi</Label>
              <Input
                id="lokasi"
                placeholder="Masukkan lokasi kegiatan"
                value={data.lokasi}
                onChange={(e) => setData('lokasi', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                placeholder="Tuliskan deskripsi kegiatan"
                value={data.deskripsi}
                onChange={(e) => setData('deskripsi', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="dokumen">Unggah Dokumen</Label>
              <Input
                id="dokumen"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                onChange={handleFileChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                Format yang didukung: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
              </p>
            </div>

            <Button type="submit" disabled={processing} className="w-full md:w-auto">
              <Save className="mr-2 h-4 w-4" />
              {processing ? 'Mengunggah...' : 'Simpan'}
            </Button>
          </form>
        </div>

        {/* PREVIEW SECTION */}
        <div className="w-full md:w-1/2">
          {previewUrl ? (
            <div className="border rounded overflow-hidden">
              {/* Show iframe if PDF, otherwise show file info */}
              {data.dokumen && data.dokumen.type === 'application/pdf' ? (
                <iframe
                  src={previewUrl}
                  width="100%"
                  height="500px"
                  className="rounded"
                  title="Dokumen Preview"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] md:h-[500px] bg-gray-50 text-gray-700">
                  <p className="font-medium">{data.dokumen?.name}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Pratinjau tidak tersedia untuk tipe file ini.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px] md:h-[500px] border rounded text-gray-500">
              Belum ada dokumen dipilih
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
