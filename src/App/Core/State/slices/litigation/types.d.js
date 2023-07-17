/**
 * @typdef {object} Resource
 * @property {number} resourceID
 * @property {string} companyName
 */

/**
 * @typedef {object} Litigation
 * @property {string} litigationID
 * @property {string} claimMasterID
 * @property {string} claimResourceID
 * @property {Date} mediationDate
 * @property {Date} arbitrationDate
 * @property {Date} trialDate
 * @property {string} coveragePosition
 * @property {string} counselTypeCode
 * @property {Date} budgetRequestedDate
 * @property {Date} budgetReceivedDate
 * @property {number} budgetAmount
 * @property {Resource} resource
 * @property {string} createdBy
 * @property {string} createdDate
 * 
 */

/**
 * @typedef {object} GetLitigationArgs
 * @property {string} claimMasterId 
 */

/**
 * @typedef {object} SaveLitigationArgs
 * @property {Litigation} data
 */

/**
 * Actions for the Litigation slice
 *
 * @typedef {object} LitigationSpecificActions
 * @property {import('../types.d').SliceActionCreator<GetLitigationArgs>} get
 * @property {import('../types.d').SliceActionCreator<SaveLitigationArgs>} save
 * 
 * @typedef {import('../types.d').BaseActions<Litigation> & LitigationSpecificActions} LitigationActions
 */

/**
 * @typedef {import('../types.d').BaseSelectors<Litigation>} LitigationSelectors
 */

/**
 * @typedef {import('../types.d').StateSlice<LitigationActions, LitigationSelectors>} LitigationSlice
 */

export const KEY = 'LITIGATION_TYPES';