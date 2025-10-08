import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, useForm, usePage } from '@inertiajs/react';
import { CircleAlert, Save, X } from 'lucide-react';
import { useState } from 'react';

interface Logo { file: string; }
interface Hero { file: string; }

interface PageProps extends InertiaPageProps {
    logo: Logo | null;
    heroes: Hero[];
    errors: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { 
        title: 'Dashboard', 
        href: '/dashboard' 
    },
    { 
        title: 'Ubah Logo & Hero Section', 
        href: '/dashboard/edit' 
    },
];

export default function Edit() {
    const { logo, heroes, errors } = usePage<PageProps>().props;

    const { data, setData, post, processing } = useForm({
        logo: null as File | null,
        hero: [] as File[],
        _existing_logo: logo ? logo.file : '',
        _existing_heroes: heroes?.map((h) => h.file) || [],
    });

    const [existingHeroPaths, setExistingHeroPaths] = useState<string[]>(
        heroes?.map((h) => h.file) || []
    );

    const [logoPreview, setLogoPreview] = useState<string | null>(
        logo ? `/storage/${logo.file}` : null
    );

    const [heroPreviews, setHeroPreviews] = useState<string[]>(
        heroes?.map((h) => `/storage/${h.file}`) || []
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.dashboard.update'), { forceFormData: true });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('logo', file);
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
            setData('_existing_logo', '');
        } else {
            setData('_existing_logo', logo ? logo.file : '');
            setLogoPreview(logo ? `/storage/${logo.file}` : null);
        }
    };

    const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newFiles = Array.from(files).slice(0, 3);
        setData('hero', newFiles);
        setExistingHeroPaths([]);
        setData('_existing_heroes', []);
        setHeroPreviews(newFiles.map((f) => URL.createObjectURL(f)));
    };

    const removeHeroImage = (index: number) => {
        const numExisting = existingHeroPaths.length;

        if (index < numExisting) {
            const updatedExisting = [...existingHeroPaths];
            updatedExisting.splice(index, 1);
            setExistingHeroPaths(updatedExisting);
            setData('_existing_heroes', updatedExisting);

            setHeroPreviews([
                ...updatedExisting.map((p) => `/storage/${p}`),
                ...data.hero.map((f) => URL.createObjectURL(f)),
            ]);
        } else {
            const newIndex = index - numExisting;
            const updatedNewFiles = [...(data.hero || [])];
            if (newIndex >= 0 && newIndex < updatedNewFiles.length) {
                updatedNewFiles.splice(newIndex, 1);
                setData('hero', updatedNewFiles);
            }
            setHeroPreviews([
                ...existingHeroPaths.map((p) => `/storage/${p}`),
                ...updatedNewFiles.map((f) => URL.createObjectURL(f)),
            ]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Edit Logo & Hero Section" />

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
            {Object.keys(errors).length > 0 && (
                <Alert variant="destructive">
                    <CircleAlert className="h-4 w-4" />
                    <AlertTitle>Terjadi Kesalahan</AlertTitle>
                    <AlertDescription>
                    <ul>
                        {Object.entries(errors).map(([key, message]) => (
                        <li key={key}>{message}</li>
                        ))}
                    </ul>
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LOGO */}
            <div className="space-y-4 border rounded-lg p-4">
                <h2 className="font-semibold text-lg mb-2">Logo</h2>
                <Label htmlFor="logo">Pilih Logo Baru</Label>
                <Input name="logo" id="logo" type="file" accept="image/*" onChange={handleLogoChange} />

                <div className="mt-4">
                <h3 className="font-medium mb-2">Preview Logo</h3>
                {logoPreview ? (
                    <div className="border rounded flex justify-center">
                    <img src={logoPreview} alt="Logo Preview" className="h-32 object-contain p-2" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-32 border rounded text-gray-500 p-2">
                    Belum ada logo dipilih
                    </div>
                )}
                </div>
            </div>

            {/* HERO */}
            <div className="space-y-4 border rounded-lg p-4">
                <h2 className="font-semibold text-lg mb-2">Hero Section</h2>
                <Label htmlFor="hero">Pilih Hero (max 3)</Label>
                <Input name="hero" id="hero" type="file" accept="image/*" multiple onChange={handleHeroChange} />

                <div className="mt-4">
                <h3 className="font-medium mb-2">Preview Hero</h3>
                {heroPreviews.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                    {heroPreviews.map((preview, index) => (
                        <div key={index} className="relative border rounded">
                        <img src={preview} alt={`Hero ${index + 1}`} className="h-32 w-full object-cover rounded" />
                        <button type="button" onClick={() => removeHeroImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                            <X size={14} />
                        </button>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-32 border rounded text-gray-500">
                    Belum ada gambar hero
                    </div>
                )}
                </div>
            </div>
            </div>

            <Button type="submit" className="w-full md:w-auto" disabled={processing}>
            <Save className="mr-2" /> Simpan
            </Button>
        </form>
        </AppLayout>
    );
}
