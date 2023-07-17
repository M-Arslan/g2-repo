import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetAdjusterLicenseStates
} from './queries/GetAdjusterLicenseStates';

/** @type {import('./types.d').AdjusterLicenseStates} */
const slice = new SliceBuilder('adjusterLicenseStates')
    .addThunkFromOperation('get', GetAdjusterLicenseStates)
    .create();

export const adjusterLicenseStatesActions = slice.actions;
export const adjusterLicenseStatesSelectors = slice.selectors;
export const adjusterLicenseStatesReducer = slice.rootReducer;