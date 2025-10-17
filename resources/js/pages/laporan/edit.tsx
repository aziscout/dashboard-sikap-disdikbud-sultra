import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { CircleAlert, Save } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Laporan Kegiatan', href: '/laporan' },
    { title: 'Ubah Laporan Kegiatan', href: '/laporan/edit' },
];

interface Dokumen {
    id: number;
    dokumen: string;
}

interface Laporan {
    id: number;
    judul: string;
    deskripsi: string;
    peserta: number | null;
    category: string;
    instansi: string;
    lokasi: string;
    penyelenggara: string;
    dokumens: Dokumen | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    laporan: Laporan;
}

export default function Edit({ laporan }: Props) {
    const { data, setData, post, errors, processing } = useForm({
        judul: laporan.judul ?? '',
        deskripsi: laporan.deskripsi ?? '',
        penyelenggara: laporan.penyelenggara ?? '',
        peserta: laporan.peserta ?? 0,
        instansi: laporan.instansi ?? '',
        lokasi: laporan.lokasi ?? '',
        dokumen: null as File | null,
        _method: 'PUT',
    });

    const [filePreview, setFilePreview] = useState<string | null>(null);
    const existingDoc = laporan.dokumens?.dokumen || null;

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('laporan.update', laporan.id), {
            forceFormData: true,
            onError: (errors) => console.error('Validation errors:', errors),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Laporan" />
            <div className="flex flex-col gap-6 p-4 md:flex-row">
                {/* Form Kiri */}
                <div className="w-full space-y-4 md:w-1/2">
                    <form onSubmit={handleUpdate} className="space-y-4">
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
                                onChange={(e) => setData('judul', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea
                                id="deskripsi"
                                name="deskripsi"
                                placeholder="Deskripsi"
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="penyelenggara">Penyelenggara</Label>
                            <Input
                                id="penyelenggara"
                                name="penyelenggara"
                                placeholder="Penyelenggara"
                                value={data.penyelenggara}
                                onChange={(e) => setData('penyelenggara', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="peserta">Jumlah Peserta</Label>
                            <Input
                                id="peserta"
                                name="peserta"
                                type="number"
                                placeholder="Peserta"
                                value={data.peserta}
                                onChange={(e) => setData('peserta', Number(e.target.value))}
                            />
                        </div>

                        {/* ✅ Instansi - nilai otomatis tampil sesuai laporan.instansi */}
                        <div>
                            <Label htmlFor="instansi">Instansi</Label>
                            <Select value={data.instansi} onValueChange={(value) => setData('instansi', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Instansi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Umum">Umum</SelectItem>
                                    <SelectItem value="SLB">SLB</SelectItem>
                                    <SelectItem value="SMK">SMK</SelectItem>
                                    <SelectItem value="SMA">SMA</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="lokasi">Lokasi</Label>
                            <Input
                                id="lokasi"
                                name="lokasi"
                                placeholder="Lokasi"
                                value={data.lokasi}
                                onChange={(e) => setData('lokasi', e.target.value)}
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
                                        setData('dokumen', file);
                                        setFilePreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        </div>

                        {/* {progress && (
              <div className="text-sm text-gray-500">
                Uploading: {progress.percentage}%
              </div>
            )} */}

                        <div className="flex space-x-2">
                                      <Button type="submit" disabled={processing}>
                                        {processing ? 'Menyimpan...' : <><Save /> Simpan</>}
                                      </Button>
                                      <Button type="button" variant="outline" onClick={() => router.get(route('laporan.index'))}>
                                        Batal
                                      </Button>
                                    </div>

                    </form>
                </div>

                {/* Preview Dokumen */}
                <div className="w-full md:w-1/2">
                    {filePreview || existingDoc ? (
                        <div>
                            <p className="mb-2 text-sm text-gray-500">Preview Dokumen:</p>
                            <iframe
                                src={filePreview ? filePreview : existingDoc?.startsWith('http') ? existingDoc : `/storage/${existingDoc}`}
                                width="100%"
                                height="500px"
                                className="rounded border"
                                title="Preview Dokumen"
                            />
                        </div>
                    ) : (
                        <div className="flex h-[500px] items-center justify-center rounded border text-gray-500">Belum ada dokumen tersedia</div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
