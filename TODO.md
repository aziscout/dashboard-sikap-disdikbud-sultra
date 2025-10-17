# TODO: Perbaiki Halaman Create dan Edit Agenda - Link Video Tunggal

## Tugas Utama
- Ubah field link video dari multiple (array) menjadi single (string tunggal)
- Hapus tombol tambah di samping field link video
- Pastikan format penyimpanan tetap sama: masuk ke tabel medias sebagai array of objects

## Langkah-langkah
1. **Ubah Frontend (create.tsx)**
   - Ubah `video_urls` dari `[] as string[]` menjadi `string | null`
   - Hapus state `videoUrlInput` dan `handleAddVideoUrl`
   - Ubah input field menjadi single input tanpa tombol tambah
   - Update `handleSubmit` untuk mengirim `video_urls` sebagai string

2. **Ubah Frontend (edit.tsx)**
   - Ubah `video_urls` dari `string[]` menjadi `string | null`
   - Hapus `handleVideoUrlChange` dan `handleVideoUrlRemove`
   - Ubah input field menjadi single input tanpa tombol tambah
   - Update inisialisasi `video_urls` dari medias (ambil yang pertama jika ada)

3. **Ubah Backend (AgendaController.php)**
   - Ubah validasi `video_urls` dari array menjadi `nullable|url`
   - Di `store()`: ubah loop menjadi single entry jika ada video_urls
   - Di `update()`: ubah loop menjadi single entry jika ada video_urls

4. **Test Perubahan**
   - Test create agenda dengan link video
   - Test edit agenda dengan link video
   - Pastikan data tersimpan dengan benar di tabel medias
