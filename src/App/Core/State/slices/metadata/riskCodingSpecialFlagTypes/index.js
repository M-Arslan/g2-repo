import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetRiskCodingSpecialFlagTypes
} from './queries/GetRiskCodingSpecialFlagTypes';

/** @type {import('./types.d').RiskCodingSpecialFlagTypes} */
const slice = new SliceBuilder('riskCodingSpecialFlagTypes')
    .addThunkFromOperation('list', GetRiskCodingSpecialFlagTypes)
    .create();

export const riskCodingSpecialFlagTypesActions = slice.actions;
export const riskCodingSpecialFlagTypesSelectors = slice.selectors;
export const riskCodingSpecialFlagTypesReducer = slice.rootReducer;