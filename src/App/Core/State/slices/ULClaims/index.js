import {
    SliceBuilder
} from '../SliceBuilder';
import {
    GetULClaims,
    GetULClaim,
} from './queries/getULClaims';
import {
    GetFormOfCoverages
} from './queries/GetFormOfCoverages';
import {
    SaveULClaim,
    DeleteULClaim
} from './queries/SaveULClaim';

/** @type {import('./types.d').LegalClaimSlice} */
const formOfCoverageSlice = new SliceBuilder('formOfCoverages')
    .addThunkFromOperation('getList', GetFormOfCoverages)
    .create();

const ulClaimsSlice = new SliceBuilder('ulClaims')
    .addThunkFromOperation('getList', GetULClaims)
    .create();

const ulClaimSlice = new SliceBuilder('ulClaim')
    .addThunkFromOperation('save', SaveULClaim)
    .addThunkFromOperation('get', GetULClaim)
    .create();

const ulClaimDeleteSlice = new SliceBuilder('ulClaimDelete')
    .addThunkFromOperation('delete', DeleteULClaim)
    .create();


export const ULClaimsReducer = ulClaimsSlice.rootReducer;
export const ULClaimsSelectors = ulClaimsSlice.selectors;
export const ULClaimsActions = ulClaimsSlice.actions;

export const ULClaimReducer = ulClaimSlice.rootReducer;
export const ULClaimSelectors = ulClaimSlice.selectors;
export const ULClaimActions = ulClaimSlice.actions;

export const ULClaimDeleteReducer = ulClaimDeleteSlice.rootReducer;
export const ULClaimDeleteSelectors = ulClaimDeleteSlice.selectors;
export const ULClaimDeleteActions = ulClaimDeleteSlice.actions;

export const FormOfCoverageReducer = formOfCoverageSlice.rootReducer;
export const FormOfCoverageSelectors = formOfCoverageSlice.selectors;
export const FormOfCoverageActions = formOfCoverageSlice.actions;

