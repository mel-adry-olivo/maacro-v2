import { show, hide, updateTableUI } from './utils.js';
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

export const handleCleanse = () => {
  initPreview();

  const applyButton = document.querySelector('.btn[data-action="apply"]');
  const cancelButton = document.querySelector('.btn[data-action="cancel"]');
  const previewButton = document.querySelector('.btn[data-action="preview"]');
  const dropdownGroupMissing = document.querySelector('.dropdown-group.missing');
  const dropdownGroupTools = document.querySelector('.dropdown-group.tools');
  const radioGroup = dropdownGroupMissing.querySelector('.radio-group');
  const dropdownImpute = dropdownGroupMissing.querySelector('.dropdown-impute');
  const dropdownDefault = dropdownGroupMissing.querySelector('.dropdown-default');
  const checkboxGroup = dropdownGroupTools.querySelector('.checkbox-group');
  const checkboxes = checkboxGroup.querySelectorAll('input[type="checkbox"]');
  const dateSelectContainer = document.querySelector('.select-container[data-action="date"]');
  const defaultSelectContainer = document.querySelector('.select-container[data-action="default"]');
  const imputeSelectContainer = document.querySelector(
    '.select-container[data-action="impute-column"]',
  );
  const outlierSelectContainer = document.querySelector(
    '.select-container[data-action="outliers"]',
  );
  const dropdownOutlier = document.querySelector('.dropdown-outliers');
  const dropdownDate = document.querySelector('.dropdown-date');

  cancelButton.addEventListener('click', () => hide(pageOverlay));

  imputeSelectContainer.appendChild(createDropdown(getTableColumns(mainTable), 'impute-column'));
  defaultSelectContainer.appendChild(createDropdown(getTableColumns(mainTable), 'default'));
  dateSelectContainer.appendChild(createDropdown(getTableColumns(mainTable), 'date'));
  outlierSelectContainer.appendChild(createDropdown(getTableColumns(mainTable), 'outliers'));

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      if (checkbox.value === 'format-date') {
        dropdownDate.classList.toggle('selected');
        showSnackbar('Format date', 'Make sure to select a date column', 3000);
      } else if (checkbox.value === 'drop-outliers') {
        dropdownOutlier.classList.toggle('selected');
      }
    });
  });

  radioGroup.addEventListener('change', () => {
    const selectedOption = radioGroup.querySelector('input[type="radio"]:checked');
    if (selectedOption) {
      dropdownImpute.classList.toggle('selected', selectedOption.value === 'impute');
      dropdownDefault.classList.toggle('selected', selectedOption.value === 'default-value');
    } else {
      dropdownImpute.classList.remove('selected');
      dropdownDefault.classList.remove('selected');
    }
  });

  previewButton.addEventListener('click', async () => {
    const options = getCleanseOptions();
    const tableData = getTableData(mainTable);
    const { cleanedData, rowsAffected } = await fetchCleanedData(tableData, options);
    updateTableUI(
      { data: cleanedData, rowsAffected },
      previewTableContainer,
      totalRows,
      affectedRows,
    );
    show(previewContainer);
  });

  applyButton.addEventListener('click', async () => {
    const options = getCleanseOptions();
    const tableData = getTableData(mainTable);
    const { cleanedData, rowsAffected } = await fetchCleanedData(tableData, options);
    updateTableUI({ data: cleanedData, rowsAffected }, mainTable, mainTotalRows, affectedRows);
    hide(pageOverlay);
    showSnackbar('Data cleaned', `${rowsAffected} rows affected`, 3000);
  });
};

export const fetchCleanedData = async (tableData, options) => {
  const response = await fetch('http://localhost:5000/cleanse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tableData, options }),
  });

  const data = await response.json();
  return data;
};

export const getCleanseOptions = () => {
  const method = document.querySelector('input[type="radio"][name="missing"]:checked').value;
  const missingOptions = {
    method: method,
  };

  const toolsOptions = {};

  const tools = document.querySelectorAll('input[type="checkbox"][name="tools"]:checked');
  tools.forEach((tool) => {
    const toolValue = tool.value;
    switch (toolValue) {
      case 'format-date':
        toolsOptions.formatDate = {
          column: document.querySelector('select[data-action="date"]').value,
        };
        break;
      case 'standardize-columns':
        toolsOptions.standardizeColumns = true;
        break;
      case 'drop-outliers':
        toolsOptions.dropOutliers = {
          column: document.querySelector('select[data-action="outliers"]').value,
          method: document.querySelector('select[name="outliers-method"]').value,
        };
        break;
      default:
        break;
    }
  });

  if (method === 'default-value') {
    const column = document.querySelector('select[data-action="default"]').value;
    const dataValue = document.querySelector('input[type="text"][name="default"]').value;
    missingOptions.column = column;
    missingOptions.methodValue = dataValue;
  } else if (method === 'impute') {
    const column = document.querySelector('select[data-action="impute-column"]').value;
    const dataValue = document.querySelector('select[name="impute"]').value;
    missingOptions.column = column;
    missingOptions.methodValue = dataValue;
  }

  return { missingOptions, toolsOptions };
};
