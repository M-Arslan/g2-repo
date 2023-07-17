import {
    SliceBuilder
} from '../SliceBuilder';
import { updateNotificationRole } from './queries/updateNotificationRole';

/** @type {import('./types.d').NotificationRolesSlice} */

const NotificationRolesSlice = new SliceBuilder('notificationRoles')
    .addThunkFromOperation('save', updateNotificationRole)
    .create();



export const NotificationRolesReducer = NotificationRolesSlice.rootReducer;
export const NotificationRolesSelectors = NotificationRolesSlice.selectors;
export const NotificationRolesActions = NotificationRolesSlice.actions;

