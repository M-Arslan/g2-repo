import {
    SliceBuilder
} from '../SliceBuilder';
import { getTaskTypes } from './queries/getTaskTypes';

/** @type {import('./types.d').taskTypeSlice */
const taskTypeSlice = new SliceBuilder('TaskType')
    .addThunkFromOperation('get', getTaskTypes)
    .create();

export const taskTypeReducer = taskTypeSlice.rootReducer;
export const taskTypeSelectors = taskTypeSlice.selectors;
export const taskTypeActions = taskTypeSlice.actions;