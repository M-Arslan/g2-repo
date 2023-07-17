import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetLegalEntities
} from './queries/GetG2LegalEntities';

/** @type {import('./types.d').LegalEntitySlice} */
const slice = new SliceBuilder('legal-entities')
    .addThunkFromOperation('get', GetLegalEntities)
    .create();

export const legalEntityActions = slice.actions;
export const legalEntitySelectors = slice.selectors;
export const legalEntityReducer = slice.rootReducer;