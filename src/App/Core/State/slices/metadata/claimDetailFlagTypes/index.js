import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetClaimDetailFlagTypes
} from './queries/GetClaimDetailFlagTypes';

/** @type {import('./types.d').ClaimDetailFlagType} */
const slice = new SliceBuilder('ClaimDetailFlagTypes')
    .addThunkFromOperation('get', GetClaimDetailFlagTypes)
    .create();

export const claimDetailFlagTypesActions = slice.actions;
export const claimDetailFlagTypesSelectors = slice.selectors;
export const claimDetailFlagTypesReducer = slice.rootReducer;