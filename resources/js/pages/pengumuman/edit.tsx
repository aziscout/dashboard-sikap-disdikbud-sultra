import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Pengumuman', href: '/pengumuman' },
  { title: 'Edit Pengumuman', href: '/pengumuman/edit' },
];

interface Pengumuman {
  id: number;
  judul: string;
  deskripsi: string;
  lokasi: string;
  penyelenggara: string;
  category: string;
  instansi: string;
  tabel: string | null;
  coverImage: string | null;
  created_at: string;
}

interface PageProps {
  pengumuman: Pengumuman;
}

// 🔹 Helper to extract YouTube ID
function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);

    // Format: https://www.youtube.com/watch?v=VIDEOID
    if (u.hostname.includes('youtube.com')) {
      return u.searchParams.get('v');
    }

    // Format: https://youtu.be/VIDEOID
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1); // remove leading "/"
    }

    return null;
  } catch {
    return null;
  }
}

export default function Edit() {
  const { pengumuman } = usePage().props as unknown as PageProps;

  const { data, setData, post, errors, processing } = useForm({
    judul: pengumuman.judul || '',
    penyelenggara: pengumuman.penyelenggara || '',
    lokasi: pengumuman.lokasi || '',
    deskripsi: pengumuman.deskripsi || '',
    category: pengumuman.category || '',
    instansi: pengumuman.instansi || '',
    coverImage: null as File | null,
    file: null as File | null,
    youtube: pengumuman.category === 'video' && pengumuman.tabel ? pengumuman.tabel : '',
    _method: 'PUT',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('pengumuman.update', pengumuman.id), {
      preserveScroll: true,
      forceFormData: true,
    });
  };

  const isPdf = pengumuman.tabel?.toLowerCase().endsWith('.pdf');
  const isImage = pengumuman.tabel?.toLowerCase().match(/\.(png|jpg|jpeg|gif)$/);
  const previewSrc = data.category === 'video' ? data.youtube : pengumuman.tabel;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Pengumuman" />
      <div className="flex space-x-4 p-4">
        {/* FORM KIRI */}
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
              <Input id="judul" value={data.judul} onChange={(e) => setData('judul', e.target.value)} />
            </div>

            <div>
              <Label htmlFor="penyelenggara">Penyelenggara</Label>
              <Input id="penyelenggara" value={data.penyelenggara} onChange={(e) => setData('penyelenggara', e.target.value)} />
            </div>

            <div>
              <Label htmlFor="lokasi">Lokasi</Label>
              <Input id="lokasi" value={data.lokasi} onChange={(e) => setData('lokasi', e.target.value)} />
            </div>

            <div>
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea id="deskripsi" value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} />
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
                {pengumuman.tabel && !pengumuman.tabel.startsWith('http') && (
                  <p className="mt-1 text-sm text-gray-500">File saat ini: {pengumuman.tabel.split('/').pop()}</p>
                )}
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

            <div className="flex space-x-2">
              <Button type="submit" disabled={processing}>
                {processing ? 'Updating...' : 'Update'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.get(route('pengumuman.index'))}>
                Batal
              </Button>
            </div>
          </form>
        </div>

        {/* PREVIEW FILE */}
        <div className="w-1/2">
          <h3 className="mb-4 text-lg font-semibold capitalize">{data.youtube ? 'Video Pengumuman' : 'Dokumen Pengumuman'}</h3>
          {previewSrc ? (
            <div className="rounded border p-4">
              {data.category === 'video' ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(previewSrc)}`}
                  width="100%"
                  height="400px"
                  title="YouTube Video"
                  allowFullScreen
                />
              ) : isPdf ? (
                <iframe src={`/storage/${previewSrc}`} width="100%" height="600px" title="PDF Viewer" />
              ) : isImage ? (
                <img src={`/storage/${previewSrc}`} alt="Document" className="h-auto max-w-full" />
              ) : (
                <p>
                  File type not supported.{' '}
                  <a href={`/storage/${previewSrc}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    Download
                  </a>
                </p>
              )}
            </div>
          ) : (
            <>
              {pengumuman.tabel && (
                <div className="mt-2">
                  <iframe
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${getYouTubeId(pengumuman.tabel)}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
