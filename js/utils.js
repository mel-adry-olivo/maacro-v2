import { handleDeduplicate } from './holy-deduplicate.js';
import { previewContainer } from './holy-preview.js';
import { createTable } from './holy-table.js';

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
}

export function updateTableDataType({ data, columnName, newType }, tableContainer) {
  const table = createTable(data);
  tableContainer.innerHTML = table;

  const tableHeaders = tableContainer.querySelectorAll('th');

  let columnIndex = -1;
  tableHeaders.forEach((th, index) => {
    if (th.textContent === columnName) {
      th.dataset.type = newType;
      columnIndex = index;
    }
  });

  if (newType === 'float') {
    const tableRows = tableContainer.querySelectorAll('tbody tr');

    tableRows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      const cell = cells[columnIndex];
      if (cell) {
        const parsedValue = parseFloat(cell.textContent);
        cell.textContent = parsedValue.toFixed(1);
      }
    });
  }
}
