import { useState, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import LayananTable from '@/components/ui/layanan-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Layanan', href: '/layanan' }];

interface Layanan {
  id: number;
  judul: string;
  nama_pengirim: string;
  email_pengirim: string;
  kode_tracking: string;
  status: 'Diterima' | 'Diproses' | 'Selesai' | 'Ditolak';
  created_at: string;
  bidang: string;
}

interface PageProps {
  auth: any;
  layanans: Layanan[];
}

export default function Index() {
  const { layanans } = usePage<PageProps>().props;
  const [filterStatus, setFilterStatus] = useState<'Semua' | 'Diterima' | 'Diproses' | 'Selesai' | 'Ditolak'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const filteredLayanan = useMemo(() => {
    let filtered = layanans || [];

    if (filterStatus !== 'Semua') {
      filtered = filtered.filter((l) => l.status === filterStatus);
    }
    if (selectedDate) {
      filtered = filtered.filter((l) => l.created_at.startsWith(selectedDate));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.judul.toLowerCase().includes(q) ||
          l.nama_pengirim.toLowerCase().includes(q) ||
          l.email_pengirim.toLowerCase().includes(q) ||
          l.kode_tracking.toLowerCase().includes(q) ||
          l.bidang.toLowerCase().includes(q),
      );
    }
    return filtered;
  }, [layanans, filterStatus, searchQuery, selectedDate]);

  const handleDetail = (id: number) => {
    router.visit(`/layanan/${id}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Layanan" />
      <div className="container mx-auto space-y-6 p-6">
        {/* Header */}
            <h1 className="text-2xl font-bold mb-1">Manajemen Layanan</h1>
        <div className="flex flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className=" flex flex-wrap items-center gap-2 ">
              <span className="text-sm text-muted-foreground">Total: {layanans.length}</span>
              <div className="flex flex-wrap gap-3 ">
                <Badge className="border-blue-200 bg-blue-100 text-xs text-blue-800 p-2">
                  Diterima: {layanans.filter((l) => l.status === 'Diterima').length}
                </Badge>
                <Badge className="border-yellow-200 bg-yellow-100 text-xs text-yellow-800 p-2">
                  Diproses: {layanans.filter((l) => l.status === 'Diproses').length}
                </Badge>
                <Badge className="border-green-200 bg-green-100 text-xs text-green-800 p-2">
                  Selesai: {layanans.filter((l) => l.status === 'Selesai').length}
                </Badge>
                <Badge className="border-red-200 bg-red-100 text-xs text-red-800 p-2">
                  Ditolak: {layanans.filter((l) => l.status === 'Ditolak').length}
                </Badge>
              </div>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari laporan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-8"
              />
            </div>
            <div className="w-full sm:w-36">
              <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val as typeof filterStatus)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Semua">Semua Status</SelectItem>
                  <SelectItem value="Diterima">Diterima</SelectItem>
                  <SelectItem value="Diproses">Diproses</SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                  <SelectItem value="Ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-40">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <LayananTable data={filteredLayanan} onDetail={handleDetail} />
      </div>
    </AppLayout>
  );
}
