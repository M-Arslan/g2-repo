import {
    SliceBuilder
} from '../SliceBuilder';
import {
    GetClaimActivity
} from './queries/GetClaimActivity';

/** @type {import('./types.d').ClaimActivitySlice} */
const slice = new SliceBuilder('claimActivities')
    .addThunkFromOperation('get', GetClaimActivity)
    .create();

export const claimActivityReducer = slice.rootReducer;
export const claimActivitySelectors = slice.selectors;
export const claimActivityActions = slice.actions;
