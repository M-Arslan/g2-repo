/**
 * @typedef object NotificationMessageType
 * @property {string} notificationMessageTypeID
 * @property {string} notificationMessageTypeText
 * @property {string} active
 * @property {string} createdBy
 * @property {string} createdDate
 * @property {string} modifiedBy
 * @property {string} modifiedDate
/**
* Actions for the Task Type slice
*
* @typedef {object} NotificationMessageTypeActions
* @property {Function} get
*/

/**
 *  Task Type selectors
 *
 * @typedef {import('../../types.d').BaseListSelectors<TasNotificationMessageTypekType>}  NotificationMessageTypeSelectors
 */

/** @typedef {import('../../types.d').StateSlice< NotificationMessageTypeActions,  NotificationMessageTypeSelectors>}  NotificationMessageTypeSlice */

export const KEY = 'NOTIFICATION_TYPE_TYPES';