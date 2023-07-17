import {
    SliceBuilder
} from '../SliceBuilder';
import { getNotificationMessageType } from './queries/getNotificationMessageType';

const notificationMessageTypeSlice = new SliceBuilder('notificationMessageType')
    .addThunkFromOperation('get', getNotificationMessageType)
    .create();

export const notificationMessageTypeReducer = notificationMessageTypeSlice.rootReducer;
export const notificationMessageTypeSelectors = notificationMessageTypeSlice.selectors;
export const notificationMessageTypeActions = notificationMessageTypeSlice.actions;