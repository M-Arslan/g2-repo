import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetGenesisMLALossCoding
} from './queries/GetGenesisMLALossCoding';

/** @type {import('./types.d').CompanySlice} */
const slice = new SliceBuilder('GetGenesisMLALossCoding')
    .addThunkFromOperation('get', GetGenesisMLALossCoding)
    .create();

export const genesisMLALossCodingActions = slice.actions;
export const genesisMLALossCodingSelectors = slice.selectors;
export const genesisMLALossCodingReducer = slice.rootReducer;