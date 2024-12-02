import { show, hide, updateTableUI } from './utils.js';
import { getTableColumns, getTableData } from './holy-table.js';
import { showSnackbar } from './snackbar.js';
import { initPreview, previewContainer, previewTableContainer } from './holy-preview.js';

const pageOverlay = document.querySelector('.page-overlay');

export const handleStatistics = () => {
  initPreview();

  const cancelButton = document.querySelector('.btn[data-action="cancel"]');
  const variableButton = document.querySelector('.btn[data-input="variable"]');
  const splitButton = document.querySelector('.btn[data-input="split"]');
  const mainColumnGroup = document.querySelector('.column-group-main');
  const variableColumnGroup = document.querySelector('.column-group-variable');
  const splitColumnGroup = document.querySelector('.column-group-split');
  const statisticsDropdown = document.querySelector('.dropdown-statistics');
  const viewButton = document.querySelector('.btn[data-action="view"]');
  const checkboxContainer = statisticsDropdown.querySelector('.checkbox-container');

  createExploreColumns(getTableColumns(), 'main');

  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('column')) {
      const columns = document.querySelectorAll('.column');
      columns.forEach((col) => col.removeAttribute('selected'));
      event.target.setAttribute('selected', '');

      variableButton.classList.remove('rotate');
      splitButton.classList.remove('rotate');

      if (event.target.parentElement.classList.contains('column-group-variable')) {
        variableButton.classList.add('rotate');
      }

      if (event.target.parentElement.classList.contains('column-group-split')) {
        splitButton.classList.add('rotate');
      }
    }
  });

  variableButton.addEventListener('click', () => {
    const columns = mainColumnGroup.querySelectorAll('.column');
    columns.forEach((col) => {
      if (col.hasAttribute('selected')) {
        mainColumnGroup.removeChild(col);
        variableColumnGroup.appendChild(createColumn(col.textContent));
      }
    });

    const variableColumns = variableColumnGroup.querySelectorAll('.column');
    variableColumns.forEach((c) => {
      if (c.hasAttribute('selected')) {
        variableColumnGroup.removeChild(c);
        mainColumnGroup.appendChild(createColumn(c.textContent));
      }
    });

    if (variableColumnGroup.childElementCount >= 1) {
      statisticsDropdown.classList.add('selected');
    } else {
      statisticsDropdown.classList.remove('selected');
    }
  });

  splitButton.addEventListener('click', () => {
    const columns = mainColumnGroup.querySelectorAll('.column');
    columns.forEach((col) => {
      if (col.hasAttribute('selected')) {
        mainColumnGroup.removeChild(col);
        splitColumnGroup.appendChild(createColumn(col.textContent));
      }
    });

    const splitColumns = splitColumnGroup.querySelectorAll('.column');
    splitColumns.forEach((c) => {
      if (c.hasAttribute('selected')) {
        splitColumnGroup.removeChild(c);
        mainColumnGroup.appendChild(createColumn(c.textContent));
      }
    });

    if (splitColumnGroup.childElementCount >= 1 || variableColumnGroup.childElementCount >= 1) {
      statisticsDropdown.classList.add('selected');
    } else {
      statisticsDropdown.classList.remove('selected');
    }
  });

  cancelButton.addEventListener('click', () => hide(pageOverlay));
  viewButton.addEventListener('click', async () => {
    const tableData = getTableData();
    const options = getExploreOptions(variableColumnGroup, splitColumnGroup, checkboxContainer);

    const data = await fetchAggregatedData(tableData, options);

    if (data.error) {
      showSnackbar('Error', data.error);
      return;
    }

    updateTableUI({ data: data.aggregatedData }, previewTableContainer);
    show(previewContainer);
  });
};

export const fetchAggregatedData = async (tableData, options) => {
  const formData = new FormData();
  formData.append('tableData', JSON.stringify(tableData));
  formData.append('options', JSON.stringify(options));
  try {
    const response = await fetch('http://localhost:5000/explore', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error);
    }

    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const getExploreOptions = (variableColumnGroup, splitColumnGroup, checkboxContainer) => {
  const variableColumns = variableColumnGroup.querySelectorAll('.column');
  const splitColumns = splitColumnGroup.querySelectorAll('.column');
  const variables = Array.from(variableColumns).map((c) => c.textContent);
  const splits = Array.from(splitColumns).map((c) => c.textContent);
  const statistics = Array.from(checkboxContainer.querySelectorAll('input[type="checkbox"]'))
    .filter((c) => c.checked)
    .map((c) => c.dataset.value);

  return { variables, splits, statistics };
};

export const createExploreColumns = (columns, action) => {
  columns.forEach((column) => {
    const columnElement = createColumn(column);
    columnElement.setAttribute('data-action', action);
    document.querySelector(`.column-group-main`).appendChild(columnElement);
  });
};

export const createColumn = (name) => {
  const column = document.createElement('div');
  column.classList.add('column');
  column.textContent = name;
  return column;
};
