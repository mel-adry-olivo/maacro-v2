import { initPageOverlay, show, setTotalRows } from './js/utils.js';
import { getTableLength } from './js/holy-table.js';
import { handleDeduplicate } from './js/holy-deduplicate.js';
import { handleCleanse } from './js/holy-cleanse.js';
import { initHeaders } from './js/holy-revise.js';
import { handleMerge } from './js/holy-merge.js';
import { handleJoin } from './js/holy-join.js';

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
  } else if (content === 'merge') {
    handleMerge();
  } else if (content === 'join') {
    handleJoin();
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
