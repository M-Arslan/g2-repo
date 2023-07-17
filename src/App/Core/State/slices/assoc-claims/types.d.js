/**
 * @typedef {object} AssociatedClaim
 * @property {string} associatedClaimID
 * @property {string} claimMasterID
 * @property {string} claimID
 * @property {string} policyID
 * @property {string} statusCode
 * @property {string} statusText
 * @property {string} insuredName
 * @property {string} examinerID
 * @property {string} examinerFirstName
 * @property {string} examinerLastName
 * 
 */

/**
 * @typedef {object} GetAssocClaimsArgs
 * @property {string} claimMasterId 
 */

/**
 * @callback GetAssocClaimsCreator
 * @param {GetAssocClaimsArgs} args
 * @returns {import('redux').Action}
 */

/**
 * @typedef {object} AddAssocClaimsArgs
 * @property {Array<AssociatedClaim>} data
 */

/** 
 * @callback AddAssocClaimsCreator
 * @param {AddAssocClaimsArgs} args
 * @returns {import('redux').Action}
 */

/** 
 * @typedef {object} DeleteAssocClaimArgs
 * @property {string} id
 */

/**
 * @callback DeleteAssocClaimCreator
 * @param {DeleteAssocClaimArgs} args
 * @returns {import('redux').Action}
 */

/**
 * Actions for the AssocClaims slice
 *
 * @typedef {object} AssocClaimsActions
 * @property {GetAssocClaimsCreator} get
 * @property {AddAssocClaimsCreator} add
 * @property {DeleteAssocClaimCreator} delete
 */

/**
 * @typedef {import('../types.d').BaseListSelectors<AssociatedClaim>} AssocClaimSelectors
 */

/**
 * @typedef {import('../types.d').StateSlice<AssocClaimsActions, AssocClaimSelectors>} AssocClaimSlice
 */

export const KEY = 'ASSOC_CLAIM_TYPES';