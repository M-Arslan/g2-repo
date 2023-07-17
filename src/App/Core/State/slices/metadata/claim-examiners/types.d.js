/**
 * @typedef {object} ClaimExaminer
 * @property {string} userID
 * @property {string} firstName
 * @property {string} lastName
 * @property {number} branchID
 * @property {string} managerFirstName
 * @property {string} managerLastName
 */

/**
 * Actions for the ClaimExaminer slice
 *
 * @typedef {object} ClaimExaminerActions
 * @property {Function} get
 */

/**
 * Risk State selectors
 *
 * @typedef {import('../../types.d').BaseListSelectors<ClaimExaminer>} ClaimExaminerSelectors
 */

/**
 * @typedef {import('../../types.d').StateSlice<ClaimExaminerActions, ClaimExaminerSelectors>} ClaimExaminerSlice 
 */

export const KEY = 'CLAIM_EXAMINER_TYPES';