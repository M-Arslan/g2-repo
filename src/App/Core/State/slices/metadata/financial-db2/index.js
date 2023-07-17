import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetFinancialDB2
} from './queries/GetFinancialDB2';
import {
    GetFsriFinancialDB2
} from './queries/GetFsriFinancialDB2';
import {
    GetConferFinancialDB2
} from './queries/GetConferFinancialDB2';

/** @type {import('./types.d').FinancialDB2Slice} */
const slice = new SliceBuilder('financialDB2')
    .addThunkFromOperation('get', GetFinancialDB2)
    .create();

export const financialDB2Actions = slice.actions;
export const financialDB2Selectors = slice.selectors;
export const financialDB2Reducer = slice.rootReducer;

const sliceFsriFinancialDB2 = new SliceBuilder('fsriFinancialDB2')
    .addThunkFromOperation('get', GetFsriFinancialDB2)
    .create();

export const fsriFinancialDB2Actions = sliceFsriFinancialDB2.actions;
export const fsriFinancialDB2Selectors = sliceFsriFinancialDB2.selectors;
export const fsriFinancialDB2Reducer = sliceFsriFinancialDB2.rootReducer;


const sliceConferFinancialDB2 = new SliceBuilder('conferFinancialDB2')
    .addThunkFromOperation('get', GetConferFinancialDB2)
    .create();

export const conferFinancialDB2Actions = sliceConferFinancialDB2.actions;
export const conferFinancialDB2Selectors = sliceConferFinancialDB2.selectors;
export const conferFinancialDB2Reducer = sliceConferFinancialDB2.rootReducer;