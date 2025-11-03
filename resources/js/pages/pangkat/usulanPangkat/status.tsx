import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Megaphone, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Usulan Pangkat', href: '/pangkat/usulanPangkat' },
  { title: 'Cek Status', href: '/pangkat/usulanPangkat/status' },
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
  // const [flashError, setFlashError] = useState<boolean>(flash?.error || false);
  const [isUpdating, setIsUpdating] = useState(false);

  // 🧠 Jika backend mengirim flash error (status gagal diperbarui)
  useEffect(() => {
    if (flash?.message) {
      setFlashMessage(flash.message);
      // setFlashError(!!flash.error);
    }
  }, [flash]);

  // 🔄 Update status
  const handleStatusChange = (value: string) => {
    const prevStatus = status;
    setStatus(value);

    // 🟡 Jika admin memilih "SK telah terbit" → jangan kirim dulu
    if (value === 'sk telah terbit') {
      setFlashMessage('Silakan upload file SK untuk menyelesaikan proses ini.');
      return; // tidak kirim ke backend dulu
    }

    // 🟢 Jika status lain → kirim langsung ke backend
    setIsUpdating(true);
    router.post(
      `/pangkat/usulanPangkat/updateStatus/${pegawai.id}`,
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

  // 📎 Submit file SK (bersamaan dengan update status)
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

    router.post(`/pangkat/usulanPangkat/updateStatus/${pegawai.id}`, formData, {
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
      <div className="p-6">
        {flashMessage && (
          <div className="mb-4">
            <Alert>
              <Megaphone className="h-4 w-4" />
              <AlertTitle>Notifikasi</AlertTitle>
              <AlertDescription>{flashMessage}</AlertDescription>
            </Alert>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">
              Cek Status Pengajuan
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data Pegawai */}
            <div>
              <ul className="space-y-2 text-sm">
                <li><strong>NIP</strong> : {pegawai.nip}</li>
                <li><strong>Nama</strong> : {pegawai.nama}</li>
                <li><strong>Jenis Kelamin</strong> : {pegawai.jenis_kelamin}</li>
                <li><strong>Masa Kerja Golongan (Tahun)</strong> : {data_diri.masa_gk_tahunan}</li>
                <li><strong>Masa Kerja Golongan (Bulan)</strong> : {data_diri.masa_gk_bulanan}</li>
                <li><strong>Nomor Surat</strong> : {data_diri.nomor_sk}</li>
                <li><strong>TMT Golongan</strong> : {data_diri?.tmt_golongan}</li>
                <li><strong>Golongan/Ruang</strong> : {data_diri?.golongan_ruang}</li>
                <li className="text-gray-500 italic mt-3">
                  Dibuat pada: {new Date().toLocaleDateString('id-ID')}
                </li>
              </ul>

              {berkas?.file_sk && (
                <div className="mt-4">
                  <a
                    href={`/storage/berkas/${berkas.file_sk}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex gap-2"
                  >
                    <FileText /> Lihat File SK
                  </a>
                </div>
              )}
            </div>

            {/* Form Update */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center justify-center border rounded-lg p-6">
              <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="berkas terkirim">Berkas Terkirim</SelectItem>
                  <SelectItem value="telah dikirim ke bkd">Telah Dikirim Ke BKD</SelectItem>
                  <SelectItem value="telah dikirim ke bkn">Telah Dikirim Ke BKN</SelectItem>
                  <SelectItem value="sk telah terbit">SK Telah Terbit</SelectItem>
                </SelectContent>
              </Select>

              <label
                className={`w-full cursor-pointer border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center transition ${
                  status === 'sk telah terbit'
                    ? 'border-blue-400 text-blue-500'
                    : 'border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Upload className="w-6 h-6 mb-2" />
                <span>
                  {status === 'sk telah terbit'
                    ? 'Upload File SK (PDF maks 2MB)'
                    : 'Upload aktif ketika status SK telah terbit'}
                </span>

                {/* Input file */}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      setFile(selectedFile);
                    }
                  }}
                  className="hidden"
                  disabled={status !== 'sk telah terbit'}
                />

                {/* ✅ Tampilkan nama file yang dipilih */}
                {file && (
                  <p className="mt-3 text-sm text-gray-600 italic">
                    File dipilih: <span className="font-medium text-blue-600">{file.name}</span>
                  </p>
                )}
              </label>


              {status === 'sk telah terbit' && (
                <Button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700 w-full"
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
