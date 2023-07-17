import {
    ASYNC_STATES
} from '../../../Enumerations/redux/async-states';
import {
    watch
} from '../app-status';
import {
    SliceBuilder
} from '../SliceBuilder';
import {
    GetClaimMaster
} from './queries/GetClaimMaster';
import {
    UpdateClaimMaster
} from './queries/UpdateClaimMaster';
import {
    GetPolicyAggregate
} from './queries/GetPolicyAggregate';

/** @type {import('./types.d').ClaimSlice} */
const slice = new SliceBuilder('claim')
    .addReducer('stuff', (state, action) => {
        state.data = action.payload;
    })
    .addThunkFromOperation('get', GetClaimMaster)
    .addThunkFromOperation('save', UpdateClaimMaster)
    .create();

const slicePolicyAggregate = new SliceBuilder('policyAggregate')
    .addThunkFromOperation('list', GetPolicyAggregate)
    .create();


export const claimReducer = slice.rootReducer;
export const claimSelectors = slice.selectors;
export const claimActions = slice.actions;

export const policyAggregateReducer = slicePolicyAggregate.rootReducer;
export const policyAggregateSelectors = slicePolicyAggregate.selectors;
export const policyAggregateActions = slicePolicyAggregate.actions;


watch(ASYNC_STATES.SUCCESS, 'The Claim was save successfully', slice.thunks.save);
watch(ASYNC_STATES.ERROR, 'There was a problem loading the selected claim', slice.thunks.get);
watch(ASYNC_STATES.ERROR, 'There was an issue saving the claim', slice.thunks.save);