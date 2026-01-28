import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ArrowUpCircle, BadgeCheck, Calendar, Download, Eye, FileText, Hash, History, Layers, Timer, Upload, User, Wallet } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usulan Pangkat', href: '/pangkat/usulan-pangkat' },
    { title: 'Status Kenaikan Pangkat', href: '/pangkat/usulan-pangkat/status' },
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
    tanggal_sk: string;
    masa_gk_tahunan: number;
    masa_gk_bulanan: string;
    pangkat: string;
    gaji_pokok: number;
    kgb_terakhir: string;
    nomor_pertek_bkn: string;
    tanggal_pertek_bkn: string;
    jenis_kp: string;
}

interface Berkas {
    status: string;
    file_sk?: Array<{
        file: string;
        created_at: string;
    }> | null;
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
    const { pegawai, data_diri, berkas } = usePage().props as unknown as PageProps;
    const [status, setStatus] = useState(berkas?.status || 'berkas terkirim');
    const [file, setFile] = useState<File | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const { toast } = useToast();

    const formatRupiah = (value?: number) => {
        if (!value) return '-';
        return 'Rp ' + value.toLocaleString('id-ID');
    };

    const dataDiri = [
        {
            label: 'Nama',
            value: pegawai.nama,
            icon: User,
        },
        {
            label: 'NIP',
            value: pegawai.nip,
            icon: Hash,
        },
        {
            label: 'Golongan/Ruang',
            value: data_diri.golongan_ruang,
            icon: Layers,
        },
        {
            label: 'Jenis Kenaikan Pangkat (KP)',
            value: data_diri?.jenis_kp,
            icon: ArrowUpCircle,
        },
        {
            label: 'Masa Kerja Golongan',
            value: `${data_diri.masa_gk_tahunan} tahun ${data_diri.masa_gk_bulanan} bulan`,
            icon: Timer,
        },
        {
            label: 'TMT Golongan',
            value: data_diri.tmt_golongan,
            icon: Calendar,
        },
        {
            label: 'Jenis Kelamin',
            value: pegawai.jenis_kelamin,
            icon: User,
        },
        {
            label: 'Nomor Surat Keputusan (SK)',
            value: data_diri.nomor_sk,
            icon: FileText,
        },
        {
            label: 'Tanggal Surat Keputusan (SK)',
            value: data_diri.tanggal_sk,
            icon: Calendar,
        },
        {
            label: 'Nomor Pertek BKN',
            value: data_diri.nomor_pertek_bkn,
            icon: Hash,
        },
        {
            label: 'Tanggal Pertek BKN',
            value: data_diri.tanggal_pertek_bkn,
            icon: Calendar,
        },
        {
            label: 'Pangkat',
            value: data_diri.pangkat,
            icon: BadgeCheck,
        },
        {
            label: 'Gaji Pokok',
            value: formatRupiah(data_diri.gaji_pokok),
            icon: Wallet,
        },
        {
            label: 'KGB Terakhir',
            value: data_diri.kgb_terakhir,
            icon: History,
        },
        {
            label: 'File SK',
            value: berkas?.file_sk && Array.isArray(berkas.file_sk) && berkas.file_sk.length > 0 ? 'Tersedia' : 'Belum Ada',
            icon: FileText,
            hasFile: berkas?.file_sk && Array.isArray(berkas.file_sk) && berkas.file_sk.length > 0,
            latestFile: berkas?.file_sk && Array.isArray(berkas.file_sk) && berkas.file_sk.length > 0 ? berkas.file_sk[berkas.file_sk.length - 1].file : null,
        },
    ];

    const handleStatusChange = (value: string) => {
        const prevStatus = status;
        setStatus(value);

        if (value === 'sk telah terbit') {
            toast({
                title: 'Info',
                description: 'Silakan upload file SK terbaru pegawai.',
            });
            return;
        }

        setIsUpdating(true);
        router.post(
            `/pangkat/usulan-pangkat/updateStatus/${pegawai.id}`,
            { status: value },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: 'Berhasil',
                        description: 'Status berhasil diperbarui!',
                    });
                    router.reload({ only: ['pegawai', 'data_diri', 'berkas'] });
                },
                onError: (errors) => {
                    setStatus(prevStatus);
                    toast({
                        title: 'Error',
                        description: errors?.message || 'Status hanya bisa diubah secara berurutan!',
                        variant: 'destructive',
                    });
                },
                onFinish: () => setIsUpdating(false),
            },
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (status !== 'sk telah terbit') {
            toast({
                title: 'Error',
                description: 'Upload hanya bisa dilakukan jika status SK telah terbit.',
                variant: 'destructive',
            });
            return;
        }
        if (!file) {
            toast({
                title: 'Error',
                description: 'Silakan upload file SK terlebih dahulu.',
                variant: 'destructive',
            });
            return;
        }

        const formData = new FormData();
        formData.append('status', status);
        formData.append('file_sk', file);
        setIsUpdating(true);

        router.post(`/pangkat/usulan-pangkat/updateStatus/${pegawai.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'File SK berhasil diunggah dan status diperbarui!',
                });
                setFile(null);
                router.reload({ only: ['pegawai', 'data_diri', 'berkas'] });
            },
            onError: (errors) => {
                toast({
                    title: 'Error',
                    description: Object.values(errors).join('\n'),
                    variant: 'destructive',
                });
            },
            onFinish: () => setIsUpdating(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cek Status Pengajuan" />

            <div className="space-y-6 p-6">
                <div>
                    <div>
                        <h1 className="mb-4 bg-clip-text text-2xl font-bold tracking-tight text-indigo-500">
                            Perbarui status kenaikan pangkat
                        </h1>
                        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Informasi lengkap data diri {pegawai.nama}.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {dataDiri.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={i}
                                    className="flex min-h-[120px] items-center gap-4 rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-indigo-800/50 dark:bg-gray-900"
                                >
                                    {/* ICON */}
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                                        {Icon && <Icon className="h-6 w-6" />}
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex flex-col justify-center flex-1">
                                        <p className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">{item.label}</p>

                                        <p className="mt-1 text-base font-semibold text-gray-900 dark:text-gray-100">{item.value || '-'}</p>
                                    </div>

                                    {/* ACTIONS */}
                                    {item.hasFile && item.latestFile && (
                                        <div className="flex gap-2">
                                            <a
                                                href={`/storage/${item.latestFile}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-lg bg-indigo-500 p-2 text-white shadow-sm transition-all hover:bg-indigo-600"
                                                title="Lihat Dokumen"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </a>
                                            <a
                                                href={`/storage/${item.latestFile}`}
                                                download
                                                className="rounded-lg bg-green-500 p-2 text-white shadow-sm transition-all hover:bg-green-600"
                                                title="Download Dokumen"
                                            >
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Form Update Status */}
                    <form
                        onSubmit={handleSubmit}
                        className="mt-5 flex flex-col items-center justify-center gap-4 rounded-xl border border-indigo-100 bg-indigo-50/40 p-6 backdrop-blur-md dark:border-indigo-800/50 dark:bg-indigo-900/30"
                    >
                        <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
                            <SelectTrigger className="w-full border-indigo-200 dark:border-indigo-800">
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent className="border border-indigo-100 bg-white dark:border-indigo-800 dark:bg-gray-900">
                                <SelectItem value="berkas terkirim">Berkas Terkirim</SelectItem>
                                <SelectItem value="telah dikirim ke bkd">Telah Dikirim Ke BKD</SelectItem>
                                <SelectItem value="telah dikirim ke bkn">Telah Dikirim Ke BKN</SelectItem>
                                <SelectItem value="sk telah terbit">SK Telah Terbit</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Upload Box */}
                        <label
                            className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-all ${
                                status === 'sk telah terbit'
                                    ? 'border-indigo-400 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/40'
                                    : 'cursor-not-allowed border-gray-300 text-gray-400'
                            }`}
                        >
                            <Upload className="mb-2 h-6 w-6" />
                            <span className="text-sm">
                                {status === 'sk telah terbit' ? 'Upload File SK (PDF maks 2MB)' : 'Upload aktif jika status SK telah terbit'}
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
                                    File dipilih: <span className="font-medium text-indigo-600 dark:text-indigo-400">{file.name}</span>
                                </p>
                            )}
                        </label>

                        {status === 'sk telah terbit' && (
                            <Button
                                type="submit"
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-md transition-all hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg"
                                disabled={isUpdating}
                            >
                                Upload SK
                            </Button>
                        )}
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
