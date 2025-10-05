import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Laporan Kegiatan',
    href: '/laporan-kegiatan/create',
  },
];

export default function CreateLaporanKegiatan() {
  const { data, setData, post, errors, processing, reset } = useForm({
    judul: '',
    penyelenggara: '',
    lokasi: '',
    deskripsi: '',
    file: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('laporan-kegiatan.store'), {
      forceFormData: true, // ⚡️ REQUIRED for file upload!
      onSuccess: () => reset(), // optional: clear form after success
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Laporan Kegiatan" />
      <div className="w-full md:w-1/2 p-4 ">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 🔔 Error Display */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <CircleAlert className="h-4 w-4" />
              <AlertTitle>Terjadi Kesalahan!</AlertTitle>
              <AlertDescription>
                <ul className="list-disc ml-5">
                  {Object.entries(errors).map(([key, message]) => (
                    <li key={key}>{message as string}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* 📝 Input Fields */}
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
            <Label htmlFor="file">Upload Dokumen (PDF/DOC/XLS, dll)</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.svg,.webp"
              onChange={(e) => setData('file', e.target.files?.[0] || null)}
            />
          </div>

          <Button type="submit" disabled={processing}>
            {processing ? 'Mengunggah...' : 'Tambah'}
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
