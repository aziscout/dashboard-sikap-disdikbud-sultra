# TODO: Fix Layout of bidang/user/index.tsx to Match laporan/index.tsx

## Steps to Complete

- [x] Update imports: Add Alert, DropdownMenu components, Input, useForm, useMemo, useState, AlertDialog components, icons (BookOpen -> User, CalendarDays -> Mail, MapPin -> Shield, etc.), Plus, SquarePen, Trash2, ListFilterPlus.
- [x] Update breadcrumbs: Change title to 'User Bidang', href to '/bidang/user'.
- [x] Update interfaces: Rename Laporan to UserBidang, adjust PageProps to use bidang: UserBidang[].
- [x] Add state variables: searchQuery (string), sortOrder ('a-z' | 'z-a'), openDialog (boolean), selectedUser ({id: number, name: string} | null).
- [x] Add filteredBidang useMemo: Filter by searchQuery on name or email, sort by name ascending or descending based on sortOrder, filter role === 'bidang'.
- [x] Update header section: Title "Daftar User Bidang", search input, add button (route 'user.create'), sort dropdown (A-Z, Z-A).
- [x] Add flash message section: Alert with flash.message.
- [x] Add list section: If filteredBidang.length > 0, map to cards displaying name, email, role with icons, actions: edit button (route 'user.edit'), delete button with handleOpenDialog.
- [x] Add AlertDialog: For delete confirmation, with handleConfirmDelete using destroy(route('user.destroy', id)).
- [x] Remove old content: Remove the old div with h1 and add button, replace with new layout.
