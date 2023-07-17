/**
 * @typedef object notificationcomment
 * @property {string} notificationCommentID
 * @property {string} notificationID
 * @property {string} comment
 * @property {string} createdBy
 * @property {string} createdDate
 * @property {string} modifiedBy
 * @property {string} modifiedDate
 *
 * @typedef {object} getNotificationComments
 * @property {string} notificationCommentID
 *
 *

 *
 * @typedef {object} NotificationCommentsActions
 * @property {import('../types.d').SliceActionCreator<getNotificationCommentsargs>} get
 *
 * @typedef {import('../types.d').BaseListSelectors<associatedPolicyContract>} NotificationCommentsSelectors
 *
 * @typedef {import('../types.d').StateSlice<NotificationCommentsActions, NotificationCommentsSelectors>} NotificationCommentsSlice

 *
 **/

export const KEY = 'NotificationComments_TYPES';