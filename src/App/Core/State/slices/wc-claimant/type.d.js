/**
 * @typedef object WCClaimants
 * @property {string} ClaimantID
 * @property {string} ClaimantName
 * @property {string} DateOfBirth
 * @property {string} Gender
 * @property {boolean} Deceased
 * @property {string} Tabular
 * @property {boolean} Escalating
 * @property {string} TableType
 * @property {string} Comments

 *
 * @typedef {object} GetWCClaimantDetail
 * @property {string} claimantID
 *
 *

 *
 * @typedef {object} WCClaimantActions
 * @property {import('../types.d').SliceActionCreator<GetWCClaimantActionArgs>} get
 *
 * @typedef {import('../types.d').BaseListSelectors<WCClaimantActions>} WCClaimantListSelectors
 *
 * @typedef {import('../types.d').StateSlice<WCClaimantActions, WCClaimantSelectors>}  wcClaimSlice

 *
 **/

export const KEY = 'WC_CLAIMANT'