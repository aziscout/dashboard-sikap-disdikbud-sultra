import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CircleAlert, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tambah Pengumuman',
        href: '/pengumuman/create',
    },
];

export default function Index() {
    const { data, setData, post, errors, processing } = useForm({
        judul: '',
        penyelenggara: '',
        lokasi: '',
        deskripsi: '',
        category: '',
        instansi: '',
        file: null as File | null,
        youtube: '',
    });


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pengumuman.store'), {
            forceFormData: true, // penting untuk upload file
        });
    };

    const previewSrc = data.category === 'video' ? data.youtube : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Pengumuman" />
            <div className="flex space-x-4 p-4">
                {/* FORM */}
                <div className="w-1/2">
                    <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
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
                        <Input id="judul" placeholder="Masukkan Judul" value={data.judul} onChange={(e) => setData('judul', e.target.value)} />
                    </div>

                    <div>
                        <Label htmlFor="penyelenggara">Penyelenggara</Label>
                        <Input
                            id="penyelenggara"
                            placeholder="Masukkan Penyelenggara"
                            value={data.penyelenggara}
                            onChange={(e) => setData('penyelenggara', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="lokasi">Lokasi</Label>
                        <Input id="lokasi" placeholder="Masukkan Lokasi" value={data.lokasi} onChange={(e) => setData('lokasi', e.target.value)} />
                    </div>

                    <div>
                        <Label htmlFor="deskripsi">Deskripsi</Label>
                        <Textarea
                            id="deskripsi"
                            placeholder="Tuliskan deskripsi pengumuman"
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label>Kategori</Label>
                        <Select value={data.category} onValueChange={(val) => setData('category', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="foto">Foto</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Instansi</Label>
                        <Select value={data.instansi} onValueChange={(val) => setData('instansi', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih instansi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="umum">Umum</SelectItem>
                                <SelectItem value="slb">SLB</SelectItem>
                                <SelectItem value="smk">SMK</SelectItem>
                                <SelectItem value="sma">SMA</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {data.category === 'foto' ? (
                        <div>
                            <Label htmlFor="file">Upload Foto/Dokumen</Label>
                            <Input id="file" type="file" accept="image/*" onChange={(e) => setData('file', e.target.files?.[0] || null)} />
                        </div>
                    ) : data.category === 'video' ? (
                        <div>
                            <Label htmlFor="youtube">YouTube URL</Label>
                            <Input
                                id="youtube"
                                type="url"
                                placeholder="https://youtube.com/watch?v=..."
                                value={data.youtube}
                                onChange={(e) => setData('youtube', e.target.value)}
                            />
                        </div>
                    ) : null}

                    <Button type="submit" disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        {processing ? 'Menyimpan...' : 'Tambah'}
                    </Button>
                </form>
                </div>

                {/* PREVIEW */}
                <div className="w-1/2">
                    <h3 className="mb-4 text-lg font-semibold">Preview Dokumen</h3>
                    {previewSrc ? (
                        <div className="rounded border p-4">
                            <iframe
                                src={`https://www.youtube.com/embed/${previewSrc.split('v=')[1]}`}
                                width="100%"
                                height="400px"
                                title="YouTube Video"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <p>Tidak ada preview.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
