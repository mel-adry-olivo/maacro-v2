import { getColumnsState } from './state.js';

export function createTable(tableData) {
  const headers = Object.keys(tableData[0]);
  const headerHtml = headers
    .map((header) => `<th data-action="format-revise" data-type="str">${header}</th>`)
    .join('');
  const rowHtml = tableData
    .map(
      (row) =>
        `<tr>${Object.values(row)
          .map((cell) => `<td>${cell}</td>`)
          .join('')}</tr>`,
    )
    .join('');
  const tableHtml = `
      <table>
          <thead>
              <tr>
                  ${headerHtml}
              </tr>
          </thead>
          <tbody>
              ${rowHtml}
          </tbody>
      </table>`;

  return tableHtml;
}

export function getTableData() {
  const mainTable = document.querySelector('.table-main');
  const rows = mainTable.querySelectorAll('tr');

  if (rows.length === 0) return [];

  const headers = [];
  const data = [];

  const headerCells = rows[0].querySelectorAll('th');
  headerCells.forEach((cell) => {
    headers.push(cell.textContent.trim());
  });

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.querySelectorAll('td');
    const rowData = {};

    cells.forEach((cell, index) => {
      rowData[headers[index]] = cell.textContent.trim();
    });

    data.push(rowData);
  }
  return data;
}

export function getTableLength() {
  const mainTable = document.querySelector('.table-main');
  const rows = mainTable.querySelectorAll('tr');
  return rows.length - 1; // minus the headers
}

export function getTableColumnNames() {
  const mainTable = document.querySelector('.table-main');
  const headers = mainTable.querySelectorAll('th');
  const columns = Array.from(headers).map((header) => header.textContent.trim());
  return columns;
}

export function getTableColumns() {
  const mainTable = document.querySelector('.table-main');
  const headers = mainTable.querySelectorAll('th');
  const cols = {};

  headers.forEach((header) => {
    const columnName = header.textContent.trim();
    const columnType = header.dataset.type;
    cols[columnName] = columnType;
  });

  return cols;
}

export function setTableColumns(cols) {
  const mainTable = document.querySelector('.table-main');
  const headers = mainTable.querySelectorAll('th');

  headers.forEach((header) => {
    const columnName = header.textContent.trim();
    const newType = cols[columnName];
    header.dataset.type = newType;
  });
}
