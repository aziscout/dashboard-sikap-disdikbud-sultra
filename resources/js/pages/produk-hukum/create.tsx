import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CircleAlert, Save } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produk Hukum',
        href: '/produk-hukum',
    },
    {
        title: 'Tambah Produk Hukum',
        href: '/produk-hukum/create',
    },
];

const categories = [
    { value: "perda", label: "Peraturan Daerah" },
    { value: "keputusan", label: "Keputusan" },
    { value: "surat-edaran", label: "Surat Edaran" },
    { value: "instruksi", label: "Instruksi" },
    { value: "pedoman", label: "Pedoman" },
    { value: "peraturan", label: "Peraturan Kepala Dinas" },
];

export default function Index() {
    const { data, setData, post, errors } = useForm({
        judul: '', 
        deskripsi: '', 
        category: '', 
        dokumen: null as File | null,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('produk-hukum.store'), {
            forceFormData: true,
        })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('dokumen', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produk Hukum" />
            <div className="flex flex-col md:flex-row gap-6 p-4">
                {/* FORM */}
                <div className="w-full md:w-1/2">
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                placeholder="Masukkan Judul"
                                value={data.judul}
                                onChange={(e) => setData("judul", e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea
                                placeholder="Deskripsi"
                                value={data.deskripsi}
                                onChange={(e) => setData("deskripsi", e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="category">Kategori</Label>
                            <Select 
                                value={data.category}
                                onValueChange={(value) => setData('category', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="file">Dokumen</Label>
                            <Input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                            />
                        </div>

                        <Button type="submit" className="w-full md:w-auto">
                            <Save /> Simpan
                        </Button>
                    </form>
                </div>

                {/* PREVIEW PDF */}
                <div className="w-full md:w-1/2">
                    {previewUrl ? (
                        <div className="border rounded overflow-hidden">
                            <iframe
                                src={previewUrl}
                                width="100%"
                                height="400px"
                                className="md:h-[500px]"
                                title="PDF Preview"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-[400px] md:h-[600px] border rounded text-gray-500">
                            Belum ada dokumen dipilih
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
