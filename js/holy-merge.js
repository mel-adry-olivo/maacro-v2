import { show, hide, updateTableUI, updateTableDataType } from './utils.js';
import { createDropdown } from './dropdown.js';
import { getTableColumns, getTableData } from './holy-table.js';
import { showSnackbar } from './snackbar.js';
import {
  initPreview,
  previewContainer,
  previewTableContainer,
  affectedRows,
  totalRows,
} from './holy-preview.js';

const pageOverlay = document.querySelector('.page-overlay');
const mainTotalRows = document.querySelector('.total-rows');
const mainTable = document.querySelector('.table-main');

export const handleMerge = () => {
  initPreview();

  const previewButton = document.querySelector('.btn[data-action="preview"]');
  const applyButton = document.querySelector('.btn[data-action="apply"]');
  const cancelButton = document.querySelector('.btn[data-action="cancel"]');
  const uploadButton = document.querySelector('.btn[data-action="upload"]');
  const fileInput = document.querySelector('input[type="file"]');
  const uploadContainer = document.querySelector('.dropdown-group.file');
  const dropdownGroup = document.querySelector('.dropdown-group.merge');
  const mergeContainer = document.querySelector('.dropdown-merge');
  const methodContainer = document.querySelector('.dropdown-method');
  const selectContainer = mergeContainer.querySelector('.select-container[data-action="merge"]');
  const fileContainer = document.querySelector('.file.hidden');
  const fileName = document.querySelector('.file-name');
  let selectedFile = null;

  cancelButton.addEventListener('click', () => hide(pageOverlay));
  uploadButton.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async (event) => {
    const tableData = JSON.stringify(getTableData(mainTable));
    selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('tableData', tableData);

    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });

    const { data, filename, matchingColumns } = await response.json();
    updateTableUI({ data: data }, previewTableContainer);
    show(previewContainer);

    selectContainer.appendChild(createDropdown(matchingColumns, 'column'));
    fileName.textContent = filename;
    uploadContainer.remove();
    dropdownGroup.classList.remove('hidden');
    fileContainer.classList.remove('hidden');
  });

  previewButton.addEventListener('click', async () => {
    const selectedOption = mergeContainer.querySelector('select[data-action="column"]').value;
    const mergeMethod = methodContainer.querySelector('select[data-action="merge-method"]').value;

    const tableData = JSON.stringify(getTableData(mainTable));

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('tableData', tableData);
    formData.append('column', selectedOption);
    formData.append('mergeMethod', mergeMethod);

    const data = await fetchMergedData(formData);
    updateTableUI({ data: data }, previewTableContainer);
    show(previewContainer);
  });

  applyButton.addEventListener('click', async () => {
    const selectedOption = mergeContainer.querySelector('select[data-action="column"]').value;
    const mergeMethod = methodContainer.querySelector('select[data-action="merge-method"]').value;

    const tableData = JSON.stringify(getTableData(mainTable));

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('tableData', tableData);
    formData.append('column', selectedOption);
    formData.append('mergeMethod', mergeMethod);

    const data = await fetchMergedData(formData);
    updateTableUI({ data: data }, mainTable, mainTotalRows);
    show(pageOverlay);
    showSnackbar('Join', 'Data merged successfully.', 3000);
  });
};

export const fetchMergedData = async (formData) => {
  const response = await fetch('http://localhost:5000/merge', {
    method: 'POST',
    body: formData,
  });

  const { mergedData } = await response.json();
  return JSON.parse(mergedData);
};
