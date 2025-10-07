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
  Eye,
  Trash2,
  Calendar,
  Mail,
  User,
  Hash,
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Diterima":
        return "default"; // Biru
      case "Diproses":
        return "secondary"; // Kuning
      case "Selesai":
        return "destructive"; // Hijau
      case "Ditolak":
        return "outline"; // Merah
      default:
        return "outline";
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
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Compact - Overview dan Filter dalam satu baris */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Manajemen Layanan</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">
                Total: {layanans.length}
              </span>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default" className="text-xs px-2 py-1">
                  Diterima: {layanans.filter(l => l.status === "Diterima").length}
                </Badge>
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  Diproses: {layanans.filter(l => l.status === "Diproses").length}
                </Badge>
                <Badge variant="destructive" className="text-xs px-2 py-1">
                  Selesai: {layanans.filter(l => l.status === "Selesai").length}
                </Badge>
                <Badge variant="outline" className="text-xs px-2 py-1">
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
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul Laporan</TableHead>
                    <TableHead>Pengirim</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tracking</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Waktu/Tanggal</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLayanan.map((l) => (
                    <TableRow key={l.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="max-w-[200px] truncate" title={l.judul}>
                          {l.judul}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {l.bidang}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-3 w-3 text-muted-foreground" />
                          {l.nama_pengirim}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate max-w-[120px]" title={l.email_pengirim}>
                            {l.email_pengirim}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                          {l.kode_tracking}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(l.status)} className="text-xs">
                          {l.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-muted-foreground">
                          {new Date(l.created_at).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          <div className="text-xs text-muted-foreground">
                            {new Date(l.created_at).toLocaleDateString("id-ID")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDetail(l.id)}
                            className="h-8 w-8 p-0"
                            title="Detail"
                          >
                            <Eye className="h-6 w-6" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(l.id, l.judul)}
                            className="h-8 w-8 p-0"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
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