import {
    SliceBuilder
} from '../SliceBuilder';
/* GET , POST QUERIES HERE */
import { getNotificationComments} from './queries/getNotificationComments';
import { saveNotificationComment } from './queries/saveNotificationComment';

/** @type {import('./types.d').NotificationCommentsSlice} */

const NotificationCommentsSlice = new SliceBuilder('notificationComments')
    .addThunkFromOperation('create', saveNotificationComment)
    .create();

const getNotificationCommentsSlice = new SliceBuilder('getNotificationComments')
    .addThunkFromOperation('get', getNotificationComments)
    .create();



export const NotificationCommentsReducer = NotificationCommentsSlice.rootReducer;
export const NotificationCommentsSelectors = NotificationCommentsSlice.selectors;
export const NotificationCommentsActions = NotificationCommentsSlice.actions;

export const NotificationCommentsGetReducer = getNotificationCommentsSlice.rootReducer;
export const NotificationCommentsGetSelectors = getNotificationCommentsSlice.selectors;
export const NotificationCommentsGetActions = getNotificationCommentsSlice.actions;

