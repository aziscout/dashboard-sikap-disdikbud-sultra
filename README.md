# Dashboard Dinas Pendidikan dan Kebudayaan Provinsi Sultra

## Penjelasan Controller API

### 1. PegawaiApiController
Controller ini menangani autentikasi pegawai (karyawan) dalam sistem.

**Fungsi yang tersedia:**
- **Register**: Mendaftarkan pegawai baru dengan validasi email unik dan password confirmation
- **Login**: Otentikasi pegawai dan menghasilkan token Sanctum untuk akses API

**Fitur keamanan:**
- Password di-hash menggunakan bcrypt
- Token personal access menggunakan Laravel Sanctum
- Validasi input yang ketat

### 2. DataDiriApiController
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

### 3. BerkasApiController
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
    "nip": "123456789",
    "nama": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "agama": "islam",
    "jenis_kelamin": "Laki-laki",
    "nomor": "08123456789",
    "alamat": "Jl. Sudirman No. 1",
    "tempat_lahir": "1990-01-01"
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
    "notifikasis_id": 1
  }'
```

**Expected Response:**
```json
{
    "status": "success",
    "message": "Registrasi pegawai berhasil!",
    "data": {
        "nama": "John Doe",
        "email": "john.doe@example.com",
        "notifikasis_id": 1,
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

### 4. Berkas APIs

**Note:** Berkas endpoints menggunakan role-based access control. Pegawai dapat mengelola berkasnya sendiri, admin dapat melihat semua berkas.

**Authentication:**
- **Pegawai**: Gunakan Bearer token dari login pegawai
- **Admin**: Gunakan Bearer token dari login admin
buatkan ``

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

#### 4.2 Upload Berkas Baru

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

#### 4.3 Update Berkas

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

#### 4.4 Delete Berkas

**Endpoint:** `DELETE /api/berkas/{id}`

**Curl Example:**
```bash
curl -X DELETE http://localhost:8000/api/berkas/1 \
  -H "Authorization: Bearer TOKEN_HERE"
```

### 5. Data Diri APIs

**Note:** All Data Diri endpoints require authentication. Include the Bearer token in the Authorization header.

**Authorization Header:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 5.1 Get All Data Diri

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

#### 5.2 Create Data Diri

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
    "jenis_jk": "Laki-laki"
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

#### 5.3 Get Data Diri by ID

**Endpoint:** `GET /api/data-diri/{id}`

**Curl Example:**
```bash
curl -X GET http://localhost:8000/api/data-diri/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 5.4 Update Data Diri

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

#### 5.5 Delete Data Diri

**Endpoint:** `DELETE /api/data-diri/{id}`

**Curl Example:**
```bash
curl -X DELETE http://localhost:8000/api/data-diri/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Testing Steps

1. **Start the Laravel server:**
   ```bash
   php artisan serve
   ```

2. **Run migrations:**
   ```bash
   php artisan migrate
   ```

3. **Test Register:**
   - Use the register endpoint to create a pegawai account
   - Save the returned token

4. **Test Login:**
   - Use the login endpoint with the registered credentials
   - Verify the token is returned

5. **Test Data Diri CRUD:**
   - Use the token from login/register for authorization
   - Create data diri
   - Read all data diri
   - Read specific data diri by ID
   - Update data diri
   - Delete data diri

### Error Responses

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
