# Update LaporanKegiatan to Match Agenda and Pengumuman Functionality

## Backend Changes
- [x] Update LaporanKegiatanController.php:
  - Add 'deleted_files' to update validation
  - Implement media merging logic like AgendaController
  - Add with('medias') to index method

## Frontend Changes
- [x] Update resources/js/pages/laporan-kegiatan/index.tsx:
  - Update layout to grid with cover image
  - Add media files display below description
  - Update filters to include instansi
- [x] Update resources/js/pages/laporan-kegiatan/edit.tsx:
  - Add 'deleted_files' to form data
  - Add useMemo for localMediaIndices
  - Add handleChangePhoto, handleVideoUrlChange, handleVideoUrlRemove
  - Update video URL section to editable inputs
  - Update photo buttons to use handleChangePhoto and add to deleted_files

## Testing
- [x] Test photo change/delete functionality
- [x] Test video URL editing/removal
- [x] Verify cover image updates
- [x] Test instansi filter and display
