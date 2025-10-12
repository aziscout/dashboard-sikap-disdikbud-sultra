import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CircleAlert, Save } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { 
        title: 'Ubah Produk Hukum', 
        href: '/produk-hukum/edit' 
    },
];

interface Dokumen {
    id: number;
    dokumen: string;
}

interface ProdukHukum {
    id: number;
    judul: string;
    deskripsi: string;
    dokumens: Dokumen | null;
    created_at: string;
}

interface Props {
    produkHukum: ProdukHukum;
}

export default function Edit({ produkHukum }: Props) {
    const { data, setData, post, errors, progress } = useForm<{
        judul: string;
        deskripsi: string;
        dokumen?: File | null;
        _method?: string;
    }>({
        judul: produkHukum.judul || '',
        deskripsi: produkHukum.deskripsi || '',
        dokumen: undefined,
    });

    const [filePreview, setFilePreview] = useState<string | null>(null);

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setData(prev => ({ ...prev, _method: 'PUT' }));

        post(route('produk-hukum.update', produkHukum.id), {
            forceFormData: true,
            onError: (errors) => console.error("Validation errors:", errors),
        });
    };

    // dokumen lama
    const existingDoc = produkHukum.dokumens?.dokumen || null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update Produk Hukum" />
            <div className="flex flex-col md:flex-row gap-6 p-4">
                {/* Form Kiri */}
                <div className="w-full md:w-1/2 space-y-4">
                    <form
                        onSubmit={handleUpdate}
                        className="space-y-4"
                        encType="multipart/form-data"
                    >
                        {Object.keys(errors).length > 0 && (
                            <Alert>
                                <CircleAlert className="h-4 w-4" />
                                <AlertTitle>Errors!</AlertTitle>
                                <AlertDescription>
                                    <ul>
                                        {Object.entries(errors).map(([key, message]) => (
                                            <li key={key}>{message as string}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        <div>
                            <Label htmlFor="judul">Judul</Label>
                            <Input
                                id="judul"
                                name="judul"
                                placeholder="Masukkan Judul"
                                value={data.judul}
                                onChange={(e) => setData("judul", e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea
                                id="deskripsi"
                                name="deskripsi"
                                placeholder="Deskripsi"
                                value={data.deskripsi}
                                onChange={(e) => setData("deskripsi", e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="file">Dokumen</Label>
                            <Input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        setData("dokumen", file);
                                        setFilePreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        </div>

                        {progress && (
                            <div className="text-sm text-gray-500">
                                Uploading: {progress.percentage}%
                            </div>
                        )}

                        <Button type="submit" className="w-full md:w-auto">
                            <Save /> Simpan
                        </Button>
                    </form>
                </div>

                {/* Preview Kanan */}
                <div className="w-full md:w-1/2">
                    {(filePreview || existingDoc) ? (
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Preview Dokumen:</p>
                            <iframe
                                src={
                                    filePreview
                                        ? filePreview
                                        : existingDoc?.startsWith('http')
                                            ? existingDoc
                                            : `/storage/${existingDoc}`
                                }
                                width="100%"
                                height="500px"
                                className="border rounded"
                                title="Preview Dokumen"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-[500px] border rounded text-gray-500">
                            Belum ada dokumen tersedia
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
