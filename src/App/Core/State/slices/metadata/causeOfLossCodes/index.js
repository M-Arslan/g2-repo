import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetCauseOfLossCodes
} from './queries/GetCauseOfLossCodes';
import {
    GetCauseOfLossCodesListByG2LE
} from './queries/GetCauseOfLossByG2LE';

/** @type {import('./types.d').CauseOfLossCode} */
const slice = new SliceBuilder('causeOfLossCodes')
    .addThunkFromOperation('get', GetCauseOfLossCodes)
    .create();

const sliceG2LE = new SliceBuilder('causeOfLossCodesByG2LE')
    .addThunkFromOperation('getByG2LE', GetCauseOfLossCodesListByG2LE)
    .create();

export const causeOfLossCodeActions = slice.actions;
export const causeOfLossCodeSelectors = slice.selectors;
export const causeOfLossCodeReducer = slice.rootReducer;


export const causeOfLossCodeByG2LEActions = sliceG2LE.actions;
export const causeOfLossCodeByG2LESelectors = sliceG2LE.selectors;
export const causeOfLossCodeByG2LEReducer = sliceG2LE.rootReducer;