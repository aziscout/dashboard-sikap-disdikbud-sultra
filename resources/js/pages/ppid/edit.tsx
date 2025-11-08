import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCustomErrors } from '@/lib/custom-errors';

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'PPID', href: '/ppid' },
  { title: 'Edit PPID', href: '/ppid/edit' },
];

// Dropdown options
const informasiOptions = [
  { value: "Berkala", label: "Berkala" },
  { value: "Setiap Saat", label: "Setiap Saat" },
  { value: "Serta Merta", label: "Serta Merta" },
  { value: "Dikecualikan", label: "Dikecualikan" },
  { value: "Publik", label: "Publik" },
];

// Interface untuk data PPID
interface Ppid {
  id: number;
  judul: string;
  tahun: string;
  informasi: string;
  dokumen_path: string | null;
}

export default function Edit() {
  const { ppid } = usePage<{ ppid: Ppid }>().props;

  const { data, setData, post, errors, progress, processing } = useForm({
    _method: 'PUT',
    judul: ppid.judul || '',
    tahun: ppid.tahun || '',
    informasi: ppid.informasi || '',
    file: null as File | null,
  });

  const customErrors = getCustomErrors(errors);

  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Tampilkan preview file lama
  useEffect(() => {
    if (ppid.dokumen_path) {
      setFilePreview(`/storage/${ppid.dokumen_path}`);
    }
  }, [ppid]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setData('file', null);
      setFilePreview(ppid.dokumen_path ? `/storage/${ppid.dokumen_path}` : null);
      setFileError(null);
      return;
    }

    // Validasi file hanya PDF
    if (file.type !== 'application/pdf') {
      setFileError('Hanya file PDF yang diperbolehkan!');
      e.target.value = '';
      setData('file', null);
      return;
    }

    // Validasi ukuran max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File maksimal 5MB!');
      e.target.value = '';
      setData('file', null);
      return;
    }

    setData('file', file);
    setFilePreview(URL.createObjectURL(file));
    setFileError(null);
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('ppid.update', ppid.id), {
      forceFormData: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit PPID - ${ppid.judul}`} />

      <div className="flex flex-col md:flex-row gap-6 p-4">
        {/* Bagian Kiri: Form */}
        <div className="w-full md:w-1/2 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Judul */}
            <div>
              <Label htmlFor="judul">Judul</Label>
              <Input
                id="judul"
                placeholder="Masukkan Judul Dokumen PPID"
                value={data.judul}
                onChange={(e) => setData('judul', e.target.value)}
                disabled={processing}
              />
              {customErrors.judul && <p className="mt-1 text-sm text-red-600">{customErrors.judul}</p>}
            </div>

            {/* Tahun */}
            <div>
              <Label htmlFor="tahun">Tahun</Label>
              <Input
                id="tahun"
                type="number"
                placeholder="Masukkan Tahun (YYYY)"
                value={data.tahun}
                onChange={(e) => setData('tahun', e.target.value)}
                disabled={processing}
              />
              {customErrors.tahun && <p className="mt-1 text-sm text-red-600">{customErrors.tahun}</p>}
            </div>

            {/* Jenis Informasi */}
            <div>
              <Label htmlFor="informasi">Informasi</Label>
              <Select
                value={data.informasi}
                onValueChange={(value) => setData('informasi', value)}
                disabled={processing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis informasi" />
                </SelectTrigger>
                <SelectContent>
                  {informasiOptions.map((info) => (
                    <SelectItem key={info.value} value={info.value}>
                      {info.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {customErrors.informasi && <p className="mt-1 text-sm text-red-600">{customErrors.informasi}</p>}
            </div>

            {/* File Upload */}
            <div>
              <Label htmlFor="file">Ganti Dokumen (PDF, max 5MB)</Label>
              <Input
                id="file"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={processing}
              />
              {fileError && <p className="mt-1 text-sm text-red-600">{fileError}</p>}
              {customErrors.file && <p className="mt-1 text-sm text-red-600">{customErrors.file}</p>}
            </div>

            {/* Progress Bar */}
            {progress && (
              <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                <div
                  className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                  style={{ width: `${progress.percentage}%` }}
                >
                  {progress.percentage}%
                </div>
              </div>
            )}

            {/* Tombol */}
            <div className="flex space-x-2">
              <Button type="submit" className="w-full md:w-auto" disabled={processing}>
                <Save className="mr-2 h-4 w-4" />
                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.get(route('ppid.index'))}
                disabled={processing}
              >
                Batal
              </Button>
            </div>
          </form>
        </div>

        {/* Bagian Kanan: Preview Dokumen */}
        <div className="w-full md:w-1/2">
          {filePreview ? (
            <iframe
              src={filePreview}
              width="100%"
              height="500px"
              className="border rounded-md"
              title="Preview Dokumen"
            />
          ) : (
            <div className="flex items-center justify-center h-[500px] border rounded-md text-gray-500 bg-gray-50 dark:bg-gray-800">
              Tidak ada dokumen untuk ditampilkan
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
