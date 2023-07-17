import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetMLAThreshold
} from './queries/GetMLAThreshold';

/** @type {import('./types.d').MLAThreshold} */
const slice = new SliceBuilder('mlaThreshold')
    .addThunkFromOperation('get', GetMLAThreshold)
    .create();

export const mlaThresholdActions = slice.actions;
export const mlaThresholdSelectors = slice.selectors;
export const mlaThresholdReducer = slice.rootReducer;