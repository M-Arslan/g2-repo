/**
 * @typedef {object} Branch
 * @property {number} claimBranchID
 * @property {string} branchCode
 * @property {string} branchName
 */

/**
 * Actions for the Branches slice
 *
 * @typedef {object} BranchActions
 * @property {Function} get
 */

/** 
 * Selectors for the Branches slice
 * 
 * @typedef {import('../../types.d').BaseListSelectors<Branch>} BranchSelectors
 */

/** @typedef {import('../../types.d').StateSlice<BranchActions, BranchSelectors>} BranchesSlice */

export const KEY = 'BRANCHES_TYPES';