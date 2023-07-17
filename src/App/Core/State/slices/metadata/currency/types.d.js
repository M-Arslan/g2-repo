/**
 * @typedef {object} Currency
 * @property {number} iSO
 * @property {string} name
 * @property {string} active
 */

/**
 * Actions for the Currency slice
 *
 * @typedef {object} CurrencyActions
 * @property {Function} get
 */

/** 
 * Currency selectors
 * 
 * @typedef {import('../../types.d').BaseListSelectors<Currency>} CurrencySelectors
 */

/** @typedef {import('../../types.d').StateSlice<CurrencyActions, CurrencySelectors>} CurrencySlice */

export const KEY = 'RISKSTATES_TYPES';