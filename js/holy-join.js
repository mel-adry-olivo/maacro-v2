import { show, hide, updateTableUI } from './utils.js';
import { getTableData } from './holy-table.js';
import { showSnackbar } from './snackbar.js';
import { initPreview, previewContainer, previewTableContainer } from './holy-preview.js';

const pageOverlay = document.querySelector('.page-overlay');
const mainTotalRows = document.querySelector('.total-rows');
const mainTable = document.querySelector('.table-main');

export const handleJoin = () => {
  initPreview();

  const previewButton = document.querySelector('.btn[data-action="preview"]');
  const applyButton = document.querySelector('.btn[data-action="apply"]');
  const cancelButton = document.querySelector('.btn[data-action="cancel"]');
  const uploadContainer = document.querySelector('.dropdown-group.file');
  const uploadButton = uploadContainer.querySelector('.btn[data-action="upload"]');
  const fileInput = uploadContainer.querySelector('input[type="file"]');
  const dropdownGroup = document.querySelector('.dropdown-group.join');
  const fileContainer = document.querySelector('.file.hidden');
  const fileName = document.querySelector('.file-name');
  let selectedFile = null;

  cancelButton.addEventListener('click', () => hide(pageOverlay));
  uploadButton.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async (event) => {
    selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

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

  previewButton.addEventListener('click', async () => {
    if (!selectedFile) {
      showSnackbar('Join', 'Please upload a file first.', 3000);
      return;
    }

    const tableData = JSON.stringify(getTableData());
    const selectedAxis = dropdownGroup.querySelector('select[data-action="axis"]').value;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('tableData', tableData);
    formData.append('selectedAxis', selectedAxis);

    const data = await fetchMergedData(formData);
    updateTableUI({ data: data }, previewTableContainer);
    show(previewContainer);
  });

  applyButton.addEventListener('click', async () => {
    if (!selectedFile) {
      showSnackbar('Join', 'Please upload a file first.', 3000);
      return;
    }
    const tableData = JSON.stringify(getTableData());
    const selectedAxis = dropdownGroup.querySelector('select[data-action="axis"]').value;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('tableData', tableData);
    formData.append('selectedAxis', selectedAxis);

    const data = await fetchMergedData(formData);
    updateTableUI({ data: data }, mainTable, mainTotalRows);
    hide(pageOverlay);
    showSnackbar('Join', 'Data joined successfully.', 3000);
  });
};

export const fetchMergedData = async (formData) => {
  const response = await fetch('http://localhost:5000/join', {
    method: 'POST',
    body: formData,
  });

  const { joinedData } = await response.json();
  return JSON.parse(joinedData);
};
