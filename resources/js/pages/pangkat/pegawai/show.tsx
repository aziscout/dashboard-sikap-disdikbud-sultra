import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ArrowUpCircle, BadgeCheck, Calendar, FileText, Hash, History, Layers, Timer, Wallet, User, Mail, Phone, MapPin, Building } from 'lucide-react';

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
        {
            label: 'NIP',
            value: pegawai?.nip,
            icon: User,
        },
        {
            label: 'Nama',
            value: pegawai?.nama,
            icon: User,
        },
        {
            label: 'Email',
            value: pegawai?.email,
            icon: Mail,
        },
        {
            label: 'Agama',
            value: pegawai?.agama,
            icon: User,
        },
        {
            label: 'Jenis Kelamin',
            value: pegawai?.jenis_kelamin,
            icon: User,
        },
        {
            label: 'Nomor Telepon',
            value: pegawai?.nomor,
            icon: Phone,
        },
        {
            label: 'Alamat',
            value: pegawai?.alamat,
            icon: MapPin,
        },
        {
            label: 'Tanggal Lahir',
            value: pegawai?.tanggal_lahir,
            icon: Calendar,
        },
        {
            label: 'Tempat Lahir',
            value: pegawai?.tempat_lahir,
            icon: MapPin,
        },
        {
            label: 'Unit Kerja',
            value: pegawai?.unit_kerja,
            icon: Building,
        },
    ];

    const dataDiri = [
        {
            label: 'Golongan/Ruang',
            value: data_diri?.golongan_ruang,
            icon: Layers,
        },
        {
            label: 'Jenis Kenaikan Pangkat (KP)',
            value: data_diri?.jenis_kp,
            icon: ArrowUpCircle,
        },
        {
            label: 'Masa Kerja Golongan',
            value:
            data_diri?.masa_gk_tahunan || data_diri?.masa_gk_bulanan
                ? `${data_diri.masa_gk_tahunan ?? 0} Tahun ${data_diri.masa_gk_bulanan ?? 0} Bulan`
                : '-',
            icon: Timer,
        },
        {
            label: 'TMT Golongan',
            value: data_diri?.tmt_golongan,
            icon: Calendar,
        },
        {
            label: 'Nomor Surat Keputusan (SK)',
            value: data_diri?.nomor_sk,
            icon: FileText,
        },
        {
            label: 'Tanggal Surat Keputusan (SK)',
            value: data_diri?.tanggal_sk,
            icon: Calendar,
        },
        {
            label: 'Nomor Pertek BKN',
            value: data_diri?.nomor_pertek_bkn,
            icon: Hash,
        },
        {
            label: 'Tanggal Pertek BKN',
            value: data_diri?.tanggal_pertek_bkn,
            icon: Calendar,
        },
        {
            label: 'Pangkat',
            value: data_diri?.pangkat,
            icon: BadgeCheck,
        },
        {
            label: 'Gaji Pokok',
            value: data_diri?.gaji_pokok
            ? `Rp ${data_diri.gaji_pokok.toLocaleString('id-ID')}`
            : '-',
            icon: Wallet,
        },
        {
            label: 'KGB Terakhir',
            value: data_diri?.kgb_terakhir,
            icon: History,
        },
    ];


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Pegawai - ${pegawai.nama}`} />

            <div className="container mx-auto p-6 space-y-6">
                {/* HEADER PEGAWAI */}
                <div>
                    <h1
                    className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500
                    bg-clip-text text-transparent tracking-tight mb-4"
                    >
                    Profile Pegawai
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Informasi lengkap profile pegawai {pegawai.nama}.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dataPegawai.map((item, i) => {
                        const Icon = item.icon;
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
                            <div className="flex flex-col justify-center">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                {item.label}
                            </p>

                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                                {item.value || "-"}
                            </p>
                            </div>
                        </div>
                        );
                    })}
                </div>

                {/* HEADER DATA DIRI */}
                <div>
                    <h1
                    className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500
                    bg-clip-text text-transparent tracking-tight mb-4"
                    >
                    Data Diri Pegawai
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Informasi lengkap data diri {pegawai.nama}.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dataDiri.map((item, i) => {
                        const Icon = item.icon;
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
                            <div className="flex flex-col justify-center">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                {item.label}
                            </p>

                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                                {item.value || "-"}
                            </p>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
