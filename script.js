import { initPageOverlay, show, hide, setTotalRows } from './js/utils.js';
import { getTableData, getTableLength } from './js/holy-table.js';
import { handleDeduplicate } from './js/holy-deduplicate.js';
import { handleCleanse } from './js/holy-cleanse.js';
import { handleRevise, initHeaders } from './js/holy-revise.js';

const formButtons = document.querySelectorAll('.btn-form');
const pageOverlay = document.querySelector('.page-overlay');
const mainTotalRows = document.querySelector('.total-rows');
const mainTable = document.querySelector('.table-main');

export async function showForm(btn) {
  const content = btn.dataset.action;
  const response = await fetch('./forms/' + content + '.php');
  const data = await response.text();
  document.querySelector('.form-container').innerHTML = data;
  if (content === 'deduplicate') {
    handleDeduplicate();
  } else if (content === 'cleanse') {
    handleCleanse();
  }
  lucide.createIcons();
}

formButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    showForm(btn);
    show(pageOverlay);
  });
});

setTotalRows(getTableLength(mainTable));
initPageOverlay(pageOverlay);
initHeaders();

lucide.createIcons();
