export function createTable(tableData) {
  const headers = Object.keys(tableData[0]);
  const headerHtml = headers
    .map((header) => `<th data-action="format-revise" data-type="string">${header}</th>`)
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
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    ${headerHtml}
                </tr>
            </thead>
            <tbody>
                ${rowHtml}
            </tbody>
        </table>
    </div>`;
  return tableHtml;
}

export function getTableData() {
  const mainTable = document.querySelector('.table-main');

  if (!mainTable) return [];

  const rows = mainTable.querySelectorAll('tr');
  const headers = [];
  const data = [];

  if (rows.length === 0) return [];

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

export function getTableLength(tableElement) {
  const mainTable = document.querySelector('.table-main');
  const rows = mainTable.querySelectorAll('tr');
  return rows.length - 1; // minus the headers
}

export function getTableColumns(tableElement) {
  const mainTable = document.querySelector('.table-main');
  const headers = mainTable.querySelectorAll('th');
  const columns = Array.from(headers).map((header) => header.textContent.trim());
  return columns;
}
