import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetLegalCompanies
} from './queries/GetLegalCompanies';

/** @type {import('./types.d').CompanySlice} */
const slice = new SliceBuilder('legalCompanies')
    .addThunkFromOperation('get', GetLegalCompanies)
    .create();

export const legalCompaniesActions = slice.actions;
export const legalCompaniesSelectors = slice.selectors;
export const legalCompaniesReducer = slice.rootReducer;