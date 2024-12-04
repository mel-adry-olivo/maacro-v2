import { handleDeduplicate } from './holy-deduplicate.js';
import { previewContainer } from './holy-preview.js';
import { initHeaders } from './holy-revise.js';
import { createTable, setTableColumns } from './holy-table.js';
import { getColumnsState } from './state.js';

export const initPageOverlay = (pageOverlay) => {
  pageOverlay.addEventListener('click', (e) => {
    if (e.target === pageOverlay && pageOverlay.classList.contains('show')) {
      hide(pageOverlay);
      hide(previewContainer);
    }
  });
};

export const show = (something) => {
  something.classList.add('show');
};

export const hide = (something) => {
  something.classList.remove('show');
};

export const setTotalRows = (rows) => {
  const totalRows = document.querySelector('.total-rows');
  totalRows.textContent = rows + ' rows';
};

export function updateTableUI(
  { data, rowsAffected },
  tableContainer,
  totalRows = null,
  affectedRows = null,
) {
  const table = createTable(data);
  tableContainer.innerHTML = table;
  if (totalRows) {
    totalRows.textContent = data.length + ' rows';
  }
  if (affectedRows) {
    affectedRows.textContent = rowsAffected + ' rows affected';
  }

  if (tableContainer.classList.contains('table-main')) {
    initHeaders();
    if (JSON.stringify(getColumnsState()) !== '{}') {
      setTableColumns(getColumnsState());
    }
  }
}

export function updateTableDataType({ data, columnName, newType }, tableContainer) {
  const table = createTable(data);
  tableContainer.innerHTML = table;

  const tableHeaders = tableContainer.querySelectorAll('th');

  if (tableContainer.classList.contains('table-main')) {
    initHeaders();
  }
}
