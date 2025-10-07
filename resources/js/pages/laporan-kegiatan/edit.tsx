import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laporan Kegiatan',
        href: '/laporan-kegiatan',
    },
    {
        title: 'Edit Laporan Kegiatan',
        href: '/laporan-kegiatan/edit',
    },
];

interface LaporanKegiatan {
    id: number;
    judul: string;
    deskripsi: string;
    lokasi: string;
    penyelenggara: string;
    file: string;
    created_at: string;
}

interface PageProps {
    laporanKegiatan: LaporanKegiatan;
}

interface LaporanFormData {
    judul: string;
    penyelenggara: string;
    lokasi: string;
    deskripsi: string;
    file: File | null;
    _method: string;
    [key: string]: any;
}

export default function Edit() {
    const { laporanKegiatan } = usePage().props as unknown as PageProps;

    const { data, setData, post, errors, processing } = useForm<LaporanFormData>({
        judul: laporanKegiatan.judul || '',
        penyelenggara: laporanKegiatan.penyelenggara || '',
        lokasi: laporanKegiatan.lokasi || '',
        deskripsi: laporanKegiatan.deskripsi || '',
        file: null,
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Use POST with _method: PUT for file uploads
        post(route('laporan-kegiatan.update', laporanKegiatan.id), {
            preserveScroll: true,
            forceFormData: true, // This ensures multipart/form-data
        });
    };

    const isPdf = laporanKegiatan.file?.toLowerCase().endsWith('.pdf');
    const isImage = laporanKegiatan.file?.toLowerCase().match(/\.(png|jpg|jpeg|gif)$/);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Laporan Kegiatan" />
            <div className="flex space-x-4 p-4">
                <div className="w-1/2">
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
                                id="judul"
                                placeholder="Judul"
                                onChange={(e) => setData('judul', e.target.value)}
                                value={data.judul}
                            />
                        </div>

                        <div>
                            <Label htmlFor="penyelenggara">Penyelenggara</Label>
                            <Input
                                id="penyelenggara"
                                placeholder="Penyelenggara"
                                value={data.penyelenggara}
                                onChange={(e) => setData('penyelenggara', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="lokasi">Lokasi</Label>
                            <Input
                                id="lokasi"
                                placeholder="Lokasi"
                                value={data.lokasi}
                                onChange={(e) => setData('lokasi', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea
                                id="deskripsi"
                                placeholder="Deskripsi"
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="file">File (Tambahkan file baru untuk mengganti)</Label>
                            <Input 
                                id="file" 
                                type="file" 
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={(e) => setData('file', e.target.files?.[0] || null)} 
                            />
                            {laporanKegiatan.file && (
                                <p className="text-sm text-gray-500 mt-1">
                                    File saat ini: {laporanKegiatan.file.split('/').pop()}
                                </p>
                            )}
                        </div>

                        <div className="flex space-x-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update'}
                            </Button>
                            
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => router.get(route('laporan-kegiatan.index'))}
                            >
                                Batal
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="w-1/2">
                    <h3 className="mb-4 text-lg font-semibold">Dokumen Laporan Kegiatan</h3>
                    {laporanKegiatan.file ? (
                        <div className="rounded border p-4">
                            {isPdf ? (
                                <iframe 
                                    src={`/storage/${laporanKegiatan.file}`} 
                                    width="100%" 
                                    height="600px" 
                                    title="PDF Viewer" 
                                />
                            ) : isImage ? (
                                <img 
                                    src={`/storage/${laporanKegiatan.file}`} 
                                    alt="Document" 
                                    className="h-auto max-w-full" 
                                />
                            ) : (
                                <p>
                                    File type not supported for preview.{' '}
                                    <a
                                        href={`/storage/${laporanKegiatan.file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        Download
                                    </a>
                                </p>
                            )}
                        </div>
                    ) : (
                        <p>Tidak ada dokumen yang diunggah.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}