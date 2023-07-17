/**
 * @typedef object LegalClaim
 * @property {string} claimDetailID
 * @property {string} claimMasterID
 * @property {string} assignedToCounsel
 * @property {string} iADate
 * @property {string} mGADate
 * @property {string} uWDate
 *
 * @property {number} companyEntityTypeID
 * @property {boolean} subpoenaOnly
 * @property {boolean} quasiDirectAction
 * @property {boolean} coverageOnly
 * @property {boolean} aobClaim
 * @property {boolean} samClaim
 * 
 * @typedef {object} GetLegalClaimActionArgs
 * @property {string} claimMasterID
 * 
 * 
 *  Save Legal Claim action
 * 
 * @callback SaveLegalClaim
 * @param {SaveLegalClaimArgs} args
 * @returns {import('redux').Action<LegalClaim>}
 * 
 * @typedef {object} LegalClaimActions
 * @property {import('../types.d').SliceActionCreator<GetLegalClaimActionArgs>} get
 * 
 * @typedef {import('../types.d').BaseListSelectors<LegalClaim>} LegalClaimSelectors
 * 
 * @typedef {import('../types.d').StateSlice<LegalClaimActions, LegalClaimSelectors>} LegalClaimSlice
 
 *   
 **/

export const KEY = 'LEGAL_CLAIM_TYPES';