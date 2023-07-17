import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetClaimExaminers, GetClaimExaminersAll
} from './queries/GetClaimExaminers';

/** @type {import('./types.d').ClaimExaminerSlice} */
const slice = new SliceBuilder('claimExaminers')
    .addThunkFromOperation('get', GetClaimExaminers)
    .create();

const sliceAll = new SliceBuilder('claimExaminersAll')
    .addThunkFromOperation('getAll', GetClaimExaminersAll)
    .create();

export const claimExaminerActions = slice.actions;
export const claimExaminerSelectors = slice.selectors;
export const claimExaminerReducer = slice.rootReducer;


export const claimExaminerAllActions = sliceAll.actions;
export const claimExaminerAllSelectors = sliceAll.selectors;
export const claimExaminerAllReducer = sliceAll.rootReducer;