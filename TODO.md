# TODO: Perbaiki Edit Berita - Penyelenggara Tidak Tersimpan

## Langkah-langkah Perbaikan

- [x] Edit `resources/js/pages/berita/edit.tsx`:
  - Ubah input `judul` dari `defaultValue` ke `value`
  - Ubah input `penyelenggara` dari `defaultValue` ke `value`
  - Ubah textarea `deskripsi` dari `defaultValue` ke `value`
  - Ubah input `category` dari `defaultValue` ke `value`

- [x] Edit `app/Http/Controllers/BeritaController.php`:
  - Tambah `'penyelenggara' => $request->penyelenggara,` dalam array update berita

- [ ] Test edit berita untuk memastikan perubahan tersimpan
