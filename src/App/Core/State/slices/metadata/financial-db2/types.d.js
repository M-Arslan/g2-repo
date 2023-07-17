/**
 * @typedef {object} FinancialDB2
 * @property {string} claimID
 * @property {string} deductableRecoverable
 * @property {string} deductableRecovered
 * @property {string} expenseReserves
 * @property {string} lossReserves
 * @property {string} paidExpense
 * @property {string} paidLoss
 * @property {string} reinsuranceRecoverable
 * @property {string} reinsuranceRecovered
 * @property {string} reinsuranceReserves
 * @property {string} statusCode
 * @property {string} statusText
 */

/**
 * Actions for the FinancialDB2 slice
 *
 * @typedef {object} FinancialDB2Action
 * @property {Function} get
 */

/** 
 * FinancialDB2 selectors
 * 
 * @typedef {import('../../types.d').BaseListSelectors<FinancialDB2>} FinancialDB2Selectors
 */

/** @typedef {import('../../types.d').StateSlice<FinancialDB2Action, FinancialDB2Selectors>} FinancialDB2Slice */

