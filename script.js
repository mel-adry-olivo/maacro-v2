import { initPageOverlay, show, setTotalRows } from './js/utils.js';
import { handleDeduplicate } from './js/holy-deduplicate.js';
import { handleCleanse } from './js/holy-cleanse.js';
import { handleMerge } from './js/holy-merge.js';
import { handleJoin } from './js/holy-join.js';
import { handleStatistics } from './js/holy-statistics.js';
import { handleVisualize } from './js/holy-visualize.js';
import { handleDerive } from './js/holy-derive.js';
import { handleUpload } from './js/holy-upload.js';
import { handleDownload } from './js/holy-download.js';
import { getTableData } from './js/holy-table.js';
import { showSnackbar } from './js/snackbar.js';

const formButtons = document.querySelectorAll('.btn-form');
const pageOverlay = document.querySelector('.page-overlay');

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
    case 'derive':
      handleDerive();
      break;
    case 'upload':
      handleUpload();
      break;
    case 'download':
      handleDownload();
      break;
  }

  lucide.createIcons();
}

formButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const table = getTableData();
    if (table.length <= 0 && btn.dataset.action !== 'upload' && btn.dataset.action !== 'download') {
      showSnackbar('Reminder', 'Please upload a file first.');
      return;
    }
    showForm(btn);
    show(pageOverlay);
  });
});

initPageOverlay(pageOverlay);
lucide.createIcons();
