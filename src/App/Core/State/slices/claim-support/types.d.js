/**
 * @typedef object claimSupportObject
 * @property {string} notificationID
 * @property {string} claimMasterID
 * @property {string} typeCode
 * @property {string} title
 * @property {string} body
 * @property {string} relatedURL
 * @property {string} isHighPriority
 * @property {string} roleID
 * @property {string} taskTypeID
 * @property {string} supportTypeID
 * @property {string} createdBy
 * @property {string} createdDate
 * @property {string} modifiedBy
 * @property {string} modifiedDate
 *
 * @typedef {object} GetClaimSupportArgs
 * @property {string} notificationID
 *
 *

/**
 *  claimSupportTypeSelectors
 *
 * @typedef {import('../../types.d').claimSupportTypeSelectors<claimSupportType>}  claimSupportTypeSelectors
 */

/** @typedef {import('../../types.d').StateSlice< claimSupportTypeActions,  claimSupportTypeSelectors>}  claimSupportTypeSlice */


export const KEY = 'CLAIM_SUPPORT_TYPES';