import { Card, CardContent } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { Head, usePage } from '@inertiajs/react'
import { Users, TrendingUp, CalendarClock, ChevronRight, Award } from 'lucide-react'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Analytics', href: '/pangkat/dashboard' },
]

interface Pegawai {
    nama: string
    nip: string
    unit_kerja: string
    tmt_golongan?: string
    kgb_terakhir?: string
}

interface PageProps {
    totalPegawai: number
    totalNaikPangkat: number
    totalSiapNaikKgb: number
    pegawaiNaikPangkat: Pegawai[]
    pegawaiNaikKgb: Pegawai[]
}

export default function Index() {
    const {
        totalPegawai,
        totalNaikPangkat,
        totalSiapNaikKgb,
        pegawaiNaikPangkat,
        pegawaiNaikKgb,
    } = usePage().props as unknown as PageProps

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Executive Dashboard" />

            <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-10 space-y-10">
                
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        Dashboard <span className="text-indigo-600">Kepegawaian</span>
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Pantau status kenaikan pangkat dan gaji berkala pegawai secara real-time.
                    </p>
                </div>

                {/* Premium Stat Cards */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {[
                        { 
                            label: 'Total Pegawai', 
                            value: totalPegawai, 
                            icon: Users, 
                            color: 'indigo',
                            subtext: 'Terdaftar aktif'
                        },
                        { 
                            label: 'Siap Naik Pangkat', 
                            value: totalNaikPangkat, 
                            icon: Award, 
                            color: 'rose',
                            subtext: 'Periode berjalan'
                        },
                        { 
                            label: 'Siap Naik Gaji', 
                            value: totalSiapNaikKgb, 
                            icon: CalendarClock, 
                            color: 'emerald',
                            subtext: 'KGB Terdekat'
                        },
                    ].map((stat, i) => (
                        <Card key={i} className="group relative overflow-hidden border-none bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-xl">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                                            {stat.label}
                                        </p>
                                        <h3 className="text-4xl font-black tracking-tighter text-slate-900">
                                            {stat.value}
                                        </h3>
                                        <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                                            <ChevronRight className="w-3 h-3 text-indigo-500" /> {stat.subtext}
                                        </p>
                                    </div>
                                    <div className={`rounded-2xl p-4 transition-colors bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white`}>
                                        <stat.icon className="h-7 w-7" />
                                    </div>
                                </div>
                            </CardContent>
                            {/* Decorative Background Element */}
                            <div className={`absolute -right-4 -bottom-4 h-24 w-24 rounded-full opacity-[0.03] bg-${stat.color}-600 transition-transform group-hover:scale-150`} />
                        </Card>
                    ))}
                </div>

                {/* Data Tables Section */}
                <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
                    
                    {/* Table Kenaikan Pangkat */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-sm">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Kenaikan Pangkat</h2>
                            </div>
                            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                                {pegawaiNaikPangkat.length} Pegawai
                            </span>
                        </div>

                        <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-slate-100">
                                        <TableHead className="w-[60px] text-center font-bold text-slate-500">#</TableHead>
                                        <TableHead className="font-bold text-slate-900">Pegawai</TableHead>
                                        <TableHead className="font-bold text-slate-900">NIP</TableHead>
                                        <TableHead className="font-bold text-slate-900">Unit Kerja</TableHead>
                                        <TableHead className="font-bold text-slate-900">TMT</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pegawaiNaikPangkat.length > 0 ? (
                                        pegawaiNaikPangkat.map((p, index) => (
                                            <TableRow key={index} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="text-center font-medium text-slate-400 text-xs">{index + 1}</TableCell>
                                                <TableCell className="font-bold text-slate-700">{p.nama}</TableCell>
                                                <TableCell className="font-mono text-[11px] text-slate-500">{p.nip}</TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                                                        {p.unit_kerja}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-bold text-rose-600 text-sm italic">{p.tmt_golongan}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow><TableCell colSpan={5} className="h-32 text-center text-slate-400">Kosong</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Table Kenaikan Gaji Berkala */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-sm">
                                    <CalendarClock className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Gaji Berkala (KGB)</h2>
                            </div>
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                                {totalSiapNaikKgb} Pegawai
                            </span>
                        </div>

                        <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-slate-100">
                                        <TableHead className="w-[60px] text-center font-bold text-slate-500">#</TableHead>
                                        <TableHead className="font-bold text-slate-900">Pegawai</TableHead>
                                        <TableHead className="font-bold text-slate-900">NIP</TableHead>
                                        <TableHead className="font-bold text-slate-900">Unit Kerja</TableHead>
                                        <TableHead className="font-bold text-slate-900">KGB Terakhir</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pegawaiNaikKgb.length > 0 ? (
                                        pegawaiNaikKgb.map((p, index) => (
                                            <TableRow key={index} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="text-center font-medium text-slate-400 text-xs">{index + 1}</TableCell>
                                                <TableCell className="font-bold text-slate-700">{p.nama}</TableCell>
                                                <TableCell className="font-mono text-[11px] text-slate-500">{p.nip}</TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                                                        {p.unit_kerja}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-bold text-emerald-600 text-sm italic">{p.kgb_terakhir}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow><TableCell colSpan={5} className="h-32 text-center text-slate-400">Kosong</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}