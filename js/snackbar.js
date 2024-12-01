export const showSnackbar = (title, message, duration = 2500) => {
  const snackbar = document.querySelector('.snackbar');
  const snackbarTitle = document.querySelector('.snackbar-title');
  const snackbarText = document.querySelector('.snackbar-text');

  snackbarTitle.innerHTML = title;
  snackbarText.innerHTML = message;
  snackbar.classList.add('show');

  setTimeout(() => {
    snackbar.classList.remove('show');
  }, duration);
};
