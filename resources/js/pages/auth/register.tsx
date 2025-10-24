import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    // bidang: string;
    email: string;
    role: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        // bidang: '',
        role : 'admin',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('data ',data);
        
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Buat Akun" description="Masukkan detail Anda di bawah ini untuk membuat akun Anda.">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    {/* name */}
                    {/* <div className="grid gap-2">
                        <Label htmlFor="name">Bidang</Label>
                        <Select value={data.name} onValueChange={(val) => setData('name', val)}>
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
                    </div> */}

                    {/* Nama */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={2}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Nama Lengkap"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={3}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password">Kata Sandi</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Kata Sandi"
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Konfirmasi Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={5}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Konfirmasi Kata Sandi"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    {/* Tombol Submit */}
                    <Button type="submit" className="mt-2 w-full" tabIndex={6} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Buat Akun
                    </Button>
                </div>

                {/* Link ke login */}
                <div className="text-center text-sm text-muted-foreground">
                    Sudah punya akun?{' '}
                    <TextLink href={route('login')} tabIndex={7}>
                        Masuk
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
