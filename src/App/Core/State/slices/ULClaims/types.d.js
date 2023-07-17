/**
 * @typedef object ULClaims
 * @property {string} claimDetailID
 * @property {string} UlClaimID
 * @property {string} ClaimMasterID
 * @property {string} ClaimID
 * @property {string} ClaimExaminerID
 * @property {string} PastClaimExaminerID
 * @property {string} LossLocation
 * @property {string} DOL
 * @property {string} FalClaimStatusTypeID
 * @property {string} JurisdictionType
 * @property {string} Jursidiction
 * @property {string} CompanyEntityTypeID
 * @property {string} Deductible
 * @property {string} FormOfCoverageCD
 * @property {string} RetroDate
 * @property {string} Comment
 * 
 * @typedef {object} GetULClaimsActionArgs
 * @property {string} claimMasterID
 * 
 * 

 * 
 * @typedef {object} ULClaimActions
 * @property {import('../types.d').SliceActionCreator<GetULClaimsActionArgs>} get
 * 
 * @typedef {import('../types.d').BaseListSelectors<ULClaims>} ULClaimSelectors
 * 
 * @typedef {import('../types.d').StateSlice<ULClaimActions, ULClaimSelectors>}  ULClaimSlice
 
 *   
 **/

export const KEY = 'UL_CLAIM_TYPES';

