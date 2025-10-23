import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bidang',
        href: '/bidang/user',
    },
];

interface UserBidang {
    id: number;
    name: string;
    role: string;
    email: string;
    password: string;
}

interface PageProps {
    flash: { message?: string};
    bidang: UserBidang[];
}

export default function Index() {
    const { bidang, flash } = usePage().props as unknown as PageProps;
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bidang" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden md:min-h-min">
                    <h1 className="text-2xl font-semibold">Daftar User Bidang</h1>
                    <div className='mt-4'>
                        <Link href={route('user.create')}>
                            <Button>
                                <Plus /> Tambah
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}