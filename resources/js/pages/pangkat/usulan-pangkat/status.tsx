import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, Megaphone, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Usulan Pangkat', href: '/pangkat/usulan-pangkat' },
  { title: 'Cek Status', href: '/pangkat/usulan-pangkat/status' },
];

interface Pegawai {
  id: number;
  nip: string;
  nama: string;
  jenis_kelamin: string;
}

interface DataDiri {
  golongan_ruang: string;
  tmt_golongan: string;
  nomor_sk: string;
  masa_gk_tahunan: number;
  masa_gk_bulanan: string;
  pangkat: string;
  gaji_pokok: number;
}

interface Berkas {
  status: string;
  file_sk?: string | null;
}

interface FlashData {
  message?: string;
  error?: boolean;
}

interface PageProps {
  pegawai: Pegawai;
  data_diri: DataDiri;
  berkas: Berkas;
  flash?: FlashData;
}

export default function Status() {
  const { pegawai, data_diri, berkas, flash } = usePage().props as unknown as PageProps;
  const [status, setStatus] = useState(berkas?.status || 'berkas terkirim');
  const [file, setFile] = useState<File | null>(null);
  const [flashMessage, setFlashMessage] = useState<string | null>(flash?.message || null);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatRupiah = (value?: number) => {
    if (!value) return '-';
    return 'Rp ' + value.toLocaleString('id-ID');
  };

  useEffect(() => {
    if (flash?.message) setFlashMessage(flash.message);
  }, [flash]);

  const handleStatusChange = (value: string) => {
    const prevStatus = status;
    setStatus(value);

    if (value === 'sk telah terbit') {
      setFlashMessage('Silakan upload file SK untuk menyelesaikan proses ini.');
      return;
    }

    setIsUpdating(true);
    router.post(
      `/pangkat/usulan-pangkat/updateStatus/${pegawai.id}`,
      { status: value },
      {
        preserveScroll: true,
        onSuccess: () => {
          setFlashMessage('Status berhasil diperbarui!');
          router.reload({ only: ['pegawai', 'data_diri', 'berkas'] });
        },
        onError: () => {
          setStatus(prevStatus);
          setFlashMessage('Status hanya bisa diubah secara berurutan!');
        },
        onFinish: () => setIsUpdating(false),
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'sk telah terbit') {
      setFlashMessage('Upload hanya bisa dilakukan jika status SK telah terbit.');
      return;
    }
    if (!file) {
      setFlashMessage('Silakan upload file SK terlebih dahulu.');
      return;
    }

    const formData = new FormData();
    formData.append('status', status);
    formData.append('file_sk', file);
    setIsUpdating(true);

    router.post(`/pangkat/usulan-pangkat/updateStatus/${pegawai.id}`, formData, {
      preserveScroll: true,
      onSuccess: () => {
        setFlashMessage('File SK berhasil diunggah dan status diperbarui!');
        setFile(null);
        router.reload({ only: ['pegawai', 'data_diri', 'berkas'] });
      },
      onError: (errors) => {
        setFlashMessage(Object.values(errors).join('\n'));
      },
      onFinish: () => setIsUpdating(false),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Cek Status Pengajuan" />

      <div className="p-6 space-y-6">
        {/* 🔔 Notifikasi */}
        {flashMessage && (
          <div className="w-full md:w-1/2">
            <Alert className="border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50">
              <Megaphone className="h-4 w-4 text-indigo-500" />
              <AlertTitle className="text-indigo-700 dark:text-indigo-300">
                Notifikasi
              </AlertTitle>
              <AlertDescription className="text-gray-700 dark:text-gray-300">
                {flashMessage}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* 💼 Card Status */}
        <Card className="border border-indigo-200 dark:border-indigo-900/50 shadow-lg rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur-lg transition-all">
          <CardHeader className="text-center border-indigo-100 dark:border-indigo-800/40">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Cek Status Pengajuan Pangkat
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* 👤 Data Pegawai */}
            <div className="space-y-2">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { label: 'NIP', value: pegawai.nip },
                  { label: 'Nama', value: pegawai.nama },
                  { label: 'Jenis Kelamin', value: pegawai.jenis_kelamin },
                  {
                    label: 'Masa Kerja Golongan',
                    value: `${data_diri.masa_gk_tahunan} tahun ${data_diri.masa_gk_bulanan} bulan`,
                  },
                  { label: 'Nomor Surat', value: data_diri.nomor_sk },
                  { label: 'TMT Golongan', value: data_diri.tmt_golongan },
                  { label: 'Pangkat', value: data_diri.pangkat },
                  { label: 'Golongan/Ruang', value: data_diri.golongan_ruang },
                  { label: 'Gaji Pokok', value: formatRupiah(data_diri.gaji_pokok) },
                ].map((item, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-2 py-2 text-sm sm:text-base hover:bg-indigo-50/40 dark:hover:bg-indigo-900/30 transition-all rounded-lg px-2"
                  >
                    <span className="font-medium text-sm text-gray-700 dark:text-indigo-300">
                      {item.label}
                    </span>
                    <span className="text-gray-900 text-sm dark:text-gray-200">
                      : {item.value || '-'}
                    </span>
                  </li>
                ))}
              </ul>

              {berkas?.file_sk && (
                <div className="mt-4">
                  <a
                    href={`/storage/berkas/${berkas.file_sk}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <FileText className="w-4 h-4" /> Lihat File SK
                  </a>
                </div>
              )}
            </div>

            {/* 📤 Form Update Status */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 items-center justify-center border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-6 bg-indigo-50/40 dark:bg-indigo-900/30 backdrop-blur-md"
            >
              <Select
                value={status}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-full border-indigo-200 dark:border-indigo-800">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-800">
                  <SelectItem value="berkas terkirim">Berkas Terkirim</SelectItem>
                  <SelectItem value="telah dikirim ke bkd">
                    Telah Dikirim Ke BKD
                  </SelectItem>
                  <SelectItem value="telah dikirim ke bkn">
                    Telah Dikirim Ke BKN
                  </SelectItem>
                  <SelectItem value="sk telah terbit">SK Telah Terbit</SelectItem>
                </SelectContent>
              </Select>

              {/* Upload Box */}
              <label
                className={`w-full cursor-pointer border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all ${
                  status === 'sk telah terbit'
                    ? 'border-indigo-400 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/40'
                    : 'border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Upload className="w-6 h-6 mb-2" />
                <span className="text-sm">
                  {status === 'sk telah terbit'
                    ? 'Upload File SK (PDF maks 2MB)'
                    : 'Upload aktif jika status SK telah terbit'}
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) setFile(selectedFile);
                  }}
                  className="hidden"
                  disabled={status !== 'sk telah terbit'}
                />
                {file && (
                  <p className="mt-3 text-sm text-gray-600 italic dark:text-gray-300">
                    File dipilih:{' '}
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                      {file.name}
                    </span>
                  </p>
                )}
              </label>

              {status === 'sk telah terbit' && (
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all"
                  disabled={isUpdating}
                >
                  Upload SK
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
