import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetCurrencies
} from './queries/GetCurrencies';

/** @type {import('./types.d').Currency} */
const slice = new SliceBuilder('currencies')
    .addThunkFromOperation('get', GetCurrencies)
    .create();

export const currencyActions = slice.actions;
export const currencySelectors = slice.selectors;
export const currencyReducer = slice.rootReducer;