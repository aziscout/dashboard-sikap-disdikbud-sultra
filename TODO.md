# Update Pengumuman to Match Agenda Functionality

## Backend Changes
- [x] Update PengumumanController.php:
  - Add 'category' to store/update validation
  - Add 'deleted_files' to update validation
  - Implement media merging logic like AgendaController

## Frontend Changes
- [x] Update resources/js/pages/pengumuman/index.tsx:
  - Update layout to match Agenda's grid with cover image
  - Add media files display below description
  - Update filters to include category with dokumen option
- [x] Update resources/js/pages/pengumuman/edit.tsx:
  - Add 'deleted_files' to form data
  - Add 'category' to form data
  - Add useMemo for localMediaIndices
  - Add handleChangePhoto, handleVideoUrlChange, handleVideoUrlRemove
  - Update video URL section to editable inputs
  - Update photo buttons to use handleChangePhoto and add to deleted_files

## Testing
- [ ] Test photo change/delete functionality
- [ ] Test video URL editing/removal
- [ ] Verify cover image updates
- [ ] Test category filter and display
