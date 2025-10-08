// import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem } from '@/types';
// import { Head } from '@inertiajs/react';

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Dashboard',
//         href: '/dashboard',
//     },
// ];

// export default function Dashboard() {
//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Dashboard" />
//             <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                
//                 <div className="grid auto-rows-min gap-4 md:grid-cols-3">
//                     <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
//                         <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
//                     </div>
//                     <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
//                         <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
//                     </div>
//                     <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
//                         <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
//                     </div>
//                 </div>
//                 <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
//                     <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FileText, CheckCircle, Clock, Folder, Users, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Simple StatsCard component
const StatsCard = ({ title, value, icon: Icon, variant, trend }: any) => {
    const variantClasses = {
        default: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
        info: "bg-cyan-50 border-cyan-200 dark:bg-cyan-950 dark:border-cyan-800",
        success: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
        warning: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
    };

    return (
        <Card className={`border-2 ${variantClasses[variant as keyof typeof variantClasses]}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold mt-1">{value}</p>
                        {trend && (
                            <div className={`flex items-center gap-1 mt-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {trend.isPositive ? (
                                    <ArrowUpRight className="h-4 w-4" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4" />
                                )}
                                <span>{trend.value}% dari bulan lalu</span>
                            </div>
                        )}
                    </div>
                    <div className={`p-3 rounded-full ${variantClasses[variant as keyof typeof variantClasses]} bg-opacity-50`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Simple ActivityFeed component
const ActivityFeed = () => {
    const activities = [
        { id: 1, action: 'Laporan baru diterima', user: 'Ahmad Santoso', time: '5 menit lalu', type: 'success' },
        { id: 2, action: 'Status laporan diubah', user: 'Siti Rahayu', time: '1 jam lalu', type: 'info' },
        { id: 3, action: 'Dokumen diunggah', user: 'Budi Pratama', time: '2 jam lalu', type: 'warning' },
        { id: 4, action: 'Laporan selesai', user: 'Maria Wijaya', time: '3 jam lalu', type: 'success' },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Aktivitas Terbaru
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0 last:pb-0">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                                activity.type === 'success' ? 'bg-green-500' :
                                activity.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                            }`} />
                            <div className="flex-1">
                                <p className="font-medium text-sm">{activity.action}</p>
                                <p className="text-sm text-muted-foreground">{activity.user}</p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// Simple QuickActions component
const QuickActions = () => {
    const actions = [
        { label: 'Buat Laporan Baru', icon: FileText, href: '/layanan/create' },
        { label: 'Lihat Semua Laporan', icon: Folder, href: '/layanan' },
        { label: 'Manajemen Pengguna', icon: Users, href: '/users' },
        { label: 'Laporan Bulanan', icon: Calendar, href: '/reports' },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Aksi Cepat
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {actions.map((action, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start gap-3 h-12"
                            onClick={() => window.location.href = action.href}
                        >
                            <action.icon className="h-4 w-4" />
                            {action.label}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// Simple ServiceChart component (placeholder)
const ServiceChart = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Statistik Layanan
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                    <div className="text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Grafik statistik layanan akan ditampilkan di sini</p>
                        <p className="text-sm text-muted-foreground mt-2">(Chart component dapat ditambahkan kemudian)</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6 overflow-x-auto">
                
                {/* Header */}
                <div className="border-b border-sidebar-border/70 pb-6 dark:border-sidebar-border">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Dashboard Bidang
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Selamat datang! Berikut ringkasan aktivitas dan layanan Anda
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Layanan"
                        value="24"
                        icon={Folder}
                        variant="default"
                        trend={{ value: 12, isPositive: true }}
                    />
                    <StatsCard
                        title="Laporan Aktif"
                        value="8"
                        icon={FileText}
                        variant="info"
                        trend={{ value: 5, isPositive: true }}
                    />
                    <StatsCard
                        title="Kegiatan Selesai"
                        value="156"
                        icon={CheckCircle}
                        variant="success"
                        trend={{ value: 8, isPositive: true }}
                    />
                    <StatsCard
                        title="Tugas Pending"
                        value="5"
                        icon={Clock}
                        variant="warning"
                        trend={{ value: 2, isPositive: false }}
                    />
                </div>

                {/* Dashboard Grid */}
                <div className="grid gap-6 lg:grid-cols-3 flex-1">
                    {/* Left Column - 2/3 width */}
                    <div className="lg:col-span-2 space-y-6">
                        <ServiceChart />
                        <ActivityFeed />
                    </div>

                    {/* Right Column - 1/3 width */}
                    <div className="space-y-6">
                        <QuickActions />
                        
                        {/* Additional Info Card */}
                        <div className="rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-6">
                            <h3 className="font-semibold text-lg mb-2">Tips Hari Ini</h3>
                            <p className="text-sm text-muted-foreground">
                                Jangan lupa untuk memperbarui laporan kegiatan mingguan Anda sebelum akhir pekan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}