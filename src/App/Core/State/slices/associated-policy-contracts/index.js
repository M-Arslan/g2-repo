import {
    SliceBuilder
} from '../SliceBuilder';
import {
    getAssociatedPolicyContracts
} from './queries/getAssociatedPolicyContracts';
import {
    getAssociatedPolicy
} from './queries/getAssociatedPolicy';
import {
    saveAssociatedPolicyContract
} from './queries/saveAssociatedPolicyContract'; 
import {
    deleteAssociatedPolicy
} from './deleteAssociatedPolicy';

/** @type {import('./types.d').associatedPolicyContractSlice} */
const slice = new SliceBuilder('associatedPolicyContract')
    .addThunkFromOperation('getList', getAssociatedPolicyContracts)
    .create();

const policySlice = new SliceBuilder('associatedPolicy')
    .addThunkFromOperation('get', getAssociatedPolicy)
    .addThunkFromOperation('save', saveAssociatedPolicyContract)
    .create();

const associatedPolicyDeleteSlice = new SliceBuilder('associatedPolicyDelete')
    .addThunkFromOperation('delete', deleteAssociatedPolicy)
    .create();
    

export const associatedPolicyContractReducer = slice.rootReducer;
export const associatedPolicyContractSelectors = slice.selectors;
export const associatedPolicyContractActions = slice.actions;

export const associatedPolicyDeleteReducer = associatedPolicyDeleteSlice.rootReducer;
export const associatedPolicyDeleteSelectors = associatedPolicyDeleteSlice.selectors;
export const associatedPolicyDeleteActions = associatedPolicyDeleteSlice.actions;

export const associatedPolicyReducer = policySlice.rootReducer;
export const associatedPolicySelectors = policySlice.selectors;
export const associatedPolicyActions = policySlice.actions;

