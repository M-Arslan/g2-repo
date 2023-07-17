/**
 * @typedef {object} ClaimDB2
 * @property {string} claimID
 * @property {string} statusCode
 * @property {string} statusText
 * @property {string} insuredName
 * @property {string} insuredNameContinuation
 * @property {string} policyID
 */

/**
 * Actions for the ClaimDB2 slice
 *
 * @typedef {object} ClaimDB2Action
 * @property {Function} get
 */

/** 
 * ClaimDB2 selectors
 * 
 * @typedef {import('../../types.d').BaseListSelectors<ClaimDB2>} ClaimDB2Selectors
 */

/** @typedef {import('../../types.d').StateSlice<ClaimDB2Action, ClaimDB2Selectors>} ClaimDB2Slice */

