import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Eye,
  Mail,
  Calendar
} from "lucide-react";
import { Head } from "@inertiajs/react";

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

interface Document {
  id: number;
  file: string;
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
    document_id: number | null;
    updated_at: string;
    created_at: string;
    media: Media;
    document: Document;
  };
}

export default function Show() {
  const { layanan } = usePage<PageProps>().props;

  const copyEmail = () => {
    navigator.clipboard.writeText(layanan.email_pengirim);
    window.alert("Email berhasil disalin");
  };

  const copyTrackingCode = () => {
    navigator.clipboard.writeText(layanan.kode_tracking);
    window.alert("Kode tracking berhasil disalin");
  };

  const ubahStatus = (status: string) => {
    router.put(
      `/layanan/${layanan.id}`,
      { status },
      {
        onSuccess: () => window.alert(`Status diubah menjadi ${status}`),
      }
    );
  };

  const handleKembali = () => {
    router.visit(`/layanan`);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Diterima":
        return "default";
      case "Diproses":
        return "secondary";
      case "Selesai":
        return "destructive";
      case "Ditolak":
        return "outline";
      default:
        return "outline";
    }
  };

  const openFileInNewTab = (fileUrl: string) => {
    window.open(`/storage/${fileUrl}`, '_blank');
  };

  const downloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = `/storage/${fileUrl}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileNameFromPath = (path: string) => {
    return path.split('/').pop() || 'file';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AppLayout>
      <Head title={`Detail Laporan - ${layanan.judul}`} />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="ghost" 
              onClick={handleKembali}
              className="flex items-center gap-2 mb-4 pl-0"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <h1 className="text-lg font-bold">Detail Laporan</h1>
            <p className="text-gray-600">ID: #{layanan.id} • {formatDate(layanan.created_at)}</p>
          </div>
          <Badge variant={getStatusVariant(layanan.status)} className="text-xs px-4 py-2">
            {layanan.status}
          </Badge>
        </div>

        {/* Informasi Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri - Informasi Laporan */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detail Laporan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informasi Laporan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Laporan</label>
                  <p className="text-xs font-semibold border-b pb-2">{layanan.judul}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded border">
                    {layanan.deskripsi}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bidang</label>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{layanan.bidang}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File Gambar */}
            {layanan.media && layanan.media.file && layanan.media.file.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    File Gambar ({layanan.media.file.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {layanan.media.file.map((file, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <div className="aspect-square bg-gray-100">
                          <img 
                            src={`/storage/${file.file}`} 
                            alt={`Gambar ${index + 1}`}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => openFileInNewTab(file.file)}
                          />
                        </div>
                        <div className="p-3">
                          {/* <p className="text-sm text-gray-600 truncate mb-2">
                            {getFileNameFromPath(file.file)}
                          </p> */}
                          <div className="flex gap-2">

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadFile(file.file, getFileNameFromPath(file.file))}
                              className="flex-1"
                            >
                              <Download className="h-4 w-4 mr-1" />
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

            {/* File Dokumen */}
            {layanan.document && layanan.document.file && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <File className="h-5 w-5" />
                    File Dokumen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <File className="h-8 w-8 text-red-500" />
                        <div>
                          <p className="font-semibold text-xs">{getFileNameFromPath(layanan.document.file)}</p>
                          <p className="text-sm text-gray-500">PDF Document</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => downloadFile(layanan.document.file, getFileNameFromPath(layanan.document.file))}
                          className="flex items-center gap-2"
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

          {/* Kolom Kanan - Informasi Tambahan */}
          <div className="space-y-6">
            {/* Informasi Pengirim */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informasi Pengirim
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pengirim</label>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{layanan.nama_pengirim}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{layanan.email_pengirim}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyEmail}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informasi Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Tracking</label>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <code className="font-mono font-bold">{layanan.kode_tracking}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyTrackingCode}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ubah Status</label>
                  <Select
                    onValueChange={ubahStatus}
                    defaultValue={layanan.status}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Diterima">Diterima</SelectItem>
                      <SelectItem value="Diproses">Diproses</SelectItem>
                      <SelectItem value="Selesai">Selesai</SelectItem>
                      <SelectItem value="Ditolak">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Informasi Waktu */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Dibuat</span>
                  <span className="text-sm font-medium">{formatDate(layanan.created_at)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Diupdate</span>
                  <span className="text-sm font-medium">{formatDate(layanan.updated_at)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}