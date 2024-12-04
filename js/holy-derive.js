import { show, hide, updateTableUI } from './utils.js';
import { createDropdown } from './dropdown.js';
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
const mainTable = document.querySelector('.table-main');

export const handleDerive = () => {
  initPreview();

  const applyButton = document.querySelector('.btn[data-action="apply"]');
  const cancelButton = document.querySelector('.btn[data-action="cancel"]');
  const previewButton = document.querySelector('.btn[data-action="preview"]');
  const dropdownGroupDerive = document.querySelector('.dropdown-group.derive');
  const column1SelectContainer = dropdownGroupDerive.querySelector('.select-container.column1');
  const column2SelectContainer = dropdownGroupDerive.querySelector('.select-container.column2');
  const columnNameInput = dropdownGroupDerive.querySelector('input[name="column-name"]');

  cancelButton.addEventListener('click', () => hide(pageOverlay));

  column1SelectContainer.appendChild(createDropdown(getTableColumnNames(), 'column1'));
  column2SelectContainer.appendChild(createDropdown(getTableColumnNames(), 'column2'));

  previewButton.addEventListener('click', async () => {
    const data = await fetchDerivedData();
    if (data.error) {
      showSnackbar('Error', data.error, 3000);
      return;
    }
    updateTableUI({ data: data.derivedData }, previewTableContainer);
    show(previewContainer);
  });

  applyButton.addEventListener('click', async () => {
    const data = await fetchDerivedData();
    if (data.error) {
      showSnackbar('Error', data.error, 3000);
      return;
    }
    updateTableUI({ data: data.derivedData }, mainTable);
    showSnackbar('Derive', 'Data derived successfully.', 3000);
    hide(pageOverlay);
  });

  const fetchDerivedData = async () => {
    const formData = new FormData();
    const tableData = JSON.stringify(getTableData());
    const options = getDeriveOptions();

    formData.append('tableData', tableData);
    formData.append('options', JSON.stringify(options));

    try {
      const response = await fetch('http://localhost:5000/derive', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return { error: error.message };
    }
  };

  const getDeriveOptions = () => {
    const operation = document.querySelector('input[type="radio"][name="operation"]:checked').value;
    const column1 = column1SelectContainer.querySelector('select').value;
    const column2 = column2SelectContainer.querySelector('select').value;
    const columnName = columnNameInput.value.trim();

    return { operation, column1, column2, columnName };
  };
};
