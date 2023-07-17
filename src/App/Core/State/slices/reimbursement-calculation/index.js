import {
    GetCalculationDetail
} from './queries/GetCalculationDetail';
import {
    SaveCalculationDetail
} from './queries/SaveCalculationDetail';

import {
    SliceBuilder
} from '../SliceBuilder';

const slice = new SliceBuilder('wcReimbursementCalculationDetail')
    .addThunkFromOperation('list', GetCalculationDetail)
    .create();

const sliceSave = new SliceBuilder('wcReimbursementCalculationSave')
    .addThunkFromOperation('save', SaveCalculationDetail)
    .create();


export const WCReimbursementCalculationReducer = slice.rootReducer;
export const WCReimbursementtCalculationSelectors = slice.selectors;
export const WCReimbursementCalculationActions = slice.actions;

export const WCReimbursementCalculationSaveReducer = sliceSave.rootReducer;
export const WCReimbursementCalculationSaveSelectors = sliceSave.selectors;
export const WCReimbursementCalculationSaveActions = sliceSave.actions;
