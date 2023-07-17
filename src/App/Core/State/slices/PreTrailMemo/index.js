import {
    SliceBuilder
} from '../SliceBuilder';
import { savePreTrailMemo } from './queries/savePreTrailMemo'
import { getPreTrialMemo } from './queries/getPreTrialMemo'

/** @type {import('./types.d').PreTrailMemoSlice} */
const PreTrailMemoSlice = new SliceBuilder('PreTrailMemo')
    .addThunkFromOperation('get', getPreTrialMemo)
    .addThunkFromOperation('create', savePreTrailMemo)
    .create();


export const PreTrailMemoReducer = PreTrailMemoSlice.rootReducer;
export const PreTrailMemoSelectors = PreTrailMemoSlice.selectors;
export const PreTrailMemoActions = PreTrailMemoSlice.actions;