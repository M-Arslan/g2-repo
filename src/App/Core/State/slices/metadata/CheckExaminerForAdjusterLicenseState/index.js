import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetCheckExaminerForAdjusterLicenseState,
} from './queries/GetCheckExaminerForAdjusterLicenseState';

/** @type {import('./types.d').CheckExaminerForAdjusterLicenseState} */
const slice = new SliceBuilder('CheckExaminerForAdjusterLicenseState')
    .addThunkFromOperation('get', GetCheckExaminerForAdjusterLicenseState)
    .create();

export const CheckExaminerForAdjusterLicenseStateActions = slice.actions;
export const CheckExaminerForAdjusterLicenseStateSelectors = slice.selectors;
export const CheckExaminerForAdjusterLicenseStateReducer = slice.rootReducer;
