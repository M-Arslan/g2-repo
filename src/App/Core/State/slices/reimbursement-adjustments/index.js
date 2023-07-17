import {
    GetAdjustmentsDetail
} from './queries/GetAdjustmentsDetail';
import {
    UpdateAdjustmentsDetail
} from './queries/UpdateAdjustmentsDetail';
import {
    GetAdjustmentsList
} from './queries/GetAdjustmentsList'
import {
    DeleteAdjustments
} from './queries/DeleteAdjustments'
import {
    SliceBuilder
} from '../SliceBuilder';

const slice = new SliceBuilder('wcReimbursementAdjustmentsDetail')
    .addThunkFromOperation('get', GetAdjustmentsDetail)
    .create();

const sliceSave = new SliceBuilder('wcReimbursementAdjustmentsSave')
    .addThunkFromOperation('save', UpdateAdjustmentsDetail)
    .create();

const sliceList = new SliceBuilder('wcReimbursementAdjustmentsList')
    .addThunkFromOperation('list', GetAdjustmentsList)
    .create();

const deleteSlice = new SliceBuilder('deleteAdjustments')
    .addThunkFromOperation('delete', DeleteAdjustments)
    .create();

export const WCReimbursementAdjustmentsReducer = slice.rootReducer;
export const WCReimbursementtAdjustmentsSelectors = slice.selectors;
export const WCReimbursementAdjustmentsActions = slice.actions;

export const WCReimbursementAdjustmentsSaveReducer = sliceSave.rootReducer;
export const WCReimbursementAdjustmentsSaveSelectors = sliceSave.selectors;
export const WCReimbursementAdjustmentsSaveActions = sliceSave.actions;

export const WCReimbursementAdjustmentsListReducer = sliceList.rootReducer;
export const WCReimbursementAdjustmentsListSelectors = sliceList.selectors;
export const WCReimbursementAdjustmentsListActions = sliceList.actions;

export const WCReimbursementAdjustmentsDeleteReducer = deleteSlice.rootReducer;
export const WCReimbursementAdjustmentsDeleteSelectors = deleteSlice.selectors;
export const WCReimbursementAdjustmentsDeleteActions = deleteSlice.actions;