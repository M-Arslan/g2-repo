import {
    SliceBuilder
} from '../SliceBuilder';
import {
    GetLegalClaim
} from './queries/GetLegalClaimDetail';
import {
    UpdateLegalClaim
} from './queries/UpdateLegalClaim';
import {
    UpdateLegalClaimMetadata
} from './queries/UpdateLegalClaimMetaData';

/** @type {import('./types.d').LegalClaimSlice} */
const slice = new SliceBuilder('legalClaim')
    .addThunkFromOperation('get', GetLegalClaim)
    .addThunkFromOperation('save', UpdateLegalClaim)
    .addThunkFromOperation('update', UpdateLegalClaimMetadata)
    .create();


export const LegalClaimReducer = slice.rootReducer;
export const LegalClaimSelectors = slice.selectors;
export const LegalClaimActions = slice.actions;
