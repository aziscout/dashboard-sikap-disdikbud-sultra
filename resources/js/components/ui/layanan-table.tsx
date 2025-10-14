import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, User } from 'lucide-react';
import { useState, useRef, useMemo } from 'react';

interface Layanan {
  id: number;
  judul: string;
  nama_pengirim: string;
  email_pengirim: string;
  kode_tracking: string;
  status: string;
  created_at: string;
  bidang: string;
}

interface Props {
  data: Layanan[];
  onDetail: (id: number) => void;
}

const ITEMS_PER_PAGE = 10;

export default function LayananTable({ data, onDetail }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Diterima':
        return 'bg-blue-100 text-blue-800 border-blue-200 p-2';
      case 'Diproses':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 p-2';
      case 'Selesai':
        return 'bg-green-100 text-green-800 border-green-200 p-2';
      case 'Ditolak':
        return 'bg-red-100 text-red-800 border-red-200 p-2';
      default:
        return 'bg-black-100 text-black-800 border-black-200 p-2';
    }
  };

  // Scroll button
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });

  // Pagination logic
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [data, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p className="font-medium">Tidak ada laporan</p>
          <p className="mt-1 text-sm">Coba ubah filter atau kata kunci pencarian</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative space-y-4">
      {data.length > 10 && (
        <>
          <Button
            onClick={scrollLeft}
            variant="outline"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full px-2"
          >
            ‹
          </Button>
          <Button
            onClick={scrollRight}
            variant="outline"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full px-2"
          >
            ›
          </Button>
        </>
      )}

      <div ref={scrollRef} className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Pengirim</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Waktu/Tanggal</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((l) => (
              <TableRow key={l.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="max-w-[200px] truncate" title={l.judul}>
                    {l.judul}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground capitalize">
                    {l.bidang
                      .split('_')
                      .map((item) => (item.length === 3 ? item.toUpperCase() : item))
                      .join(' ')}
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
                    <span className="max-w-[120px] truncate" title={l.email_pengirim}>
                      {l.email_pengirim}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                    {l.kode_tracking}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusVariant(l.status)} text-xs`}>{l.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-xs text-muted-foreground">
                    {new Date(l.created_at).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    <div>{new Date(l.created_at).toLocaleDateString('id-ID')}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => onDetail(l.id)}
                      className="w-fit p-1.5"
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
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            ‹  Sebelumnya
          </Button>
          <span className="text-sm">
            Halaman {currentPage} dari {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            Selanjutnya ›
          </Button>
        </div>
      )}
    </div>
  );
}
