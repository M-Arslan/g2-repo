import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetRiskStates
} from './queries/GetRiskStates';

/** @type {import('./types.d').RiskStatesSlice} */
const slice = new SliceBuilder('riskStates')
    .addThunkFromOperation('get', GetRiskStates)
    .create();

export const riskStatesActions = slice.actions;
export const riskStatesSelectors = slice.selectors;
export const riskStatesReducer = slice.rootReducer;