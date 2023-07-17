import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetBranches
} from './queries/GetBranches';

/** @type {import('./types.d').BranchesSlice} */
const slice = new SliceBuilder('branches')
    .addThunkFromOperation('get', GetBranches)
    .create();

export const branchesActions = slice.actions;
export const branchesSelectors = slice.selectors;
export const branchesReducer = slice.rootReducer;