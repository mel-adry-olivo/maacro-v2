export function createTable(data) {
  const headers = Object.keys(data[0]);
  let headerHtml = '';
  headers.forEach((header) => {
    headerHtml += `<th data-action="format-revise" data-type="string">${header}</th>`;
  });

  let rowHtml = '';
  data.forEach((row) => {
    rowHtml += '<tr>';
    Object.values(row).forEach((cell) => {
      rowHtml += `<td>${cell}</td>`;
    });
    rowHtml += '</tr>';
  });

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

export function getTableData(tableElement) {
  const table = tableElement;
  const rows = table.querySelectorAll('tr');
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

export function getTableLength(tableElement) {
  const table = tableElement;
  const rows = table.querySelectorAll('tr');
  return rows.length - 1; // minus the headers
}

export function getTableColumns(tableElement) {
  const table = tableElement;
  const headers = table.querySelectorAll('th');
  const columns = Array.from(headers).map((header) => header.textContent.trim());
  return columns;
}
