import {
    ASYNC_STATES
} from '../../../Enumerations/redux/async-states';
import {
    watch
} from '../app-status';
import {
    SliceBuilder
} from '../SliceBuilder';
import { AddAssocClaims } from './queries/AddAssocClaims';
import { DeleteAssocClaim } from './queries/DeleteAssocClaim';
import { GetAssocClaims } from './queries/GetAssocClaims';


/** @type {import('./types.d').AssocClaimSlice} */
const slice = new SliceBuilder('assoc-claims')
    .addThunkFromOperation('get', GetAssocClaims)
    .addThunkFromOperation('add', AddAssocClaims)
    .addThunkFromOperation('delete', DeleteAssocClaim)
    .create();

export const assocClaimsReducer = slice.rootReducer;
export const assocClaimsSelectors = slice.selectors;
export const assocClaimsActions = slice.actions;

watch(ASYNC_STATES.ERROR, 'There was a problem loading Associated Claims for the active claim', slice.thunks.get);
watch(ASYNC_STATES.SUCCESS, 'The Associated Claim was saved successfully', slice.thunks.add);
watch(ASYNC_STATES.ERROR, 'There was an error saving the Associated Claim', slice.thunks.add);
watch(ASYNC_STATES.SUCCESS, 'The Associated Claim was successfully deleted', slice.thunks.delete);
watch(ASYNC_STATES.ERROR, 'There was an error deleting the Associated Claim', slice.thunks.delete);