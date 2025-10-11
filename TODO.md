# TODO: Fix Inovasi Photo Upload, Delete, and Replace Issue

## Current Issue
- When uploading three photos in inovasi edit, deleting or replacing one doesn't work because the frontend doesn't distinguish between existing and new files, and doesn't send deleted_files to backend.

## Steps to Fix
- [x] Modify resources/js/pages/inovasi/edit.tsx to track existing files separately
- [x] Add deleted_files to form data
- [x] Update handleRemovePhoto to handle existing vs new files
- [x] Update handleReplacePhoto to handle existing vs new files
- [x] Adjust preview to not update until update button is pressed
- [x] Remove alerts/notifications for actions before update
- [x] Update inovasi/index.tsx to match agenda/index.tsx layout
