import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Mail,
  User,

} from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Layanan",
    href: "/layanan",
  },
];

interface Layanan {
  id: number;
  judul: string;
  nama_pengirim: string;
  email_pengirim: string;
  kode_tracking: string;
  status: "Diterima" | "Diproses" | "Selesai" | "Ditolak";
  created_at: string;
  bidang: string;
}

interface PageProps {
  auth: any;
  layanans: Layanan[];
}

export default function index() {
  const { auth, layanans } = usePage<PageProps>().props;

  const [filterStatus, setFilterStatus] = useState<
    "Semua" | "Diterima" | "Diproses" | "Selesai" | "Ditolak"
  >("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLayanan = useMemo(() => {
    let filtered = layanans || [];

    // Filter by status
    if (filterStatus !== "Semua") {
      filtered = filtered.filter((l) => l.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.judul.toLowerCase().includes(query) ||
          l.nama_pengirim.toLowerCase().includes(query) ||
          l.email_pengirim.toLowerCase().includes(query) ||
          l.kode_tracking.toLowerCase().includes(query) ||
          l.bidang.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [layanans, filterStatus, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Diterima":
        return "bg-blue-100 text-blue-800 border-blue-200 ";
      case "Diproses":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Selesai":
        return "bg-green-100 text-green-800 border-green-200";
      case "Ditolak":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-white-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Diterima":
        return "bg-blue-100 text-black border-blue-200";
      case "Diproses":
        return "bg-yellow-100 text-black border-yellow-200";
      case "Selesai":
        return "bg-green-100 text-black border-green-200";
      case "Ditolak":
        return "bg-red-100 text-black border-red-200";
      default:
        return "bg-gray-100 text-black border-gray-200";
    }
  };

  const handleDelete = (id: number, judul: string) => {
    if (!confirm(`Yakin ingin menghapus laporan "${judul}"?`)) return;
    router.delete(`/layanan/${id}`);
  };

  const handleDetail = (id: number) => {
    router.visit(`/layanan/${id}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Layanan" />
      <div className="w-full p-4 space-y-4">
        {/* Header Compact - Overview dan Filter dalam satu baris */}
        <h1 className="text-2xl font-bold">Manajemen Layanan</h1>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground px-3 text-black-600">
                  Total  : {layanans.length}
                </span>
              
              <div className="flex flex-wrap gap-2 ">
                <Badge className={`text-xs px-2  py-2 border ${getStatusBadgeColor("Diterima")}`}>
                  Diterima: {layanans.filter(l => l.status === "Diterima").length}
                </Badge>
                <Badge className={`text-xs px-2 py-2 border ${getStatusBadgeColor("Diproses")}`}>
                  Diproses: {layanans.filter(l => l.status === "Diproses").length}
                </Badge>
                <Badge className={`text-xs px-2 py-2 border ${getStatusBadgeColor("Selesai")}`}>
                  Selesai: {layanans.filter(l => l.status === "Selesai").length}
                </Badge>
                <Badge className={`text-xs px-2 py-2 border ${getStatusBadgeColor("Ditolak")}`}>
                  Ditolak: {layanans.filter(l => l.status === "Ditolak").length}
                </Badge>
              </div>
            </div>
          </div>

          {/* Search dan Filter dalam satu baris */}
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari laporan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
            <div className="w-full sm:w-36">
              <Select
                value={filterStatus}
                onValueChange={(val) => setFilterStatus(val as typeof filterStatus)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
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
          </div>
        </div>

        {/* Results */}
        {filteredLayanan.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <p className="font-medium">Tidak ada laporan</p>
                <p className="text-sm mt-1">
                  {searchQuery || filterStatus !== "Semua"
                    ? "Coba ubah filter atau kata kunci pencarian"
                    : "Belum ada laporan yang masuk"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className=" hover:bg-blue-50">
                    <TableHead className="text-black-900 font-semibold min-w-[250px] lg:min-w-[300px]">Judul Laporan</TableHead>
                    <TableHead className="text-black-900 font-semibold min-w-[120px] lg:min-w-[150px]">Pengirim</TableHead>
                    <TableHead className="text-black-900 font-semibold min-w-[160px] lg:min-w-[200px]">Email</TableHead>
                    <TableHead className="text-black-900 font-semibold min-w-[120px] lg:min-w-[140px]">Tracking</TableHead>
                    <TableHead className="text-black-900 font-semibold min-w-[100px] lg:min-w-[110px]">Status</TableHead>
                    <TableHead className="text-black-900 font-semibold min-w-[130px] lg:min-w-[150px]">Waktu/Tanggal</TableHead>
                    <TableHead className="text-black-900 font-semibold min-w-[80px] lg:min-w-[100px] text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLayanan.map((l) => (
                    <TableRow key={l.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                      <TableCell className="min-w-[250px] lg:min-w-[300px]">
                        <div className="max-w-full truncate" title={l.judul}>
                          {l.judul}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 truncate">
                          {l.bidang}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[120px] lg:min-w-[150px]">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="truncate" title={l.nama_pengirim}>
                            {l.nama_pengirim}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[160px] lg:min-w-[200px]">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span 
                            className="truncate min-w-0" 
                            title={l.email_pengirim}
                          >
                            {l.email_pengirim}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[120px] lg:min-w-[140px]">
                        <code className="text-xs bg-white-100 px-2 py-1 rounded font-mono border truncate block max-w-full">
                          {l.kode_tracking}
                        </code>
                      </TableCell>
                      <TableCell className="min-w-[100px] lg:min-w-[110px]">
                        <Badge className={`text-xs border ${getStatusColor(l.status)} truncate max-w-full`}>
                          {l.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-[130px] lg:min-w-[150px]">
                        <div className="text-xs text-muted-foreground">
                          <div className="whitespace-nowrap">
                            {new Date(l.created_at).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="whitespace-nowrap">
                            {new Date(l.created_at).toLocaleDateString("id-ID")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[80px] lg:min-w-[100px]">
                        <div className="flex justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDetail(l.id)}
                            className="h-8 px-3 whitespace-nowrap"
                            title="Detail"
                          >
                            Detail
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}