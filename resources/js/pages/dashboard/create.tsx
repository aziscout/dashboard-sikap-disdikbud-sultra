import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CircleAlert, Save, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
{ 
    title: 'Dashboard', 
    href: '/dashboard' 
},
{ 
    title: 'Tambah Logo & Hero Section', 
    href: '/dashboard/create' 
},
];

export default function CreateLogoHero() {
const { data, setData, post, errors } = useForm({
    logo: null as File | null,
    hero: [] as File[],
});

const [logoPreview, setLogoPreview] = useState<string | null>(null);
const [heroPreviews, setHeroPreviews] = useState<string[]>([]);

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('dashboard.store'), { forceFormData: true });
};

const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
    setData('logo', file);
    setLogoPreview(URL.createObjectURL(file));
    }
};

const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    const combined = [...data.hero, ...newFiles].slice(0, 3); // max 3 gambar
    setData('hero', combined);
    setHeroPreviews(combined.map((file) => URL.createObjectURL(file)));
};

const removeHeroImage = (index: number) => {
    const updatedFiles = [...data.hero];
    const updatedPreviews = [...heroPreviews];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setData('hero', updatedFiles);
    setHeroPreviews(updatedPreviews);
};

return (
    <AppLayout breadcrumbs={breadcrumbs}>
    <Head title="Create Logo & Hero" />

    <form onSubmit={handleSubmit} className="p-4 space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* === LOGO SECTION === */}
        <div className="space-y-4 border rounded-lg p-4">
            <h2 className="font-semibold text-lg mb-2">Upload Logo</h2>

            <Label htmlFor="logo">Logo</Label>
            <Input type="file" accept="image/*" onChange={handleLogoChange} />

            <div className="mt-4">
            <h3 className="font-medium mb-2">Preview Logo</h3>
            {logoPreview ? (
                <div className="border rounded flex justify-center">
                <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="h-32 object-contain p-2"
                />
                </div>
            ) : (
                <div className="flex items-center justify-center h-32 border rounded text-gray-500 p-2">
                Belum ada logo dipilih
                </div>
            )}
            </div>
        </div>

        {/* === HERO SECTION === */}
        <div className="space-y-4 border rounded-lg p-4">
            <h2 className="font-semibold text-lg mb-2">Upload Hero Section</h2>

            <Label htmlFor="hero">Hero (max 3 gambar)</Label>
            <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleHeroChange}
            />

            <div className="mt-4">
            <h3 className="font-medium mb-2">Preview Hero</h3>
            {heroPreviews.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                {heroPreviews.map((preview, index) => (
                    <div key={index} className="relative border rounded">
                    <img
                        src={preview}
                        alt={`Hero ${index + 1}`}
                        className="h-32 w-full object-cover rounded"
                    />
                    <button
                        type="button"
                        onClick={() => removeHeroImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                        <X size={14} />
                    </button>
                    </div>
                ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-32 border rounded text-gray-500">
                Belum ada gambar hero dipilih
                </div>
            )}
            </div>
        </div>
        </div>
        <Button type="submit" className="w-full md:w-auto">
            <Save /> Simpan
        </Button>
    </form>
    </AppLayout>
);
}
