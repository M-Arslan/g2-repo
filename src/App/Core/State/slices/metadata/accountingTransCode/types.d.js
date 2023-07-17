/**
 * @typedef {object} AccountingTransCode
 * @property {string} transCode
 * @property {string} transCodeDesc
 * @property {string} reserveChange
 * @property {string} category
 * @property {string} active

 */

/**
 * Actions for the AccountingTransCodes slice
 *
 * @typedef {object} AccountingTransCodeActions
 * @property {Function} get
 */

/** 
 * Accounting Trans Code selectors
 * 
 * @typedef {import('../../types.d').BaseListSelectors<AccountingTransCode>} AccountingTransCodeSelectors
 */

/** @typedef {import('../../types.d').StateSlice<AccountingTransCodeActions, AccountingTransCodeSelectors>} AccountingTransCodeSlice */

export const KEY = 'RISKSTATES_TYPES';