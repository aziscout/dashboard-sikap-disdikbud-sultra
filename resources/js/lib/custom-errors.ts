/**
 * Fungsi untuk mendapatkan pesan error kustom dalam bahasa Indonesia
 * @param errors - Objek errors dari useForm
 * @returns Objek dengan pesan error kustom
 */
export function getCustomErrors(errors: Record<string, string | undefined>) {
  return {
    judul: errors.judul ? 'Judul wajib diisi.' : null,
    penyelenggara: errors.penyelenggara ? 'Penyelenggara wajib diisi.' : null,
    category: errors.category ? 'Kategori wajib diisi.' : null,
    deskripsi: errors.deskripsi ? 'Deskripsi wajib diisi.' : null,
    instansi: errors.instansi ? 'Instansi wajib diisi.' : null,
    lokasi: errors.lokasi ? 'Lokasi wajib diisi.' : null,
    coverImage: errors.coverImage ? 'Cover Image wajib diisi.' : null,
    video_urls: errors.video_urls ? 'Link Video wajib diisi.' : null,
    files: errors.files ? 'File wajib diisi.' : null,
    format_dokumentasi: errors.format_dokumentasi ? 'Format Dokumentasi wajib dipilih.' : null,
    // Tambahkan field lain jika diperlukan untuk form lain
    nama: errors.nama ? 'Nama wajib diisi.' : null,
    tanggal: errors.tanggal ? 'Tanggal wajib diisi.' : null,
    isi: errors.isi ? 'Isi wajib diisi.' : null,
    tahun: errors.tahun ? 'Tahun wajib diisi.' : null,
    informasi: errors.informasi ? 'Informasi wajib diisi.' : null,
    file: errors.file ? 'File wajib diisi.' : null,
    dokumen: errors.dokumen ? 'Dokumen wajib diisi.' : null,
    peserta: errors.peserta ? 'Peserta wajib diisi.' : null,
    // dll.
  };
}
