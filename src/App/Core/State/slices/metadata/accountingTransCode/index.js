import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetAccountingTransCodes
} from './queries/GetAccountingTransCodes';

/** @type {import('./types.d').AccountingTransCode} */
const slice = new SliceBuilder('accountingTransCodes')
    .addThunkFromOperation('get', GetAccountingTransCodes)
    .create();

export const accountingTransCodeActions = slice.actions;
export const accountingTransCodeSelectors = slice.selectors;
export const accountingTransCodeReducer = slice.rootReducer;