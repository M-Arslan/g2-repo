/**
 * Actions for the ClaimStatusType slice
 *
 * @typedef {object} ClaimStatusTypeActions
 * @property {Function} get
 */

/**
 * Claim Status Type
 * 
 * @typedef {object} ClaimStatusType
 * @property {number} claimStatusTypeID
 * @property {string} statusText 
 */

/** 
 * Claim Status Type selectors
 * 
 * @typedef {import('../../types.d').BaseListSelectors<ClaimStatusType>} ClaimStatusTypeSelectors
 */

/** @typedef {import('../../types.d').StateSlice<ClaimStatusTypeActions, ClaimStatusTypeSelectors>} ClaimStatusTypeSlice */

export const KEY = 'CLAIMSTATUSTYPES_TYPES';