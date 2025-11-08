import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { getCustomErrors } from '@/lib/custom-errors';

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

    const customErrors = getCustomErrors(errors);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [dokumenError, setDokumenError] = useState<string>('');
    const [judulError, setJudulError] = useState<string>('');
    const [deskripsiError, setDeskripsiError] = useState<string>('');
    const [kategoriError, setKategoriError] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        let hasError = false;

        if (!data.judul.trim()) {
            setJudulError('Judul wajib diisi.');
            hasError = true;
        } else {
            setJudulError('');
        }

        if (!data.deskripsi.trim()) {
            setDeskripsiError('Deskripsi wajib diisi.');
            hasError = true;
        } else {
            setDeskripsiError('');
        }

        if (!data.category) {
            setKategoriError('Kategori wajib dipilih.');
            hasError = true;
        } else {
            setKategoriError('');
        }

        if (!data.dokumen) {
            setDokumenError('Dokumen wajib diisi. Silakan pilih file dokumen sebelum menyimpan.');
            hasError = true;
        } else {
            setDokumenError('');
        }

        if (hasError) {
            return;
        }

        post(route('produk-hukum.store'), {
            forceFormData: true,
        })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('dokumen', file);
            setPreviewUrl(URL.createObjectURL(file));
            setDokumenError(''); // Clear error when file is selected
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produk Hukum" />
            <div className="flex flex-col md:flex-row gap-6 p-4">
                {/* FORM */}
                <div className="w-full md:w-1/2">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="judul">Judul</Label>
                            <Input
                                placeholder="Masukkan Judul"
                                value={data.judul}
                                onChange={(e) => {
                                    setData("judul", e.target.value);
                                    if (judulError) setJudulError('');
                                }}
                            />
                            {judulError && <p className="mt-1 text-sm text-red-600">{judulError}</p>}
                            {customErrors.judul && <p className="mt-1 text-sm text-red-600">{customErrors.judul}</p>}
                        </div>

                        <div>
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea
                                placeholder="Deskripsi"
                                value={data.deskripsi}
                                onChange={(e) => {
                                    setData("deskripsi", e.target.value);
                                    if (deskripsiError) setDeskripsiError('');
                                }}
                            />
                            {deskripsiError && <p className="mt-1 text-sm text-red-600">{deskripsiError}</p>}
                            {customErrors.deskripsi && <p className="mt-1 text-sm text-red-600">{customErrors.deskripsi}</p>}
                        </div>

                        <div>
                            <Label htmlFor="category">Kategori</Label>
                            <Select
                                value={data.category}
                                onValueChange={(value) => {
                                    setData('category', value);
                                    if (kategoriError) setKategoriError('');
                                }}
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
                            {kategoriError && <p className="mt-1 text-sm text-red-600">{kategoriError}</p>}
                            {customErrors.category && <p className="mt-1 text-sm text-red-600">{customErrors.category}</p>}
                        </div>

                        <div>
                            <Label htmlFor="file">Dokumen</Label>
                            <Input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                            />
                            {dokumenError && <p className="mt-1 text-sm text-red-600">{dokumenError}</p>}
                            {customErrors.dokumen && <p className="mt-1 text-sm text-red-600">{customErrors.dokumen}</p>}
                        </div>

                        <div className=' flex space-x-2'>
                        <Button type="submit" className="w-full md:w-auto">
                            <Save /> Simpan
                        </Button>
            
                        <Button type="button" variant="outline" onClick={() => router.get(route('inovasi.index'))}>
                            Batal
                        </Button>
                        </div>
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
