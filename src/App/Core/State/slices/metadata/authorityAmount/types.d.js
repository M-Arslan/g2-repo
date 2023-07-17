/**
 * @typedef {object} AuthorityAmount
 * @property {string} authorityAmountID
 * @property {string} userID
 * @property {string} genServeID
 * @property {string} g2LegalEntityID
 * @property {string} legalEntityManagerID
 * @property {string} reserveAmount
 * @property {string} paymentAmount
 */

/**
 * Actions for the AuthorityAmount slice
 *
 * @typedef {object} AuthorityAmountAction
 * @property {Function} get
 */

/** 
 * AuthorityAmount selectors
 * 
 * @typedef {import('../../types.d').BaseListSelectors<AuthorityAmount>} AuthorityAmountSelectors
 */

/** @typedef {import('../../types.d').StateSlice<AuthorityAmountAction, AuthorityAmountSelectors>} AuthorityAmountSlice */

