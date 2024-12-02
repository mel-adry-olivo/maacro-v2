export const showSnackbar = (title, message, duration = 2500) => {
  const snackbar = document.createElement('div');
  snackbar.classList.add('snackbar');

  const snackbarHeader = document.createElement('div');
  snackbarHeader.classList.add('snackbar-header');

  const icon = document.createElement('i');
  icon.setAttribute('data-lucide', 'bell');
  snackbarHeader.appendChild(icon);

  const snackbarTitle = document.createElement('span');
  snackbarTitle.classList.add('snackbar-title');
  snackbarTitle.innerHTML = title;
  snackbarHeader.appendChild(snackbarTitle);

  const snackbarText = document.createElement('span');
  snackbarText.classList.add('snackbar-text');
  snackbarText.innerHTML = message;

  snackbar.appendChild(snackbarHeader);
  snackbar.appendChild(snackbarText);

  document.querySelector('.snackbar-container').appendChild(snackbar);

  lucide.createIcons();

  setTimeout(() => {
    snackbar.classList.add('show');
  }, 10);

  setTimeout(() => {
    snackbar.classList.remove('show');
    snackbar.addEventListener('transitionend', () => {
      snackbar.remove();
    });
  }, duration);
};
