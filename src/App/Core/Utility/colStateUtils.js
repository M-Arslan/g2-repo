/**
 * @typedef {object} AgGridColumnState
 * @property {string} colId
 * @property {bool} [hide=null]
 * @property {number} [width]
 * @property {number} [flex=null]
 * @property {'asc'|'desc'|null} [sort=null]
 * @property {number} [sortIndex=null]
 * @property {boolean|'left'|'right'|null} [pinned=null]
 */

import { ensureNonEmptyString } from "./rules";

/**
 * 
 * @param {any} columnApi
 * @param {string} colId
 * @returns {AgGridColumnState}
 */
export function getColumn(columnApi, colId) {
    return columnApi?.getColumnState().find(cs => cs.colId === colId);
}

/**
 * 
 * @param {any} columnApi
 * @returns {Array<AgGridColumnState>}
 */
export function getSortedColumns(columnApi) {
    return columnApi?.getColumnState().filter(cs => ensureNonEmptyString(cs.sort));
}