import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { CircleAlert, Save } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'PPID', href: '/ppid' },
    { title: 'Tambah PPID', href: '/ppid/create' },
];

const informasiOptions = [
    { value: "Berkala", label: "Berkala" },
    { value: "Setiap Saat", label: "Setiap Saat" },
    { value: "Serta Merta", label: "Serta Merta" },
    { value: "Dikecualikan", label: "Dikecualikan" },
];

export default function Create() {
    const { data, setData, post, errors, processing } = useForm({
        judul: '',
        tahun: '',
        informasi: '',
        file: null as File | null,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setData('file', null);
            setPreviewUrl(null);
            setFileError(null);
            return;
        }

        if (file.type !== "application/pdf") {
            setData('file', null);
            setPreviewUrl(null);
            setFileError('Hanya file PDF yang diperbolehkan!');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            setData('file', null);
            setPreviewUrl(null);
            setFileError('File maksimal 5MB');
            return;
        }

        setData('file', file);
        setPreviewUrl(URL.createObjectURL(file));
        setFileError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ppid.store'), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah PPID" />
            <div className="flex flex-col md:flex-row gap-6 p-4">
                {/* Form */}
                <div className="w-full md:w-1/2">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Validation errors */}
                        {(Object.keys(errors).length > 0 || fileError) && (
                            <Alert variant="destructive">
                                <CircleAlert className="h-4 w-4" />
                                <AlertTitle>Terjadi Kesalahan!</AlertTitle>
                                <AlertDescription>
                                    <ul>
                                        {Object.entries(errors).map(([key, message]) => (
                                            <li key={key}>{message as string}</li>
                                        ))}
                                        {fileError && <li>{fileError}</li>}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Judul */}
                        <div>
                            <Label htmlFor="judul">Judul</Label>
                            <Input
                                placeholder="Masukkan Judul"
                                value={data.judul}
                                onChange={(e) => setData("judul", e.target.value)}
                                disabled={processing}
                            />
                        </div>

                        {/* Tahun */}
                        <div>
                            <Label htmlFor="tahun">Tahun</Label>
                            <Input
                                type="number"
                                placeholder="Masukkan Tahun"
                                value={data.tahun}
                                onChange={(e) => setData("tahun", e.target.value)}
                                disabled={processing}
                            />
                        </div>

                        {/* Informasi */}
                        <div>
                            <Label htmlFor="informasi">Informasi</Label>
                            <Select
                                value={data.informasi}
                                onValueChange={(value) => setData('informasi', value)}
                                disabled={processing}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih jenis informasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {informasiOptions.map((info) => (
                                        <SelectItem key={info.value} value={info.value}>
                                            {info.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* File Upload */}
                        <div>
                            <Label htmlFor="file">Dokumen (PDF max 5MB)</Label>
                            <Input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                disabled={processing}
                            />
                        </div>

                        {/* Buttons */}
                        <div className='flex space-x-2'>
                            <Button type="submit" className="w-full md:w-auto" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" /> {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => router.get(route('ppid.index'))} disabled={processing}>
                                Batal
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Preview PDF */}
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
                            Belum ada dokumen PDF dipilih
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
