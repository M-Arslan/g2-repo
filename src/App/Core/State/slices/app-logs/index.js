import {
    SliceBuilder
} from '../SliceBuilder';
import {
    GetAppLogs
} from './queries/GetAppLogs';
import {
    WriteAppLog
} from './queries/WriteAppLog';


/** @type {import('./types.d').AppLogSlice} */
const slice = new SliceBuilder('app-logs')
    .addThunkFromOperation('get', GetAppLogs)
    .addThunkFromOperation('save', WriteAppLog)
    .create();

export const appLogsReducer = slice.rootReducer;
export const appLogsSelectors = slice.selectors;
export const appLogsActions = slice.actions;