import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CircleAlert, Save } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Laporan Kegiatan',
    href: '/laporan',
  },
  {
    title: 'Tambah Laporan Kegiatan',
    href: '/laporan/create',
  },
];

export default function Index() {

  const { data, setData, post, errors, processing } = useForm({
    judul: '',
    penyelenggara: '',
    lokasi: '',
    deskripsi: '',
    instansi: '',
    peserta: '',
    dokumen: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('laporan.store'), {
      forceFormData: true,
      // onSuccess: () => reset(),
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
      <Head title="Tambah Laporan" />
      <div className="flex flex-col gap-6 p-4 md:flex-row">
        {/* FORM KIRI */}
        <div className="w-full md:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ERROR HANDLER */}
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
              <Input
                id="judul"
                placeholder="Masukkan judul laporan"
                value={data.judul}
                onChange={(e) => setData('judul', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                placeholder="Tuliskan deskripsi"
                value={data.deskripsi}
                onChange={(e) => setData('deskripsi', e.target.value)}
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
              <Label htmlFor="peserta">Jumlah Peserta</Label>
              <Input
                id="peserta"
                placeholder="Masukkan jumlah peserta"
                value={data.peserta}
                onChange={(e) => setData('peserta', e.target.value)}
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
              <Input
                id="lokasi"
                placeholder="Masukkan lokasi"
                value={data.lokasi}
                onChange={(e) => setData('lokasi', e.target.value)}
              />
            </div>

            <div>
                <Label htmlFor="file">Dokumen</Label>
                <Input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                />
            </div>

            <Button type="submit" disabled={processing}>
              <Save className="mr-2 h-4 w-4" /> {processing ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </form>
        </div>
          {/* PREVIEW PDF */}
          <div className="w-full md:w-1/2">
              {previewUrl ? (
                  <div className="border rounded overflow-hidden">
                      <iframe
                          src={previewUrl}
                          width="100%"
                          height="400px"
                          className="md:h-[500px]"
                          title="PDF Preview"
                      />
                  </div>
              ) : (
                  <div className="flex items-center justify-center h-[400px] md:h-[600px] border rounded text-gray-500">
                      Belum ada dokumen dipilih
                  </div>
              )}
          </div>
        </div>
    </AppLayout>
  );
}
