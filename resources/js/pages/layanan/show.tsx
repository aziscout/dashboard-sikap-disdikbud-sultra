import { useState } from "react";
import { router, usePage, Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  FileText,
  User,
  Tag,
  Hash,
  ArrowLeft,
  Image,
  File,
  Download,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Layanan", href: "/layanan" },
  { title: "Detail", href: "/layanan/index" },
];

interface MediaFile {
  file: string;
  type: string;
}

interface Media {
  id: number;
  file: MediaFile[];
  created_at: string;
  updated_at: string;
}

interface Dokumen {
  id: number;
  dokumen: string;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  layanan: {
    id: number;
    judul: string;
    deskripsi: string;
    bidang: string;
    nama_pengirim: string;
    email_pengirim: string;
    kode_tracking: string;
    status: string;
    media_id: number | null;
    dokumens_id: number | null;
    updated_at: string;
    created_at: string;
    media: Media;
    dokumen: Dokumen;
  };
}

export default function Show() {
  const { layanan } = usePage<PageProps>().props;

  // State Notification Modal
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");

  const showNotification = (message: string, type: "success" | "error") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setIsNotificationModalOpen(true);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(layanan.email_pengirim);
    showNotification("Email berhasil disalin", "success");
  };

  const copyTrackingCode = () => {
    navigator.clipboard.writeText(layanan.kode_tracking);
    showNotification("Kode tracking berhasil disalin", "success");
  };

  const handleKembali = () => {
    router.visit(`/layanan`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Diterima":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Diproses":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Selesai":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Ditolak":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-black-50 text-black-700 border-black-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Diterima":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "Diproses":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "Selesai":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case "Ditolak":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-black-600" />;
    }
  };

  const openFileInNewTab = (fileUrl: string) => {
    window.open(`/storage/${fileUrl}`, "_blank");
  };

  const downloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = `/storage/${fileUrl}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileNameFromPath = (path: string) => {
    return path.split("/").pop() || "file";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`;
    return `${Math.floor(diffDays / 30)} bulan yang lalu`;
  };

  // ======== Tambahan: Modal Konfirmasi Ubah Status ==========
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setIsModalOpen(true);
  };

  const confirmUbahStatus = () => {
    if (!selectedStatus) return;
    setIsModalOpen(false);
    router.put(
      `/layanan/${layanan.id}`,
      { status: selectedStatus },
      {
        onSuccess: () => showNotification(`Status berhasil diubah menjadi ${selectedStatus}`, "success" ),
        onError: () => showNotification("Gagal mengubah status", "error"),
      }
    );
  };

  const cancelUbahStatus = () => {
    setIsModalOpen(false);
    setSelectedStatus(null);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Detail Laporan - ${layanan.judul}`} />

      <div className="min-h-screen bg-gradient-to-br from-white-50 to-black-50/30 py-6 px-4 sm:px-6 lg:px-8">


        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                    Detail Laporan
                  </h1>
                  <p className="text-white-600 mt-1 flex items-center gap-2 flex-wrap">
                    <span>ID: #{layanan.id}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(layanan.created_at)}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">{getRelativeTime(layanan.created_at)}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                
                <Badge 
                  className={`px-4 py-2 border-2 text-sm font-semibold flex items-center gap-2 ${getStatusColor(layanan.status)}`}
                >
                  {getStatusIcon(layanan.status)}
                  {layanan.status}
                </Badge>
              </div>
            </div>

            {/* Progress Bar Indicator */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700">Status Progress</span>
                <span className="text-sm text-slate-500">{layanan.status}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    layanan.status === "Diterima" ? "bg-blue-500 w-1/4" :
                    layanan.status === "Diproses" ? "bg-amber-500 w-2/4" :
                    layanan.status === "Selesai" ? "bg-emerald-500 w-full" :
                    layanan.status === "Ditolak" ? "bg-red-500 w-full" : "bg-slate-500 w-1/4"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Informasi Laporan Card */}
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-lg">Informasi Laporan</span>
                      <p className="text-sm font-normal text-slate-600 mt-1">
                        Detail lengkap mengenai laporan yang diajukan
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Judul Laporan
                    </label>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-lg font-semibold text-slate-800 leading-relaxed">
                        {layanan.judul}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Deskripsi Lengkap
                    </label>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 min-h-[120px]">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {layanan.deskripsi}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Bidang Terkait
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Tag className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span className="font-medium text-blue-800">{layanan.bidang}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Media Files Section */}
              {layanan.media && layanan.media.file?.length > 0 && (
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <CardTitle className="flex items-center gap-3 text-slate-800">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Image className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <span className="text-lg">File Gambar</span>
                        <p className="text-sm font-normal text-slate-600 mt-1">
                          {layanan.media.file.length} gambar terlampir
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {layanan.media.file.map((file, index) => (
                        <div 
                          key={index} 
                          className="group border-2 border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
                        >
                          <div className="aspect-video bg-slate-100 relative overflow-hidden">
                            <img
                              src={`/storage/${file.file}`}
                              alt={`Gambar ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                              onClick={() => openFileInNewTab(file.file)}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                          </div>
                          <div className="p-3 bg-white">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openFileInNewTab(file.file)}
                                className="flex-1 flex items-center justify-center gap-2 border-slate-300 hover:bg-slate-50 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                                Lihat
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadFile(file.file, getFileNameFromPath(file.file))}
                                className="flex-1 flex items-center justify-center gap-2 border-slate-300 hover:bg-slate-50 transition-colors"
                              >
                                <Download className="h-4 w-4" />
                                Unduh
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              

              {/* Document Files Section */}
              {layanan.dokumen && layanan.dokumen.dokumen && (
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <CardTitle className="flex items-center gap-3 text-slate-800">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <File className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <span className="text-lg">File Dokumen</span>
                        <p className="text-sm font-normal text-slate-600 mt-1">
                          Dokumen pendukung terlampir
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="border-2 border-slate-200 rounded-xl p-4 hover:border-red-300 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="p-3 bg-red-100 rounded-lg">
                            <File className="h-6 w-6 text-red-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className="font-semibold text-slate-800 truncate"
                              title={getFileNameFromPath(layanan.dokumen.dokumen)}
                            >
                              {getFileNameFromPath(layanan.dokumen.dokumen)}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">PDF Document</p>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            onClick={() => openFileInNewTab(layanan.dokumen.dokumen)}
                            variant="outline"
                            className="flex items-center gap-2 border-slate-300 hover:bg-slate-50 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            Lihat
                          </Button>
                          <Button
                            onClick={() =>
                              downloadFile(
                                layanan.dokumen.dokumen,
                                getFileNameFromPath(layanan.dokumen.dokumen)
                              )
                            }
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            Unduh
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                  </CardContent>
                </Card>
              )}
            </div>
            
            

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Pengirim Information */}
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-lg">Informasi Pengirim</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Nama Pengirim</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <User className="h-5 w-5 text-slate-500 flex-shrink-0" />
                      <span className="font-medium text-slate-800 break-words">{layanan.nama_pengirim}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Email</label>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 group hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Mail className="h-5 w-5 text-slate-500 flex-shrink-0" />
                        <span className="truncate text-slate-700" title={layanan.email_pengirim}>
                          {layanan.email_pengirim}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyEmail}
                        className="h-8 w-8 p-0 flex-shrink-0 ml-2 opacity-70 hover:opacity-100 hover:bg-white transition-all"
                        title="Salin email"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking & Status */}
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Hash className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="text-lg">Tracking & Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Kode Tracking</label>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 group hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Hash className="h-5 w-5 text-slate-500 flex-shrink-0" />
                        <code
                          className="font-mono font-bold text-slate-800 truncate min-w-0"
                          title={layanan.kode_tracking}
                        >
                          {layanan.kode_tracking}
                        </code>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyTrackingCode}
                        className="h-8 w-8 p-0 flex-shrink-0 ml-2 opacity-70 hover:opacity-100 hover:bg-white transition-all"
                        title="Salin kode tracking"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Ubah Status</label>
                    <Select onValueChange={handleStatusChange} defaultValue={layanan.status}>
                      <SelectTrigger className="w-full border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="Diterima"
                          disabled={["Diproses", "Selesai", "Ditolak"].includes(layanan.status)}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          Diterima
                        </SelectItem>

                        <SelectItem
                          value="Diproses"
                          disabled={["Selesai", "Ditolak"].includes(layanan.status)}
                          className="flex items-center gap-2"
                        >
                          <Clock className="h-4 w-4 text-amber-600" />
                          Diproses
                        </SelectItem>

                        <SelectItem
                          value="Selesai"
                          disabled={layanan.status === "Ditolak"}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          Selesai
                        </SelectItem>

                        <SelectItem
                          value="Ditolak"
                          disabled={["Selesai", "Ditolak"].includes(layanan.status)}
                          className="flex items-center gap-2"
                        >
                          <XCircle className="h-4 w-4 text-red-600" />
                          Ditolak
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500 mt-2">
                      Pilih status baru untuk memperbarui progres laporan
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-slate-600" />
                    </div>
                    <span className="text-lg">Timeline</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <span className="block text-sm font-semibold text-blue-800">Dibuat</span>
                          <span className="block text-sm text-blue-600">{formatDate(layanan.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-full">
                          <Calendar className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <span className="block text-sm font-semibold text-emerald-800">Diupdate</span>
                          <span className="block text-sm text-emerald-600">{formatDate(layanan.updated_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Modal Konfirmasi */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md border-slate-200 shadow-xl">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <DialogTitle className="text-slate-800">Konfirmasi Ubah Status</DialogTitle>
              </div>
              <DialogDescription className="text-slate-600 text-base leading-relaxed">
                Anda akan mengubah status dari{" "}
                <span className="font-semibold text-slate-800">{layanan.status}</span> menjadi{" "}
                <span className="font-semibold text-slate-800">{selectedStatus}</span>.
                <br />
                <span className="text-red-500 font-medium mt-2 block">
                  Tindakan ini tidak dapat dibatalkan.
                </span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={cancelUbahStatus}
                className="border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                Batal
              </Button>
              <Button
                onClick={confirmUbahStatus}
                className="bg-amber-600 hover:bg-amber-700 text-white transition-colors"
              >
                Ya, Ubah Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Notification Modal */}
        <Dialog open={isNotificationModalOpen} onOpenChange={setIsNotificationModalOpen}>
          <DialogContent className="sm:max-w-md border-slate-200 shadow-xl">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-full ${
                  notificationType === "success" ? "bg-emerald-100" : "bg-red-100"
                }`}>
                  {notificationType === "success" ? (
                    <CheckCircle className={`h-6 w-6 ${
                      notificationType === "success" ? "text-emerald-600" : "text-red-600"
                    }`} />
                  ) : (
                    <XCircle className={`h-6 w-6 ${
                      notificationType === "success" ? "text-emerald-600" : "text-red-600"
                    }`} />
                  )}
                </div>
                <DialogTitle className="text-slate-800">
                  {notificationType === "success" ? "Berhasil" : "Gagal"}
                </DialogTitle>
              </div>
              <DialogDescription className={`text-base leading-relaxed ${
                notificationType === "success" ? "text-emerald-700" : "text-red-700"
              }`}>
                {notificationMessage}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end mt-6">
              <Button
                onClick={() => setIsNotificationModalOpen(false)}
                className={`${
                  notificationType === "success"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                } text-white transition-colors`}
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}