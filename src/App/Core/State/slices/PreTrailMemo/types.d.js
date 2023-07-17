/**
 * @typedef object PreTrialMemoType
 * 
 * @property {string} preTrialMemoID
 * @property {string} notificationID
 * @property {string} claimMasterID
 * @property {string} claimant
 * @property {string} trialDate
 * @property {string} venue
 * @property {string} primaryExcessCarrier
 * @property {string} defenseCounsel
 * @property {string} limits
 * @property {string} reserve
 * @property {string} descriptionOfLoss
 * @property {string} liability
 * @property {string} damages
 * @property {string} statusOfNegotiations
 * @property {string} createdBy
 * @property {string} createdDate
 * @property {string} modifiedBy
 * @property {string} modifiedDate
/**
* Actions for the preTrialMemo Type slice
*
* @typedef {object} PreTrailMemoActions
* @property {Function} create
*/

/**
 *  PreTrailMemoSelectors
 *
 * @typedef {import('../../types.d').PreTrailMemoSelectors<PreTrialMemoType>}  PreTrailMemoSelectors
 */

/** @typedef {import('../../types.d').StateSlice< PreTrailMemoActions,  PreTrailMemoSelectors>}  PreTrailMemoSlice */
export const KEY = 'PreTrailMemo_TYPES';