/**
 * @typedef {object} ClaimActivity
 * @property {string} activityID
 * @property {string} claimMasterID
 * @property {number} claimStatusTypeID 
 * 
 * @typedef {object} GetClaimActivityActionArgs
 * @property {string} claimMasterID
 * 
 * @typedef {object} ClaimActivityActions
 * @property {import('../types.d').SliceActionCreator<GetClaimActivityActionArgs>} get
 * 
 * @typedef {import('../types.d').BaseListSelectors<ClaimActivity>} ClaimActivitySelectors
 * 
 * @typedef {import('../types.d').StateSlice<ClaimActivityActions, ClaimActivitySelectors>} ClaimActivitySlice
 */

export const KEY = 'CLAIM_ACTIVITY_TYPES';