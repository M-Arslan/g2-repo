import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetAccountingTransTypes
} from './queries/GetAccountingTransTypes';

/** @type {import('./types.d').AccountingTransType} */
const slice = new SliceBuilder('accountingTranstypes')
    .addThunkFromOperation('get', GetAccountingTransTypes)
    .create();

export const accountingTransTypeActions = slice.actions;
export const accountingTransTypeSelectors = slice.selectors;
export const accountingTransTypeReducer = slice.rootReducer;