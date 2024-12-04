import { createDropdown } from './dropdown.js';
import { show, hide, updateTableUI } from './utils.js';
import { getTableColumnNames, getTableData } from './holy-table.js';
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

export const handleDeduplicate = () => {
  initPreview();

  const cancelButton = document.querySelector('.btn[data-action="cancel"]');
  const dropdownGroup = document.querySelector('.dropdown-group.subset');
  const dropdownSubset = dropdownGroup.querySelector('.dropdown-subset');
  const radioGroup = dropdownGroup.querySelector('.radio-group');
  const selectContainer = dropdownGroup.querySelector('.select-container');
  const previewButton = document.querySelector('.btn[data-action="preview"]');

  const applyButton = document.querySelector('.btn[data-action="apply"]');

  radioGroup.addEventListener('change', () => {
    const selectedOption = radioGroup.querySelector('input[type="radio"]:checked');

    if (selectedOption && selectedOption.value == 'column') {
      dropdownSubset.classList.add('selected');
    } else {
      dropdownSubset.classList.remove('selected');
    }
  });

  cancelButton.addEventListener('click', () => hide(pageOverlay));

  selectContainer.appendChild(createDropdown(getTableColumnNames(), 'column'));

  previewButton.addEventListener('click', async () => {
    const { deduplicatedData, rowsRemoved } = await fetchDeduplicatedData();
    updateTableUI(
      { data: deduplicatedData, rowsAffected: rowsRemoved },
      previewTableContainer,
      totalRows,
      affectedRows,
    );
    show(previewContainer);
  });

  applyButton.addEventListener('click', async () => {
    const { deduplicatedData, rowsRemoved } = await fetchDeduplicatedData();
    updateTableUI(
      { data: deduplicatedData, rowsAffected: rowsRemoved },
      mainTable,
      mainTotalRows,
      null,
    );
    hide(pageOverlay);
    showSnackbar('Data deduplicated', `${rowsRemoved} rows removed`, 3000);
  });
};

export async function fetchDeduplicatedData() {
  const options = getDeduplicateOptions();
  const tableData = getTableData();

  const formData = new FormData();
  formData.append('tableData', JSON.stringify(tableData));
  formData.append('options', JSON.stringify(options));

  const response = await fetch('http://localhost:5000/deduplicate', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data;
}

export function getDeduplicateOptions() {
  let subset = document.querySelector('input[name="subset"]:checked').value;
  const keep = document.querySelector('input[name="keep"]:checked').value;

  if (subset === 'column') {
    subset = document.querySelector('select[data-action="column"]').value;
  }

  return [subset, keep];
}
