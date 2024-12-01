export function createDropdown(options, action) {
  const select = document.createElement('select');
  select.classList.add('dropdown-select');
  select.setAttribute('name', 'dropdown');
  select.setAttribute('data-action', action);

  options.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });

  return select;
}
