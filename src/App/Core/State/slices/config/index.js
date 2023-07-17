import {
    SliceBuilder
} from '../SliceBuilder';
import {
    GetConfig
} from './queries/GetConfig';


/** @type {import('./types.d').ConfigSlice */
const slice = new SliceBuilder('config').addThunkFromOperation('get', GetConfig).create();

export const configReducer = slice.rootReducer;
export const configSelectors = slice.selectors;
export const configActions = slice.actions;