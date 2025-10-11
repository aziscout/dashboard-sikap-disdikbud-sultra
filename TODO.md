# Fix Agenda Edit Photo Upload Functionality

## Backend Changes
- [x] Update AgendaController.php update method:
  - Add 'deleted_files' to validation
  - Fix cover image file access to 'coverImage'
  - Implement media merging logic like BeritaController

## Frontend Changes
- [x] Update resources/js/pages/agenda/edit.tsx:
  - Add 'deleted_files' to form data
  - Modify "Ubah" button to add old file to deleted_files
  - Modify "Hapus" button to add file to deleted_files
  - Add handleVideoUrlChange and handleVideoUrlRemove
  - Render editable inputs for video URLs

## Testing
- [ ] Test photo change/delete functionality
- [ ] Test video URL editing/removal
- [ ] Verify cover image updates
- [ ] Test simultaneous delete and change photos to ensure no increase in count
