import { usePage } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

interface User {
    id: number;
    name: string;
    role: string;
    email: string;
    email_verified_at: string | null;
    // You can add other optional fields if needed, e.g.:
    // created_at?: string;
    // updated_at?: string;
}

interface PageProps {
    user: User;
}

export const WelcomeSection = () => {
    const { user } = usePage<PageProps>().props;

    const currentHour = new Date().getHours();
    let greeting = 'Selamat Pagi';

    if (currentHour >= 12 && currentHour < 15) {
        greeting = 'Selamat Siang';
    } else if (currentHour >= 15 && currentHour < 18) {
        greeting = 'Selamat Sore';
    } else if (currentHour >= 18) {
        greeting = 'Selamat Malam';
    }

    return (
        <div className="animate-fade-in relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-purple-600 to-pink-600 p-8 text-white shadow-2xl">
           
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/10 blur-3xl"></div>

            <div className="relative z-10">
                <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 animate-pulse" />
                    <span className="text-sm font-semibold tracking-wider uppercase opacity-90">Dashboard Bidang</span>
                </div>
                <h2 className="mb-2 text-4xl font-bold">{greeting}! 👋</h2>
                <p className="max-w-2xl text-lg opacity-90">
                    Selamat datang kembali di Dashboard{' '}
                    <span className="capitalize">
                        {user.name
                            .split('_')
                            .map((item) => {
                                if (item.length === 3) {
                                    return item.toUpperCase();
                                }
                                return item;
                            })
                            .join(' ')}
                    </span>
                    . Kelola layanan dan laporan kegiatan Anda dengan mudah dan efisien.
                </p>
            </div>
        </div>
    );
};
