import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CalendarDays, Megaphone, Plus, Scale, SquarePen, Trash2 } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produk Hukum',
        href: '/produk-hukum',
    },
];

interface ProdukHukum {
    id:number,
    judul:string,
    deskripsi:string,
    dokumen:string,
    created_at:string,
}


interface CustomPageProps {
    flash: {
        message?: string;
    };
    produk_hukum: ProdukHukum[];
}

type PageProps = InertiaPageProps & CustomPageProps;

export default function Index() {

    const { produk_hukum, flash } = usePage<PageProps>().props;

    const { processing, delete: destroy } = useForm();

    const handleDelete = (id: number, judul: string) => {
        if (confirm(`Apakah anda yakin ingin menghapus - ${id}. ${judul}`)) {
        destroy(`/produk-hukum/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produk Hukum" />

            {/* Tombol Tambah */}
            <div className="m-4 flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Daftar Produk Hukum</h1>
                <Link href={route('produk-hukum.create')}>
                    <Button>
                        <Plus /> Tambah
                    </Button>
                </Link>
            </div>

            {/* Flash Message */}
            <div className="w-full md:w-1/2 px-4">
                {flash.message && (
                    <Alert>
                        <Megaphone className="h-4 w-4" />
                        <AlertTitle>Notification!</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Daftar Produk Hukum */}
            {produk_hukum.length > 0 && (
                <div className="m-4 space-y-4">
                    {produk_hukum.map((produk) => (
                        <div
                            key={produk.id}
                            className="bg-white dark:bg-background rounded-2xl shadow-sm p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between dark:hover:bg-sidebar transition"
                        >
                            {/* Info Produk */}
                            <div className="space-y-2 flex-1">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                    <Scale />
                                    {produk.judul}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">{produk.deskripsi}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                                    <CalendarDays />
                                    {new Date(produk.created_at).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>

                            {/* Aksi */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <Link href={route("produk-hukum.edit", produk.id)}>
                                    <Button className="bg-blue-950 hover:bg-blue-900 w-full sm:w-auto">
                                        <SquarePen /> Ubah
                                    </Button>
                                </Link>
                                <Button
                                    disabled={processing}
                                    onClick={() => handleDelete(produk.id, produk.judul)}
                                    className="bg-red-600 hover:bg-red-500 w-full sm:w-auto"
                                >
                                    <Trash2 /> Hapus
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
