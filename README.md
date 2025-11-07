## Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## Aktivasi Menu Sidebar PPID

Menu PPID di sidebar akan muncul secara otomatis jika user memiliki permission 'PPID'. 

### Cara Mengaktifkan Sidebar PPID:

1. **Pastikan User Memiliki Permission 'PPID'**:
   - Menu PPID hanya ditampilkan untuk user yang memiliki permission 'PPID' dalam sistem
   - Permission ini dapat dikelola melalui sistem manajemen user/permission

2. **Implementasi di Kode**:
   ```typescript
   // Di resources/js/components/app-sidebar.tsx
   if (userPermissions.includes('PPID')) {
       mainNavItems.push({
           title: 'PPID',
           href: '/ppid',
           icon: FileText,
       });
   }
   ```

3. **Verifikasi Permission**:
   - Login sebagai user yang memiliki permission 'PPID'
   - Menu PPID akan muncul di sidebar navigasi utama
   - Jika tidak muncul, periksa kembali permission user di database atau sistem manajemen permission

### Permission yang Diperlukan:
- Permission name: `'PPID'`
- Type: String dalam array permissions user
- Lokasi pengecekan: `auth.permissions` dari Inertia.js page props

Menu PPID akan otomatis tersembunyi jika user tidak memiliki permission tersebut, memberikan kontrol akses yang ketat sesuai dengan role-based access control (RBAC) sistem.
