import { hide } from './utils.js';

export const previewContainer = document.querySelector('.preview-container');
export const previewTableContainer = document.querySelector('.preview-container .table-container');
export const previewPlotContainer = document.querySelector('.preview-container .plot-container');
export const previewDoneButton = document.querySelector('.btn[data-action="done"]');
export const totalRows = previewContainer.querySelector('.total-rows');
export const affectedRows = previewContainer.querySelector('.affected-rows');

export function initPreview() {
  previewDoneButton.addEventListener('click', (e) => hide(previewContainer));
  previewTableContainer.innerHTML = '';
  previewPlotContainer.innerHTML = '';
}
