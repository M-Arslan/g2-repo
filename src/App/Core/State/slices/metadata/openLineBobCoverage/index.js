import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetOpenLineBobCoverage
} from './queries/GetOpenLineBobCoverage';

/** @type {import('./types.d').CompanySlice} */
const slice = new SliceBuilder('OpenLineBobCoverage')
    .addThunkFromOperation('get', GetOpenLineBobCoverage)
    .create();

export const OpenLineBobCoverageActions = slice.actions;
export const OpenLineBobCoverageSelectors = slice.selectors;
export const openLineBobCoverageReducer = slice.rootReducer;