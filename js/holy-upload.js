import { show, hide, updateTableUI } from './utils.js';
import { getTableData } from './holy-table.js';
import { showSnackbar } from './snackbar.js';
import { initPreview, previewContainer, previewTableContainer } from './holy-preview.js';
import { initHeaders } from './holy-revise.js';

const pageOverlay = document.querySelector('.page-overlay');
const mainTotalRows = document.querySelector('.total-rows');
const mainTable = document.querySelector('.table-main');

export const handleUpload = () => {
  initPreview();
  const confirmButton = document.querySelector('.btn[data-action="confirm"]');
  const cancelButton = document.querySelector('.btn[data-action="cancel"]');
  const uploadContainer = document.querySelector('.dropdown-group.upload');
  const uploadButton = uploadContainer.querySelector('.btn[data-action="upload"]');
  const fileInput = uploadContainer.querySelector('input[type="file"]');
  const dropdownGroup = document.querySelector('.dropdown-group.uploaded');
  const fileContainer = dropdownGroup.querySelector('.file.hidden');
  const fileName = dropdownGroup.querySelector('.file-name');
  let selectedFile = null;

  cancelButton.addEventListener('click', () => hide(pageOverlay));
  uploadButton.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async (event) => {
    const tableData = JSON.stringify(getTableData());
    selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('tableData', tableData);

    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });

    const { data, filename } = await response.json();
    updateTableUI({ data: data }, previewTableContainer);
    show(previewContainer);

    fileName.textContent = filename;
    uploadContainer.remove();
    dropdownGroup.classList.remove('hidden');
    fileContainer.classList.remove('hidden');
  });

  confirmButton.addEventListener('click', async () => {
    if (!selectedFile) {
      showSnackbar('Upload', 'Please upload a file first.', 3000);
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });

    const { data, filename } = await response.json();
    updateTableUI({ data: data }, mainTable, mainTotalRows);
    hide(pageOverlay);

    fileName.textContent = filename;
    uploadContainer.remove();
    dropdownGroup.classList.remove('hidden');
    fileContainer.classList.remove('hidden');
    initHeaders();
  });
};
