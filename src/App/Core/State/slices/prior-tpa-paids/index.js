import {
    GetPriorTPAPaidDetail
} from './queries/GetPriorTPAPaidDetail';
import {
    UpdatePriorTPAPaidDetail
} from './queries/UpdatePriorTPAPaidDetail';
import {
    GetSinglePriorTPAPaid
} from './queries/GetSinglePriorTPAPaid'
import {
    SliceBuilder
} from '../SliceBuilder';

const slice = new SliceBuilder('wcReimbursementPriorTPAPaidDetail')
    .addThunkFromOperation('get', GetPriorTPAPaidDetail)
    .create();

const sliceSave = new SliceBuilder('wcReimbursementPriorTPAPaidSave')
    .addThunkFromOperation('save', UpdatePriorTPAPaidDetail)
    .create();

const sliceSingle = new SliceBuilder('wcReimbursementPriorTPAPaidSingle')
    .addThunkFromOperation('list', GetSinglePriorTPAPaid)
    .create();

export const WCReimbursementPriorTPAPaidReducer = slice.rootReducer;
export const WCReimbursementtPriorTPAPaidSelectors = slice.selectors;
export const WCReimbursementPriorTPAPaidActions = slice.actions;

export const WCReimbursementPriorTPAPaidSaveReducer = sliceSave.rootReducer;
export const WCReimbursementPriorTPAPaidSaveSelectors = sliceSave.selectors;
export const WCReimbursementPriorTPAPaidSaveActions = sliceSave.actions;

export const WCReimbursementPriorTPAPaidSingleReducer = sliceSingle.rootReducer;
export const WCReimbursementPriorTPAPaidSingleSelectors = sliceSingle.selectors;
export const WCReimbursementPriorTPAPaidSingleActions = sliceSingle.actions;