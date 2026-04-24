import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Download, Eye, FileText, User, FileCheck2, AlertCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Arsip Kenaikan Gaji Berkala', href: '/pangkat/arsip-kgb' },
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
        { label: 'SK Pangkat Terakhir', key: 'sk_pangkat_terakhir', icon: FileCheck2, desc: 'Golongan/pangkat saat ini' },
        { label: 'SK Gaji Berkala', key: 'sk_gaji_berkala', icon: FileText, desc: 'Riwayat kenaikan gaji berkala' },
    ];

    const getLatestFile = (key: keyof Berkas): string | null => {
        const value = berkas?.[key];

        if (!value) return null;

        if (typeof value === 'string') {
            return value;
        }

        if (Array.isArray(value) && value.length > 0) {
            return value[value.length - 1].file;
        }

        return null;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Riwayat - ${pegawai.nama}`} />

            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 md:p-8 space-y-8">

                {/* HERO / PROFILE HEADER SECTION */}
                <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-indigo-100 dark:border-indigo-900 p-6 md:p-8 shadow-xl shadow-indigo-500/5">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50" />

                    <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
                            <User className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                                Detail <span className="text-indigo-500">Arsip Gaji Berkala</span>
                            </h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 dark:text-slate-400 font-medium text-sm">
                                <span className="text-slate-900 dark:text-slate-200 font-bold">{pegawai.nama}</span>
                                <span className="hidden md:block text-slate-300">|</span>
                                <span>{pegawai.email}</span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-bold tracking-wider border border-emerald-100 dark:border-emerald-800">
                                    Verified Profile
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GRID DOKUMEN */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                            Dokumen Gaji Berkala
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {daftarBerkas.map((item, i) => {
                            const Icon = item.icon;
                            const latestFile = getLatestFile(item.key as keyof Berkas);
                            const isAvailable = !!latestFile;

                            return (
                                <div
                                    key={i}
                                    className={`group relative rounded-3xl border transition-all duration-300 p-6 ${
                                        isAvailable
                                        ? 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900 shadow-sm hover:shadow-xl hover:-translate-y-1'
                                        : 'bg-slate-50 dark:bg-slate-900/50 border-dashed border-slate-200 dark:border-slate-800'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-2xl transition-colors ${
                                            isAvailable
                                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white'
                                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                                        }`}>
                                            <Icon className="w-6 h-6" />
                                        </div>

                                        {isAvailable ? (
                                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Tersedia
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 py-1">
                                                <AlertCircle className="w-3 h-3" />
                                                Kosong
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-1 mb-6">
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">
                                            {item.label}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                                            {item.desc}
                                        </p>
                                    </div>

                                    {/* ACTIONS AREA */}
                                    <div className="flex items-center gap-2">
                                        {isAvailable ? (
                                            <>
                                                <a
                                                    href={`/storage/${latestFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/10"
                                                >
                                                    <Eye className="w-4 h-4" /> Pratinjau
                                                </a>
                                                
                                                <a
                                                    href={`/storage/${latestFile}`}
                                                    download
                                                    className="p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-all"
                                                    title="Download"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </a>
                                            </>
                                        ) : (
                                            <div className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 text-center text-[10px] font-bold uppercase tracking-widest bg-slate-50/50 dark:bg-slate-900/50">
                                                Belum Diunggah
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}