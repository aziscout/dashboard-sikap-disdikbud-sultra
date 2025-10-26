import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { CircleAlert, Save } from 'lucide-react';
import InputError from '@/components/input-error';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bidang',
        href: '/bidang/user',
    },
    {
        title: 'Tambah User Bidang',
        href: '/bidang/user/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', 
        email: '', 
        password: '',  
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('user.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} >
            <Head title="Tambah User Bidang" />
            <div className="flex flex-col md:flex-row gap-6 p-4">
                <div className="w-full md:w-1/2">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {Object.keys(errors).length > 0 && (
                            <Alert variant="destructive">
                                <CircleAlert className="h-4 w-4" />
                                <AlertTitle>Terjadi Kesalahan!</AlertTitle>
                                <AlertDescription>
                                    <ul>
                                        {Object.entries(errors).map(([key, message]) => (
                                            <li key={key}>{message}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Pilihan Bidang */}
                        <div>
                            <Label htmlFor="name">Bidang</Label>
                            <Select 
                                value={data.name}
                                onValueChange={(value) => setData('name', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Bidang" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bidang_sma">Bidang Pembinaan SMA</SelectItem>
                                    <SelectItem value="bidang_smk">Bidang Pembinaan SMK</SelectItem>
                                    <SelectItem value="bidang_pklk">Bidang Pembinaan PK-LK</SelectItem>
                                    <SelectItem value="bidang_gtk">Bidang GTK</SelectItem>
                                    <SelectItem value="bidang_perencanaan">Bidang Perencanaan dan Penganggaran</SelectItem>
                                    <SelectItem value="bidang_kebudayaan">Bidang Kebudayaan</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.name} />
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Masukkan email bidang"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Masukkan password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* Konfirmasi Password */}
                        <div>
                            <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                placeholder="Ulangi password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        {/* Tombol */}
                        <div className="flex space-x-2">
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" /> Simpan
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.get(route('user.index'))}
                            >
                                Batal
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
