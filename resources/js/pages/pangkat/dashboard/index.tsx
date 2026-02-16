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
import { ArrowUpCircle, Users } from 'lucide-react'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Beranda', href: '/pangkat/dashboard' },
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
            <Head title="Dashboard Pangkat" />

            <div className="flex flex-col gap-8 p-6">

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card className="border-border shadow-sm">
                        <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                            Total Pegawai
                            </p>
                            <p className="mt-1 text-3xl font-bold">
                            {totalPegawai}
                            </p>
                        </div>
                        <div className="rounded-xl bg-indigo-600/10 p-3 text-indigo-600">
                            <Users className="h-7 w-7" />
                        </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm">
                        <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                            Siap Naik Pangkat
                            </p>
                            <p className="mt-1 text-3xl font-bold">
                            {totalNaikPangkat}
                            </p>
                        </div>
                        <div className="rounded-xl bg-rose-500/10 p-3 text-rose-500">
                            <ArrowUpCircle className="h-7 w-7" />
                        </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm">
                        <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                            Siap Naik Gaji Berkala
                            </p>
                            <p className="mt-1 text-3xl font-bold">
                            {totalSiapNaikKgb}
                            </p>
                        </div>
                        <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-500">
                            <ArrowUpCircle className="h-7 w-7" />
                        </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-indigo-600">
                        Kenaikan Pangkat
                    </h2>

                    <div className="overflow-hidden rounded-lg border border-border">
                        <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                            <TableHead className="w-[60px] text-center">No</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>NIP</TableHead>
                            <TableHead>Unit Kerja</TableHead>
                            <TableHead>TMT Golongan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pegawaiNaikPangkat.length > 0 ? (
                            pegawaiNaikPangkat.map((p, index) => (
                                <TableRow key={index} className="hover:bg-muted/40">
                                <TableCell className="text-center">
                                    {index + 1}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {p.nama}
                                </TableCell>
                                <TableCell>{p.nip}</TableCell>
                                <TableCell>{p.unit_kerja}</TableCell>
                                <TableCell>{p.tmt_golongan}</TableCell>
                                </TableRow>
                            ))
                            ) : (
                            <TableRow>
                                <TableCell
                                colSpan={5}
                                className="py-8 text-center text-muted-foreground"
                                >
                                Tidak ada pegawai yang siap naik pangkat.
                                </TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-indigo-600">
                        Kenaikan Gaji Berkala
                    </h2>

                    <div className="overflow-hidden rounded-lg border border-border">
                        <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                            <TableHead className="w-[60px] text-center">No</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>NIP</TableHead>
                            <TableHead>Unit Kerja</TableHead>
                            <TableHead>KGB Terakhir</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pegawaiNaikKgb.length > 0 ? (
                            pegawaiNaikKgb.map((p, index) => (
                                <TableRow key={index} className="hover:bg-muted/40">
                                <TableCell className="text-center">
                                    {index + 1}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {p.nama}
                                </TableCell>
                                <TableCell>{p.nip}</TableCell>
                                <TableCell>{p.unit_kerja}</TableCell>
                                <TableCell>{p.kgb_terakhir}</TableCell>
                                </TableRow>
                            ))
                            ) : (
                            <TableRow>
                                <TableCell
                                colSpan={5}
                                className="py-8 text-center text-muted-foreground"
                                >
                                Tidak ada pegawai yang siap naik gaji berkala.
                                </TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
