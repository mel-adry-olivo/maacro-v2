import { initPageOverlay, show, setTotalRows } from './js/utils.js';
import { getTableLength } from './js/holy-table.js';
import { handleDeduplicate } from './js/holy-deduplicate.js';
import { handleCleanse } from './js/holy-cleanse.js';
import { initHeaders } from './js/holy-revise.js';
import { handleMerge } from './js/holy-merge.js';
import { handleJoin } from './js/holy-join.js';
import { handleStatistics } from './js/holy-statistics.js';
import { handleVisualize } from './js/holy-visualize.js';

const formButtons = document.querySelectorAll('.btn-form');
const pageOverlay = document.querySelector('.page-overlay');
const mainTotalRows = document.querySelector('.total-rows');
const mainTable = document.querySelector('.table-main');

export async function showForm(btn) {
  const content = btn.dataset.action;
  const response = await fetch('./forms/' + content + '.php');
  const data = await response.text();
  document.querySelector('.form-container').innerHTML = data;

  switch (content) {
    case 'deduplicate':
      handleDeduplicate();
      break;
    case 'cleanse':
      handleCleanse();
      break;
    case 'merge':
      handleMerge();
      break;
    case 'join':
      handleJoin();
      break;
    case 'statistics':
      handleStatistics();
      break;
    case 'visualize':
      handleVisualize();
      break;
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
