/**
 * @typedef object PreTrialMemoType
 * 
 * @property {string} notificationRoleID
 * @property {string} notificationID
 * @property {string} roleID
 * @property {string} claimStatusTypeID
 * @property {string} createdBy
 * @property {string} createdDate
 * @property {string} modifiedBy
 * @property {string} modifiedDate
/**
* Actions for the NotificationRoles Type slice
*
* @typedef {object} NotificationRolesActions
* @property {Function} get
*/

/**
 *  PreTrailMemoSelectors
 *
 * @typedef {import('../../types.d').NotificationRolesSelectors<StringGraphType>}  NotificationRolesSelectors
 */

/** @typedef {import('../../types.d').StateSlice< NotificationRolesActions,  NotificationRolesSelectors>}  NotificationRolesSlice */
export const KEY = 'Notification_Roles';