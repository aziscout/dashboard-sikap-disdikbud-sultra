import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { 
    ArrowUpCircle, BadgeCheck, Calendar, FileText, Hash, History, 
    Layers, Timer, Wallet, User, Mail, Phone, MapPin, Building,
    Fingerprint, Info
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pegawai', href: '/pangkat/pegawai' },
    { title: 'Detail Pegawai', href: '#' },
];

interface DataDiri {
    golongan_ruang: string;
    jenis_kp: string;
    masa_gk_tahunan: number;
    masa_gk_bulanan: number;
    tmt_golongan: string;
    nomor_sk: string;
    tanggal_sk: string;
    nomor_pertek_bkn: string;
    tanggal_pertek_bkn: string;
    pangkat: string;
    kgb_terakhir: string;
    gaji_pokok: number;
}

interface Pegawai {
    id: number;
    nama: string;
    nip: number;
    nomor: number;
    email: string;
    agama: string;
    alamat: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    unit_kerja: string;
}

interface PageProps {
    pegawai: Pegawai;
    data_diri: DataDiri;
}

export default function Show() {
    const { pegawai, data_diri } = usePage().props as unknown as PageProps;

    const dataPegawai = [
        { label: 'NIP', value: pegawai?.nip, icon: Fingerprint, color: 'text-blue-600' },
        { label: 'Nama Lengkap', value: pegawai?.nama, icon: User, color: 'text-indigo-600' },
        { label: 'Email', value: pegawai?.email, icon: Mail, color: 'text-rose-600' },
        { label: 'Agama', value: pegawai?.agama, icon: Info, color: 'text-amber-600' },
        { label: 'Jenis Kelamin', value: pegawai?.jenis_kelamin, icon: User, color: 'text-sky-600' },
        { label: 'Nomor Telepon', value: pegawai?.nomor, icon: Phone, color: 'text-emerald-600' },
        { label: 'Alamat', value: pegawai?.alamat, icon: MapPin, color: 'text-red-600' },
        { label: 'Tanggal Lahir', value: pegawai?.tanggal_lahir, icon: Calendar, color: 'text-orange-600' },
        { label: 'Tempat Lahir', value: pegawai?.tempat_lahir, icon: MapPin, color: 'text-pink-600' },
        { label: 'Unit Kerja', value: pegawai?.unit_kerja, icon: Building, color: 'text-violet-600' },
    ];

    const dataDiri = [
        { label: 'Golongan/Ruang', value: data_diri?.golongan_ruang, icon: Layers, color: 'text-indigo-600' },
        { label: 'Jenis KP', value: data_diri?.jenis_kp, icon: ArrowUpCircle, color: 'text-blue-600' },
        { label: 'Masa Kerja Golongan', value: data_diri?.masa_gk_tahunan || data_diri?.masa_gk_bulanan ? `${data_diri.masa_gk_tahunan ?? 0} Tahun ${data_diri.masa_gk_bulanan ?? 0} Bulan` : '-', icon: Timer, color: 'text-amber-600' },
        { label: 'TMT Golongan', value: data_diri?.tmt_golongan, icon: Calendar, color: 'text-rose-600' },
        { label: 'Nomor SK', value: data_diri?.nomor_sk, icon: FileText, color: 'text-slate-600' },
        { label: 'Tanggal SK', value: data_diri?.tanggal_sk, icon: Calendar, color: 'text-cyan-600' },
        { label: 'Nomor Pertek BKN', value: data_diri?.nomor_pertek_bkn, icon: Hash, color: 'text-slate-600' },
        { label: 'Tanggal Pertek BKN', value: data_diri?.tanggal_pertek_bkn, icon: Calendar, color: 'text-blue-600' },
        { label: 'Pangkat', value: data_diri?.pangkat, icon: BadgeCheck, color: 'text-emerald-600' },
        { label: 'Gaji Pokok', value: data_diri?.gaji_pokok ? `Rp ${data_diri.gaji_pokok.toLocaleString('id-ID')}` : '-', icon: Wallet, color: 'text-green-600' },
        { label: 'KGB Terakhir', value: data_diri?.kgb_terakhir, icon: History, color: 'text-purple-600' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Pegawai - ${pegawai.nama}`} />

            <div className="min-h-screen bg-[#fdfdff] dark:bg-[#020617] p-6 lg:p-10 space-y-12">
                
                {/* SECTION 1: PROFILE PEGAWAI */}
                <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-indigo-100 dark:border-indigo-900 p-6 md:p-8 shadow-xl shadow-indigo-500/5">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50" />
                    
                    <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
                            <User className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                                Detail <span className="text-indigo-500">Pegawai</span>
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
                <div className="space-y-6">
                    <div className="flex flex-col border-l-4 border-indigo-500 pl-4 py-1">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                            Personal Profile
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                            Informasi identitas dasar dan kontak pegawai
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {dataPegawai.map((item, i) => (
                            <div key={i} className="group relative overflow-hidden bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl transition-all hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1">
                                <div className="flex flex-col gap-4">
                                    <div className={`w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${item.color} transition-colors group-hover:bg-white dark:group-hover:bg-slate-700 shadow-sm`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                            {item.label}
                                        </p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                                            {item.value || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SECTION 2: DATA KEPEGAWAIAN */}
                <div className="space-y-6">
                    <div className="flex flex-col border-l-4 border-emerald-500 pl-4 py-1">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                            Detail
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                            Detail jabatan, pangkat, dan riwayat gaji pokok
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {dataDiri.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-[2rem] transition-all hover:bg-slate-50 dark:hover:bg-slate-800/80">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${item.color} border border-white dark:border-slate-700 shadow-sm`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                        {item.label}
                                    </p>
                                    <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate">
                                        {item.value || "-"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ACTION FOOTER */}
                <div className="flex items-center justify-between p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/30">
                    <div className="flex items-center gap-3 text-indigo-700 dark:text-indigo-400">
                        <Info className="w-5 h-5" />
                        <span className="text-sm font-bold">Data terakhir diperbarui pada {new Date().toLocaleDateString('id-ID')}</span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}