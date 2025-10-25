# TODO: Test API Endpoints for Pegawai Register, Login, Data Diri, and Berkas

## Steps to Complete

- [ ] Start Laravel server with `php artisan serve`.
- [ ] Test pegawai register: POST /api/register with sample data (nama, email, password, nip, nomor, agama, jenis_kelamin, alamat, tanggal_lahir, tempat_lahir).
- [ ] Test pegawai login: POST /api/login with email and password to get token.
- [ ] Test add data diri: POST /api/data-diri with token and sample data (tanggal_sk, nomor_sk, tmt_golongan, nomor_pertek_bkn, tanggal_pertek_bkn, masa_gk_bulanan, masa_gk_tahunan, golongan_ruang, jenis_kp).
- [ ] Test add berkas: POST /api/berkas with token and sample files (sk_cpns, sk_pns, sk_gaji_berkala, sk_pangkat_terakhir, sk_jabatan, file_sk).
- [ ] Test other endpoints: GET /api/data-diri, GET /api/berkas, PUT /api/data-diri/{id}, PUT /api/berkas/{id}, DELETE /api/data-diri/{id}, DELETE /api/berkas/{id} if needed.
- [ ] Report test results and any issues found.
