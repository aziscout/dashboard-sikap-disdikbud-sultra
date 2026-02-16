import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Rocket, Construction, Clock } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pensiun',
        href: '/pangkat/pensiun',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Coming Soon" />
            
            <div className="flex h-full flex-1 flex-col items-center justify-center p-4">
                {/* Background Pattern yang halus agar tidak kosong melompong */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <PlaceholderPattern className="size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                </div>

                <div className="relative z-10 flex max-w-md flex-col items-center text-center">
                    {/* Icon Section */}
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Rocket className="size-10 animate-bounce" />
                    </div>

                    {/* Text Section */}
                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                        Sedang Dikembangkan
                    </h1>
                    <p className="mb-8 text-neutral-500 dark:text-neutral-400">
                        Halaman pensiun sedang dalam tahap pengembangan. Kami sedang menyiapkan fitur terbaik untuk Anda. Silakan cek kembali nanti!
                    </p>

                    {/* Progress Badge / Status */}
                    <div className="flex items-center gap-4 rounded-lg border border-sidebar-border bg-sidebar p-4 shadow-sm">
                        <Construction className="size-5 text-yellow-500" />
                        <div className="text-left">
                            <p className="text-sm font-medium">Status Pengerjaan</p>
                            <p className="text-xs text-neutral-500">Tahap Implementasi UI & Data</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1 text-xs font-medium text-primary">
                            <Clock className="size-3" />
                            <span>Segera</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}