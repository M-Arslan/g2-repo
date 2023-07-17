import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetClaimStatusTypes
} from './queries/GetClaimStatusTypes';

/** @type {import('./types.d').ClaimStatusTypeSlice} */
const slice = new SliceBuilder('claimStatusTypes')
    .addThunkFromOperation('get', GetClaimStatusTypes)
    .create();

export const claimStatusTypeActions = slice.actions;
export const claimStatusTypeSelectors = slice.selectors;
export const claimStatusTypeReducer = slice.rootReducer;