import { hide } from './utils.js';
import { getTableData } from './holy-table.js';
import { showSnackbar } from './snackbar.js';

const pageOverlay = document.querySelector('.page-overlay');

export const handleDownload = () => {
  const proceed = document.querySelector('.btn[data-action="proceed"]');
  const cancelButton = document.querySelector('.btn[data-action="cancel"]');

  cancelButton.addEventListener('click', () => hide(pageOverlay));
  proceed.addEventListener('click', async () => {
    const tableData = getTableData();

    if (tableData.length === 0) {
      showSnackbar('Error', 'No table data.', 3000);
      return;
    }

    const formData = new FormData();
    const selected = document.querySelector('input[name="download"]:checked').value;

    formData.append('tableData', JSON.stringify(tableData));
    formData.append('filetype', JSON.stringify(selected));

    const response = await fetch(`http://localhost:5000/download`, {
      method: 'POST',
      body: formData,
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data.${selected}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    hide(pageOverlay);
  });
};
