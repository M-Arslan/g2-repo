import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetLossExpenseReserveDB2
} from './queries/GetLossExpenseReserveDB2';

/** @type {import('./types.d').LossExpenseReserveDB2} */
const slice = new SliceBuilder('lossExpenseReserveDB2')
    .addThunkFromOperation('get', GetLossExpenseReserveDB2)
    .create();

export const lossExpenseReserveDB2Actions = slice.actions;
export const lossExpenseReserveDB2Selectors = slice.selectors;
export const lossExpenseReserveDB2Reducer = slice.rootReducer;