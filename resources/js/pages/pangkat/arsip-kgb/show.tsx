import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Download, Eye, FileText } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Arsip Kenaikan Pangkat', href: '/pangkat/arsip-pangkat' },
    { title: 'Detail Arsip', href: '#' },
];

interface BerkasObject {
    file: string;
    created_at?: string;
}

interface Berkas {
    id: number;
    sk_gaji_berkala?: BerkasObject[];
    sk_pangkat_terakhir?: BerkasObject[];
    status?: string;
    created_at: string;
}

interface Pegawai {
    id: number;
    nama: string;
    email: string;
    jenis_kelamin: string;
    alamat: string;
}

interface PageProps {
    pegawai: Pegawai;
    berkas: Berkas;
}

export default function Show() {
    const { pegawai, berkas } = usePage().props as unknown as PageProps;

    const daftarBerkas = [
        
        { label: 'SK Pangkat Terakhir', key: 'sk_pangkat_terakhir', icon: FileText },
        { label: 'SK Gaji Berkala', key: 'sk_gaji_berkala', icon: FileText },
        
    ];

    const getLatestFile = (key: keyof Berkas): string | null => {
        const value = berkas?.[key];

        if (!value) return null;

        // untuk sk_cpns & sk_pns (string)
        if (typeof value === 'string') {
            return value;
        }

        // untuk JSON array
        if (Array.isArray(value) && value.length > 0) {
            return value[value.length - 1].file;
        }

        return null;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Riwayat - ${pegawai.nama}`} />

            <div className="container mx-auto p-6 space-y-6">
                {/* HEADER BERKAS */}
                <div>
                    <h1
                    className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500
                    bg-clip-text text-transparent tracking-tight mb-4"
                    >
                    Arsip Berkas
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Daftar arsip berkas {pegawai.nama}.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {daftarBerkas.map((item, i) => {
                        const Icon = item.icon;
                        const latestFile = getLatestFile(item.key as keyof Berkas);
                        return (
                        <div
                            key={i}
                            className="
                            rounded-2xl
                            border border-indigo-200 dark:border-indigo-800/50
                            bg-white dark:bg-gray-900
                            shadow-sm hover:shadow-lg
                            transition-all
                            p-6
                            min-h-[120px]
                            flex gap-4
                            items-center
                            "
                        >
                            {/* ICON */}
                            <div
                            className="
                                flex items-center justify-center
                                w-12 h-12
                                rounded-xl
                                bg-indigo-100 text-indigo-600
                                dark:bg-indigo-900/40 dark:text-indigo-400
                            "
                            >
                            {Icon && <Icon className="w-6 h-6" />}
                            </div>

                            {/* CONTENT */}
                            <div className="flex flex-col justify-center flex-1">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                {item.label}
                            </p>

                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                                {latestFile ? 'Tersedia' : 'Belum Ada'}
                            </p>


                            {/* ACTIONS */}
                            </div>
                            <div>
                                {latestFile && (
                                    <div className="flex gap-2 mt-2">
                                        <a
                                            href={`/storage/${latestFile}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-lg bg-indigo-500 p-2 text-white shadow-sm transition-all hover:bg-indigo-600"
                                            title="Lihat Dokumen"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </a>
                                        <a
                                            href={`/storage/${latestFile}`}
                                            download
                                            className="rounded-lg bg-green-500 p-2 text-white shadow-sm transition-all hover:bg-green-600"
                                            title="Download Dokumen"
                                        >
                                            <Download className="h-4 w-4" />
                                        </a>
                                    </div>
                                )}

                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
