import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetLineOfBusinessTypes
} from './queries/GetLineOfBusinessTypes';

/** @type {import('./types.d').LineOfBusinessCodingTypeSlice} */
const slice = new SliceBuilder('lineOfBusinessCodingTypes')
    .addThunkFromOperation('list', GetLineOfBusinessTypes)
    .create();

export const lineOfBusinessCodingTypeActions = slice.actions;
export const lineOfBusinessCodingTypeSelectors = slice.selectors;
export const lineOfBusinessCodingTypeReducer = slice.rootReducer;