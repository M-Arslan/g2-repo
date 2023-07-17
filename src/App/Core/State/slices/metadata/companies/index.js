import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetCompanyNames
} from './queries/GetCompanies';

/** @type {import('./types.d').CompanySlice} */
const slice = new SliceBuilder('companies')
    .addThunkFromOperation('get', GetCompanyNames)
    .create();

export const companiesActions = slice.actions;
export const companiesSelectors = slice.selectors;
export const companiesReducer = slice.rootReducer;