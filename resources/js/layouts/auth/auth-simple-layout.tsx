import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthCardLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950 p-6 md:p-10 transition-colors duration-500">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-32 -left-20 w-96 h-96 bg-blue-500/30 dark:bg-blue-700/20 blur-3xl rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-purple-600/20 dark:bg-purple-800/20 blur-3xl rounded-full animate-pulse delay-700" />
                <div className="absolute top-1/2 left-1/2 w-[18rem] h-[18rem] -translate-x-1/2 bg-cyan-400/20 dark:bg-cyan-600/10 blur-3xl rounded-full animate-pulse delay-500" />
            </div>

            <div className="relative z-10 w-full max-w-sm rounded-3xl border border-gray-200/40 dark:border-gray-700/40 bg-white/70 dark:bg-gray-900/60 backdrop-blur-2xl shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all hover:shadow-[0_0_35px_rgba(99,102,241,0.25)] duration-500 p-8">
                <div className="flex flex-col items-center gap-6">
                    <Link href={route('home')} className="flex flex-col items-center gap-3 group">
                            <div className="flex h-full w-full items-center justify-center">
                                <img
                                    src="/logo-dikbud.png"
                                    alt="App Logo"
                                    className="h-20 w-20 object-contain drop-shadow-md"
                                />
                            </div>
                        <span className="sr-only">{title}</span>
                    </Link>

                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-wide text-gray-800 dark:text-gray-100 bg-clip-text">
                            {title}
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="mt-6">{children}</div>

                <p className="mt-8 text-xs text-center text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} Disdikbud Sultra
                    <br />
                </p>
            </div>
        </div>
    );
}
