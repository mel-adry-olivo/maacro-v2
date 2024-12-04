import { show, hide, updateTableDataType } from './utils.js';
import { showSnackbar } from './snackbar.js';
import { getTableData } from './holy-table.js';
import { getColumnsState, setColumnsState } from './state.js';

const pageOverlay = document.querySelector('.page-overlay');
const mainTable = document.querySelector('.table-main');

export const handleRevise = () => {
  const applyButton = document.querySelector('.btn[data-action="apply"]');
  const cancelButton = document.querySelector('.btn[data-action="cancel"]');
  const reviseSelectContainer = document.querySelector('.select-container[data-action="revise"]');
  const reviseDropdown = reviseSelectContainer.querySelector('select[name="revise"]');

  reviseDropdown.addEventListener('change', () => {
    const selectedOption = reviseDropdown.options[reviseDropdown.selectedIndex].value;
    if (selectedOption === 'date') {
      showSnackbar('Format Revision', 'Make sure to select a proper date column.', 3000);
    }
  });

  cancelButton.addEventListener('click', () => hide(pageOverlay));
  applyButton.addEventListener('click', async () => {
    const selectElement = reviseSelectContainer.querySelector('select[name="revise"]');
    const type = selectElement.value;
    const columnName = selectElement.dataset.column;
    const tableData = getTableData();
    const { reformattedData, columnAffected, newType } = await fetchRevisedData(
      tableData,
      columnName,
      type,
    );

    updateTableDataType(
      { data: reformattedData, columnName: columnAffected, newType: newType },
      mainTable,
    );

    const currentState = getColumnsState();
    currentState[columnAffected] = newType;
    setColumnsState(currentState);

    hide(pageOverlay);
    showSnackbar('Format Revision', 'Data type updated successfully.', 3000);
  });
};

export const fetchRevisedData = async (tableData, column, type) => {
  const response = await fetch('http://localhost:5000/reformat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tableData, column, type }),
  });

  const data = await response.json();
  return data;
};

export function initHeaders() {
  const tableHeaders = document.querySelectorAll('.table-main thead th');

  tableHeaders.forEach((th, index) => {
    th.addEventListener('click', async () => {
      const columnValues = Array.from(
        document.querySelectorAll(`.table-main tbody tr td:nth-child(${index + 1})`),
      ).map((td) => td.textContent);
      const col = { name: th.textContent, values: columnValues };
      const datatype = th.dataset.type;
      editColumn(th, datatype);
      show(pageOverlay);
    });
  });
}

export async function editColumn(th, dataType) {
  const columnName = th.textContent;
  const response = await fetch(
    './forms/format-revise.php?column=' + columnName + '&default=' + dataType,
  );
  const data = await response.text();
  document.querySelector('.form-container').innerHTML = data;
  handleRevise();
  lucide.createIcons();
}
