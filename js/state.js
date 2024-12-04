import { getTableColumns } from './holy-table.js';

let columnsState = {};

export function getColumnsState() {
  return columnsState;
}

export function setColumnsState(state) {
  columnsState = state;
}

export function initializeColumnsState() {
  const columns = getTableColumns();
  setColumnsState(columns);
}
