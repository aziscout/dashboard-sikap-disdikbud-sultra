import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-cover bg-center p-10 text-white lg:flex dark:border-r" style={{ backgroundImage: "url('/images/login.png')" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-zinc-900/70 to-slate-800/80" />
                <Link href={route('home')} className="relative z-20 flex items-center text-lg font-semibold transition-colors hover:text-slate-200 gap-3">
                    <AppLogoIcon />
                        {name}
                </Link>
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl sm:w-[380px] dark:border-slate-800 dark:bg-slate-950">
                    <Link href={route('home')} className="relative z-20 mb-4 flex items-center justify-center lg:hidden">
                        <AppLogoIcon />
                    </Link>
                    <div className="flex flex-col items-start gap-3 text-left sm:items-center sm:text-center">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
