# Dashboard Dinas Pendidikan dan Kebudayaan Provinsi Sultra

## Deskripsi Proyek

Dashboard ini adalah sistem manajemen data pegawai untuk Dinas Pendidikan dan Kebudayaan Provinsi Sulawesi Tenggara (Sultra). Sistem ini dirancang untuk mengelola data pegawai, berkas administrasi, dan informasi kepegawaian secara terintegrasi.

## Teknologi yang Digunakan

### Backend
- **Laravel 12** - Framework PHP modern untuk pengembangan aplikasi web
- **PHP 8.2+** - Bahasa pemrograman utama
- **Laravel Sanctum** - Sistem autentikasi API berbasis token
- **MySQL** - Database utama untuk penyimpanan data
- **Composer** - Dependency management untuk PHP

### Frontend
- **React 19** - Library JavaScript untuk UI modern
- **TypeScript** - Superset JavaScript dengan type safety
- **Inertia.js** - Framework untuk SPA dengan backend Laravel
- **Tailwind CSS 4** - Framework CSS utility-first
- **Vite** - Build tool modern dan cepat
- **Radix UI** - Komponen UI primitif yang dapat diakses
- **Lucide React** - Icon library modern

### Development Tools
- **ESLint** - Linting untuk JavaScript/TypeScript
- **Prettier** - Code formatter
- **Laravel Pail** - Command line interface
- **PHPUnit** - Testing framework untuk PHP
- **Composer Scripts** - Otomasi development workflow

## Fitur Utama

### 1. Manajemen Pegawai
- Registrasi dan login pegawai
- Manajemen data pribadi pegawai
- Sistem autentikasi berbasis token

### 2. Upload Berkas Administrasi
- Upload berkas SK CPNS, SK PNS, SK Gaji Berkala
- Upload SK Pangkat Terakhir, SK Jabatan
- Validasi file dan manajemen storage

### 3. Dashboard Admin
- Monitoring data pegawai
- Manajemen status berkas
- Laporan dan statistik

### 4. API RESTful
- Endpoint untuk CRUD operations
- Autentikasi dan autorisasi
- Response format JSON standar

## Arsitektur Sistem

### Backend Architecture
- **MVC Pattern** - Model-View-Controller untuk struktur kode
- **Repository Pattern** - Abstraksi data layer
- **Service Layer** - Business logic separation
- **Middleware** - Request filtering dan authentication
- **Eloquent ORM** - Database abstraction

### Frontend Architecture
- **Component-based** - Reusable UI components
- **Hooks Pattern** - State management dengan React hooks
- **TypeScript** - Type safety dan better DX
- **Responsive Design** - Mobile-first approach

## Keamanan

- **Laravel Sanctum** untuk API authentication
- **CSRF Protection** pada form requests
- **Input Validation** pada semua endpoints
- **Role-based Access Control** (RBAC)
- **File Upload Security** dengan validasi tipe dan ukuran
- **SQL Injection Prevention** melalui Eloquent ORM

## Instalasi dan Setup

### Persyaratan Sistem
- PHP 8.2 atau lebih tinggi
- Composer
- Node.js 18+ dan npm
- MySQL 8.0+
- Git

### Langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd dashboard-dinas-pendidikan-dan-kebudayaan-provinsi-sultra
   ```

2. **Install PHP Dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js Dependencies**
   ```bash
   npm install
   ```

4. **Environment Setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database Setup**
   ```bash
   # Konfigurasi database di .env file
   # Jalankan migration
   php artisan migrate
   php artisan db:seed
   ```

6. **Build Assets**
   ```bash
   npm run build
   ```

7. **Jalankan Aplikasi**
   ```bash
   # Development mode dengan hot reload
   composer run dev

   # Atau jalankan secara terpisah
   php artisan serve
   npm run dev
   ```

## Penjelasan Controller API

### 1. AdminApiController
Controller ini menangani autentikasi admin dalam sistem.

**Fungsi yang tersedia:**
- **index**: Menampilkan daftar semua admin
- **login**: Otentikasi admin dan menghasilkan token Sanctum untuk akses API

**Fitur keamanan:**
- Password di-hash menggunakan bcrypt
- Token personal access menggunakan Laravel Sanctum
- Role-based authentication (hanya user dengan role 'admin')

### 2. BidangApiController
Controller ini menangani autentikasi bidang dalam sistem.

**Fungsi yang tersedia:**
- **index**: Menampilkan daftar semua bidang
- **login**: Otentikasi bidang dan menghasilkan token Sanctum untuk akses API

**Fitur keamanan:**
- Password di-hash menggunakan bcrypt
- Token personal access menggunakan Laravel Sanctum
- Role-based authentication (hanya user dengan role 'bidang')

### 3. PegawaiApiController
Controller ini menangani autentikasi pegawai (karyawan) dalam sistem.

**Fungsi yang tersedia:**
- **index**: Menampilkan daftar semua pegawai
- **register**: Mendaftarkan pegawai baru dengan validasi email unik dan password confirmation
- **login**: Otentikasi pegawai dan menghasilkan token Sanctum untuk akses API
- **logout**: Logout pegawai dan menghapus token

**Fitur keamanan:**
- Password di-hash menggunakan bcrypt
- Token personal access menggunakan Laravel Sanctum
- Validasi input yang ketat

### 4. DataDiriApiController
Controller ini mengelola data pribadi pegawai dengan kontrol akses ketat.

**Fungsi yang tersedia:**
- **index**: Menampilkan semua data diri milik pegawai yang sedang login
- **store**: Membuat data diri baru (hanya sekali per pegawai)
- **show**: Menampilkan detail data diri berdasarkan ID
- **update**: Mengupdate data diri (hanya data milik sendiri)
- **destroy**: Menghapus data diri (hanya data milik sendiri)

**Fitur keamanan & bisnis:**
- **Autentikasi wajib**: Semua endpoint memerlukan Bearer token
- **One-time upload**: Setiap pegawai hanya bisa upload data diri sekali
- **User isolation**: Pegawai hanya bisa akses data dirinya sendiri
- **Automatic pegawais_id**: ID pegawai diambil dari token autentikasi

### 5. BerkasApiController
Controller ini menangani upload dan manajemen berkas/dokumen pegawai.

**Fungsi yang tersedia:**
- **index**: Menampilkan berkas (pegawai lihat berkasnya sendiri, admin lihat semua)
- **store**: Upload berkas baru dengan multiple file
- **update**: Update berkas (pegawai update berkasnya, admin bisa ubah status)
- **destroy**: Hapus berkas dengan file cleanup

**Fitur file management:**
- **Multi-file upload**: 6 jenis berkas (SK CPNS, SK PNS, dll)
- **File validation**: Hanya PDF, DOC, DOCX max 5MB
- **Storage management**: File disimpan di storage/app/public/berkas
- **Auto cleanup**: File lama dihapus saat update/delete

**Role-based access:**
- **Pegawai**: CRUD berkas milik sendiri
- **Admin**: Lihat semua berkas, update status, hapus berkas

### 6. DashboardApiController
Controller ini menangani data dashboard untuk tampilan publik.

**Fungsi yang tersedia:**
- **index**: Menampilkan logo dan hero images untuk dashboard

**Fitur:**
- Mengambil data media dengan type 'logo' dan 'hero'
- Menyediakan URL lengkap untuk file media

### 7. AgendaApiController
Controller ini mengelola data agenda kegiatan.

**Fungsi yang tersedia:**
- **index**: Menampilkan semua agenda dengan media terkait
- **show**: Menampilkan detail agenda berdasarkan ID

### 8. BeritaApiController
Controller ini mengelola data berita.

**Fungsi yang tersedia:**
- **index**: Menampilkan semua berita dengan media terkait
- **show**: Menampilkan detail berita berdasarkan ID

### 9. InovasiApiController
Controller ini mengelola data inovasi.

**Fungsi yang tersedia:**
- **index**: Menampilkan semua inovasi dengan media terkait
- **show**: Menampilkan detail inovasi berdasarkan ID

### 10. PengumumanApiController
Controller ini mengelola data pengumuman.

**Fungsi yang tersedia:**
- **index**: Menampilkan semua pengumuman dengan media terkait

### 11. ProdukHukumApiController
Controller ini mengelola data produk hukum.

**Fungsi yang tersedia:**
- **index**: Menampilkan semua produk hukum dengan dokumen terkait

### 12. LaporanApiController
Controller ini mengelola data laporan kegiatan.

**Fungsi yang tersedia:**
- **index**: Menampilkan semua laporan dengan dokumen terkait

### 13. LayananApiController
Controller ini menangani pengajuan layanan/laporan dari masyarakat.

**Fungsi yang tersedia:**
- **store**: Membuat pengajuan layanan baru dengan upload file
- **status**: Mengecek status layanan berdasarkan kode tracking

**Fitur:**
- Auto-generate kode tracking unik
- Upload multiple file (foto/video dan dokumen)
- Email notification otomatis
- Mapping bidang ke singkatan untuk kode tracking

### 14. AllGaleriApiController
Controller ini menggabungkan semua data galeri (berita, inovasi, agenda, pengumuman).

**Fungsi yang tersedia:**
- **index**: Menampilkan semua data galeri terintegrasi

## API Testing Guide

### Prerequisites
- Laravel application running on `http://localhost:8000` or your configured URL
- Database migrated and seeded
- Postman or curl for testing

### 1. Pegawai Register API

**Endpoint:** `POST /api/register`

**Description:** Register a new pegawai (employee)

**Request Body:**
```json
{
    "nama": "Baba",
    "email": "baba@gmail.com",
    "password": "12345678",
    "password_confirmation": "12345678",
    "nip": 198912312022021008,
    "nomor": 62812345638,
    "jenis_kelamin": "laki-laki",
    "agama": "islam",
    "alamat": "kendari",
    "tanggal_lahir": "2005-01-01",
    "tempat_lahir": "Makassar"
}
```

**Curl Example:**
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "nip": "123456789012345678",
    "nomor": "08123456789",
    "agama": "islam",
    "jenis_kelamin": "laki-laki",
    "alamat": "Jl. Sudirman No. 1",
    "tempat_lahir": "Makassar",
    "tanggal_lahir": "1990-01-01",
    "notifikasis_id": 1
  }'
```

**Expected Response (Status Code: 200):**
```json
{
    "status": "success",
    "message": "Registrasi pegawai berhasil!",
    "data": {
        "nama": "John Doe",
        "email": "john.doe@example.com",
        "nip": "123456789012345678",
        "nomor": "08123456789",
        "agama": "islam",
        "jenis_kelamin": "laki-laki",
        "alamat": "Jl. Sudirman No. 1",
        "tempat_lahir": "Makassar",
        "tanggal_lahir": "1990-01-01",
        "updated_at": "2025-01-01T00:00:00.000000Z",
        "created_at": "2025-01-01T00:00:00.000000Z",
        "id": 1
    },
    "token": "1|abc123..."
}
```

### 2. Pegawai Login API

**Endpoint:** `POST /api/login`

**Description:** Login pegawai and get authentication token

**Request Body:**
```json
{
    "email": "john.doe@example.com",
    "password": "password123"
}
```

**Curl Example:**
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
    "message": "Login berhasil",
    "pegawai": {
        "id": 1,
        "nama": "John Doe",
        "email": "john.doe@example.com",
        "notifikasis_id": 1,
        "created_at": "2025-01-01T00:00:00.000000Z",
        "updated_at": "2025-01-01T00:00:00.000000Z"
    },
    "token": "1|def456..."
}
```

### 6. Admin APIs

#### 6.1 Get All Admins

**Endpoint:** `GET /api/admin`

**Curl Example:**
```bash
curl -X GET http://localhost:8000/api/admin
```

#### 6.2 Admin Login

**Endpoint:** `POST /api/admin/login`

**Request Body:**
```json
{
    "email": "admin@example.com",
    "password": "password123"
}
```

**Curl Example:**
```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
    "message": "Login berhasil",
    "admin": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "admin"
    },
    "token": "1|abc123..."
}
```

### 7. Bidang APIs

#### 7.1 Get All Bidang

**Endpoint:** `GET /api/bidang`

**Curl Example:**
```bash
curl -X GET http://localhost:8000/api/bidang
```

#### 7.2 Bidang Login

**Endpoint:** `POST /api/bidang/login`

**Request Body:**
```json
{
    "email": "bidang@example.com",
    "password": "password123"
}
```

**Curl Example:**
```bash
curl -X POST http://localhost:8000/api/bidang/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bidang@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
    "message": "Login berhasil",
    "bidang": {
        "id": 1,
        "name": "Bidang User",
        "email": "bidang@example.com",
        "role": "bidang"
    },
    "token": "1|def456..."
}
```

### 8. Dashboard APIs

#### 8.1 Get Dashboard Data

**Endpoint:** `GET /api/dashboard`

**Curl Example:**
```bash
curl -X GET http://localhost:8000/api/dashboard
```

**Expected Response:**
```json
{
    "logo": {
        "id": 1,
        "file": "media/logo.png",
        "type": "logo",
        "url": "http://localhost:8000/storage/media/logo.png"
    },
    "heroes": [
        {
            "id": 2,
            "file": "media/hero1.jpg",
            "type": "hero",
            "url": "http://localhost:8000/storage/media/hero1.jpg"
        }
    ]
}
```

### 9. Agenda APIs

#### 9.1 Get All Agenda

**Endpoint:** `GET /api/agenda`

**Curl Example:**
```bash
curl -X GET http://localhost:8000/api/agenda
```

#### 9.2 Get Agenda by ID

**Endpoint:** `GET /api/agenda/{id}`

**Curl Example:**
```bash
curl -X GET http://localhost:8000/api/agenda/1
```

### 10. Berita APIs

#### 10.1 Get All Berita

**Endpoint:** `GET /api/berita`

**Curl Example:**
```bash
curl -X GET http://localhost:8000/api/berita
```

#### 10.2 Get Berita by ID

**Endpoint:** `GET /api/berita/{id}`

**Curl Example:**
```bash
curl -X GET http://localhost:8000/api/berita/1
```

### 11. Inovasi APIs

#### 11.1 Get All Inovasi

**Endpoint:** `GET /api/inovasi`

**Curl Example:**
```bash
curl -X GET http://localhost:8000/api/inovasi
```

#### 11.2 Get Inovasi by ID

**Endpoint:** `GET /api/inovasi/{id}`

**Curl Example:**
```bash
curl -X GET http://localhost:8000/api/inovasi/1
```

### 12. Pengumuman APIs

#### 12.1 Get All Pengumuman

**Endpoint:** `GET /api/pengumuman`

**Curl Example:**
```bash
curl -X GET http://localhost:8000/api/pengumuman
```

### 13. Produk Hukum APIs

#### 13.1 Get All Produk Hukum

**Endpoint:** `GET /api/produk-hukum`

**Curl Example:**
```bash
curl -X GET http://localhost:8000/api/produk-hukum
```

### 14. Laporan APIs

#### 14.1 Get All Laporan

**Endpoint:** `GET /api/laporan`

**Curl Example:**
```bash
curl -X GET http://localhost:8000/api/laporan
```

### 15. Layanan APIs

#### 15.1 Submit Layanan

**Endpoint:** `POST /api/layanan`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `judul`: String (required)
- `deskripsi`: String (required)
- `bidang`: String (required) - bidang_sma, bidang_smk, bidang_pklk, bidang_gtk, bidang_perencanaan, bidang_kebudayaan
- `nama_pengirim`: String (required)
- `email_pengirim`: Email (required)
- `files.*`: File images/videos (optional, max 50KB each)
- `dokumen`: File PDF (optional, max 30MB)

**Curl Example:**
```bash
curl -X POST http://localhost:8000/api/layanan \
  -F "judul=Pengaduan Fasilitas" \
  -F "deskripsi=Deskripsi pengaduan..." \
  -F "bidang=bidang_sma" \
  -F "nama_pengirim=John Doe" \
  -F "email_pengirim=john@example.com" \
  -F "files[]=@photo1.jpg" \
  -F "dokumen=@document.pdf"
```

**Expected Response:**
```json
{
    "message": "Laporan berhasil dikirim",
    "kode_tracking": "SMA20250115ABC123",
    "data": {
        "judul": "Pengaduan Fasilitas",
        "deskripsi": "Deskripsi pengaduan...",
        "bidang": "bidang_sma",
        "nama_pengirim": "John Doe",
        "email_pengirim": "john@example.com",
        "kode_tracking": "SMA20250115ABC123",
        "status": "Diterima"
    }
}
```

#### 15.2 Check Layanan Status

**Endpoint:** `GET /api/layanan/status/{kode_tracking}`

**Curl Example:**
```bash
curl -X GET http://localhost:8000/api/layanan/status/SMA20250115ABC123
```

**Expected Response:**
```json
{
    "kode_tracking": "SMA20250115ABC123",
    "status": "Diterima",
    "judul": "Pengaduan Fasilitas",
    "bidang": "bidang_sma",
    "tanggal": "15-01-2025 10:30"
}
```

### 16. Galeri APIs

#### 16.1 Get All Galeri

**Endpoint:** `GET /api/galeri`

**Curl Example:**
```bash
curl -X GET http://localhost:8000/api/galeri
```

**Expected Response:**
```json
{
    "berita": [...],
    "inovasi": [...],
    "agenda": [...],
    "pengumuman": [...]
}
```

### 17. Berkas APIs

**Note:** Berkas endpoints menggunakan role-based access control. Pegawai dapat mengelola berkasnya sendiri, admin dapat melihat semua berkas.

**Authentication:**
- **Pegawai**: Gunakan Bearer token dari login pegawai
- **Admin**: Gunakan Bearer token dari login admin

#### 17.1 Get Berkas

**Endpoint:** `GET /api/berkas`

**Expected Response (Pegawai):**
```json
{
    "status": "success",
    "message": "Data berkas pegawai yang sedang login",
    "data": [
        {
            "id": 1,
            "sk_cpns": "berkas/sk_cpns_123.pdf",
            "sk_pns": "berkas/sk_pns_123.pdf",
            "sk_gaji_berkala": "berkas/sk_gaji_berkala_123.pdf",
            "sk_pangkat_terakhir": "berkas/sk_pangkat_terakhir_123.pdf",
            "sk_jabatan": "berkas/sk_jabatan_123.pdf",
            "file_sk": "berkas/file_sk_123.pdf",
            "status": "Telah dikirim ke BKD",
            "users_id": 1,
            "pegawais_id": 1,
            "created_at": "2025-01-01T00:00:00.000000Z",
            "updated_at": "2025-01-01T00:00:00.000000Z",
            "pegawai": {
                "id": 1,
                "nama": "John Doe",
                "email": "john.doe@example.com"
            }
        }
    ]
}
```

#### 17.2 Upload Berkas Baru

**Endpoint:** `POST /api/berkas`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `sk_cpns`: File PDF/DOC/DOCX (required)
- `sk_pns`: File PDF/DOC/DOCX (required)
- `sk_gaji_berkala`: File PDF/DOC/DOCX (required)
- `sk_pangkat_terakhir`: File PDF/DOC/DOCX (required)
- `sk_jabatan`: File PDF/DOC/DOCX (required)
- `file_sk`: File PDF/DOC/DOCX (required)

**Curl Example:**
```bash
curl -X POST http://localhost:8000/api/berkas \
  -H "Authorization: Bearer PEGAWAI_TOKEN" \
  -F "sk_cpns=@sk_cpns.pdf" \
  -F "sk_pns=@sk_pns.pdf" \
  -F "sk_gaji_berkala=@sk_gaji_berkala.pdf" \
  -F "sk_pangkat_terakhir=@sk_pangkat_terakhir.pdf" \
  -F "sk_jabatan=@sk_jabatan.pdf" \
  -F "file_sk=@file_sk.pdf"
```

**Expected Response:**
```json
{
    "status": "success",
    "message": "Berkas berhasil diupload!",
    "data": {
        "id": 1,
        "sk_cpns": "berkas/sk_cpns_abc123.pdf",
        "sk_pns": "berkas/sk_pns_def456.pdf",
        "sk_gaji_berkala": "berkas/sk_gaji_berkala_ghi789.pdf",
        "sk_pangkat_terakhir": "berkas/sk_pangkat_terakhir_jkl012.pdf",
        "sk_jabatan": "berkas/sk_jabatan_mno345.pdf",
        "file_sk": "berkas/file_sk_pqr678.pdf",
        "status": "Telah dikirim ke BKD",
        "users_id": 1,
        "pegawais_id": 1,
        "created_at": "2025-01-01T00:00:00.000000Z",
        "updated_at": "2025-01-01T00:00:00.000000Z"
    }
}
```

#### 17.3 Update Berkas

**Endpoint:** `PUT /api/berkas/{id}`

**Content-Type:** `multipart/form-data`

**Form Data (Pegawai - hanya file):**
- `sk_cpns`: File PDF/DOC/DOCX (optional)
- `sk_pns`: File PDF/DOC/DOCX (optional)
- `sk_gaji_berkala`: File PDF/DOC/DOCX (optional)
- `sk_pangkat_terakhir`: File PDF/DOC/DOCX (optional)
- `sk_jabatan`: File PDF/DOC/DOCX (optional)
- `file_sk`: File PDF/DOC/DOCX (optional)

**Form Data (Admin - file + status):**
- File fields (optional)
- `status`: "Telah dikirim ke BKD" | "Telah dikirim ke BKN" | "SK telah terbit"

**Curl Example (Pegawai):**
```bash
curl -X PUT http://localhost:8000/api/berkas/1 \
  -H "Authorization: Bearer PEGAWAI_TOKEN" \
  -F "sk_cpns=@new_sk_cpns.pdf"
```

**Curl Example (Admin):**
```bash
curl -X PUT http://localhost:8000/api/berkas/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -F "status=Telah dikirim ke BKN"
```

#### 17.4 Delete Berkas

**Endpoint:** `DELETE /api/berkas/{id}`

**Curl Example:**
```bash
curl -X DELETE http://localhost:8000/api/berkas/1 \
  -H "Authorization: Bearer TOKEN_HERE"
```

### 18. Data Diri APIs

**Note:** All Data Diri endpoints require authentication. Include the Bearer token in the Authorization header.

**Authorization Header:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 18.1 Get All Data Diri

**Endpoint:** `GET /api/data-diri`

**Curl Example:**
```bash
curl -X GET http://localhost:8000/api/data-diri \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
    "success": true,
    "message": "Data Diri berhasil diambil",
    "data": [
        {
            "id": 1,
            "pegawais_id": 1,
            "nip": "123456789",
            "tanggal_sk": "2025-01-01",
            "nomor_sk": "SK/001/2025",
            "tempat_lahir": "Makassar",
            "tanggal_lahir": "1990-01-01",
            "tmt_golongan": "2025-01-01T00:00:00.000000Z",
            "agama": "islam",
            "jenis_kelamin": "Laki-laki",
            "alamat": "Jl. Sudirman No. 1",
            "nomor_kepring_bkn": "BKN123456",
            "masa_gk_bulanan": "24",
            "masa_gk_tahunan": "2",
            "golongan_ruang": "III/c",
            "created_at": "2025-01-01T00:00:00.000000Z",
            "updated_at": "2025-01-01T00:00:00.000000Z",
            "pegawai": {
                "id": 1,
                "nama": "John Doe",
                "email": "john.doe@example.com",
                "notifikasis_id": 1,
                "created_at": "2025-01-01T00:00:00.000000Z",
                "updated_at": "2025-01-01T00:00:00.000000Z"
            }
        }
    ]
}
```

#### 18.2 Create Data Diri

**Endpoint:** `POST /api/data-diri`

**Important:** Setiap pegawai hanya bisa upload data diri sekali. Untuk update gunakan PUT method.

**Request Body:**
```json
{
    "tanggal_sk": "2025-01-01",
    "nomor_sk": "SK/001/2025",
    "tmt_golongan": "2025-01-01",
    "nomor_pertek_bkn": "BKN123456",
    "transpot_perbkn_bkn": "Transportasi BKN",
    "masa_gk_bulanan": "24",
    "masa_gk_tahunan": "2",
    "golongan_ruang": "III/c",
    "jenis_kp": "reguler"
}
```

**Curl Example:**
```bash
curl -X POST http://localhost:8000/api/data-diri \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "nip": "123456789",
    "tanggal_sk": "2025-01-01",
    "nomor_sk": "SK/001/2025",
    "tempat_lahir": "Makassar",
    "tanggal_lahir": "1990-01-01",
    "tmt_golongan": "2025-01-01",
    "agama": "islam",
    "jenis_kelamin": "Laki-laki",
    "alamat": "Jl. Sudirman No. 1",
    "nomor_kepring_bkn": "BKN123456",
    "masa_gk_bulanan": "24",
    "masa_gk_tahunan": "2",
    "golongan_ruang": "III/c"
  }'
```

**Expected Response:**
```json
{
    "success": true,
    "message": "Data Diri berhasil ditambahkan",
    "data": {
        "pegawais_id": 1,
        "nip": "123456789",
        "tanggal_sk": "2025-01-01",
        "nomor_sk": "SK/001/2025",
        "tempat_lahir": "Makassar",
        "tanggal_lahir": "1990-01-01",
        "tmt_golongan": "2025-01-01T00:00:00.000000Z",
        "agama": "islam",
        "jenis_kelamin": "Laki-laki",
        "alamat": "Jl. Sudirman No. 1",
        "nomor_kepring_bkn": "BKN123456",
        "masa_gk_bulanan": "24",
        "masa_gk_tahunan": "2",
        "golongan_ruang": "III/c",
        "updated_at": "2025-01-01T00:00:00.000000Z",
        "created_at": "2025-01-01T00:00:00.000000Z",
        "id": 1
    }
}
```

#### 18.3 Get Data Diri by ID

**Endpoint:** `GET /api/data-diri/{id}`

**Curl Example:**
```bash
curl -X GET http://localhost:8000/api/data-diri/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 18.4 Update Data Diri

**Endpoint:** `PUT /api/data-diri/{id}`

**Request Body:** (partial update allowed)
```json
{
    "nomor_pertek_bkn": "BKN789012",
    "golongan_ruang": "III/d",
    "transpot_perbkn_bkn": "Updated Transportasi BKN"
}
```

**Curl Example:**
```bash
curl -X PUT http://localhost:8000/api/data-diri/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "alamat": "Jl. Sudirman No. 2",
    "golongan_ruang": "III/d"
  }'
```

#### 18.5 Delete Data Diri

**Endpoint:** `DELETE /api/data-diri/{id}`

**Curl Example:**
```bash
curl -X DELETE http://localhost:8000/api/data-diri/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Development Workflow

### Available Scripts

**Composer Scripts:**
```bash
composer run dev          # Jalankan server, queue, dan Vite secara bersamaan
composer run dev:ssr      # Jalankan dengan SSR support
composer run test         # Jalankan PHPUnit tests
```

**NPM Scripts:**
```bash
npm run dev              # Development server dengan hot reload
npm run build            # Build untuk production
npm run build:ssr        # Build dengan SSR support
npm run lint             # ESLint checking dan fixing
npm run format           # Prettier code formatting
npm run types            # TypeScript type checking
```

### Code Quality

**PHP:**
- Menggunakan Laravel Pint untuk code formatting
- PHPUnit untuk unit dan feature testing
- PSR-12 coding standards

**JavaScript/TypeScript:**
- ESLint untuk linting
- Prettier untuk code formatting
- TypeScript untuk type safety

### Database Management

**Migration Commands:**
```bash
php artisan migrate           # Jalankan semua migration
php artisan migrate:rollback  # Rollback migration terakhir
php artisan migrate:fresh     # Drop semua tabel dan migrate ulang
php artisan db:seed           # Jalankan database seeders
```

### Testing API with Postman

#### Prerequisites
- Laravel application running on `http://localhost:8000`
- Database migrated and seeded
- Postman for testing

#### Postman Collection Setup

1. **Create New Collection:**
   - Open Postman
   - Click "New" > "Collection"
   - Name it "Dashboard Dinas Pendidikan API"

2. **Set Base URL Variable:**
   - In collection settings, add variable:
     - Variable name: `base_url`
     - Initial value: `http://127.0.0.1:8000`

#### Testing Steps

1. **Start the Laravel server:**
   ```bash
   php artisan serve
   ```

2. **Run migrations:**
   ```bash
   php artisan migrate
   ```

3. **Test Register API:**
   - **Method:** POST
   - **URL:** `{{base_url}}/api/register`
   - **Headers:**
     ```
     Content-Type: application/json
     ```
   - **Body (raw JSON):**
     ```json
     {
       "nama": "John Doe",
       "email": "john.doe@example.com",
       "password": "password123",
       "password_confirmation": "password123",
       "nip": "123456789012345678",
       "nomor": "08123456789",
       "agama": "islam",
       "jenis_kelamin": "laki-laki",
       "alamat": "Jl. Sudirman No. 1",
       "tempat_lahir": "Makassar",
       "tanggal_lahir": "1990-01-01"
     }
     ```
   - **Expected Response:** Status 200 with token

4. **Test Login API:**
   - **Method:** POST
   - **URL:** `{{base_url}}/api/login`
   - **Headers:**
     ```
     Content-Type: application/json
     ```
   - **Body (raw JSON):**
     ```json
     {
       "email": "john.doe@example.com",
       "password": "password123"
     }
     ```
   - **Expected Response:** Status 200 with token
   - **Save Token:** Copy the token from response for next requests

5. **Test Get Pegawai Profile:**
   - **Method:** GET
   - **URL:** `{{base_url}}/api/pegawai`
   - **Headers:**
     ```
     Authorization: Bearer YOUR_TOKEN_HERE
     ```
   - **Expected Response:** Status 200 with authenticated user's data only

6. **Test Data Diri CRUD:**
   - Use the token from login for authorization in all requests
   - Create data diri (POST /api/data-diri)
   - Read all data diri (GET /api/data-diri)
   - Read specific data diri (GET /api/data-diri/{id})
   - Update data diri (PUT /api/data-diri/{id})
   - Delete data diri (DELETE /api/data-diri/{id})

#### Error Responses

**401 Unauthorized:**
```json
{
    "message": "Unauthenticated."
}
```

**404 Not Found:**
```json
{
    "success": false,
    "message": "Data Diri tidak ditemukan"
}
```

**422 Validation Error:**
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["The email has already been taken."]
    }
}
```

## Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Distributed under the MIT License. See `LICENSE` for more information.
