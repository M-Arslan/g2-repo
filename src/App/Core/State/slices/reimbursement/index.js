import {
    GetReimbursementDetail
} from './queries/GetReimbursementDetail';
import {
    GetReimbursementList
} from './queries/GetReimbursementList';
import {
    UpdateReimbursementDetail
} from './queries/UpdateReimbursementDetail';
import {
    GetCompanyDollarDetail
} from './queries/GetCompanyDollarDetail'
import {
    GetCompanyDollarList
} from './queries/GetCompanyDollarList'
import {
    UpdateCompanyDollarDetail
} from './queries/UpdateCompanyDollarDetail'
import {
    DeleteCompanyDollar
} from './queries/DeleteCompanyDollar'
import {
    SliceBuilder
} from '../SliceBuilder';

const slice = new SliceBuilder('wcReimbursementDetail')
    .addThunkFromOperation('get', GetReimbursementDetail)
    .addThunkFromOperation('delete', DeleteCompanyDollar)
    .create();

const deleteSlice = new SliceBuilder('deleteCompanyDollar')
    .addThunkFromOperation('delete', DeleteCompanyDollar)
    .create();

const sliceList = new SliceBuilder('wcReimbursementList')
    .addThunkFromOperation('list', GetReimbursementList)
    .create();

const sliceSave = new SliceBuilder('wcReimbursementSave')
    .addThunkFromOperation('save', UpdateReimbursementDetail)
    .create();

const sliceCompanyDollar = new SliceBuilder('reimbursementCompanyDollarDetail')
    .addThunkFromOperation('get', GetCompanyDollarDetail)
    .create();

const sliceCompanyDollarList = new SliceBuilder('reimbursementCompanyDollarList')
    .addThunkFromOperation('list', GetCompanyDollarList)
    .create();

const sliceCompanyDollarSave = new SliceBuilder('reimbursementCompanyDollarSave')
    .addThunkFromOperation('save', UpdateCompanyDollarDetail)
    .create();

export const WCReimbursementReducer = slice.rootReducer;
export const WCReimbursementtSelectors = slice.selectors;
export const WCReimbursementActions = slice.actions;

export const WCReimbursementSaveReducer = sliceSave.rootReducer;
export const WCReimbursementSaveSelectors = sliceSave.selectors;
export const WCReimbursementSaveActions = sliceSave.actions;

export const WCReimbursementListReducer = sliceList.rootReducer;
export const WCReimbursementListSelectors = sliceList.selectors;
export const WCReimbursementListActions = sliceList.actions;

export const ReimbursementCompanyDollarReducer = sliceCompanyDollar.rootReducer;
export const ReimbursementCompanyDollarSelectors = sliceCompanyDollar.selectors;
export const ReimbursementCompanyDollarActions = sliceCompanyDollar.actions;

export const ReimbursementCompanyDollarDeleteReducer = deleteSlice.rootReducer;
export const ReimbursementCompanyDollarDeleteSelectors = deleteSlice.selectors;
export const ReimbursementCompanyDollarDeleteActions = deleteSlice.actions;

export const ReimbursementCompanyDollarSaveReducer = sliceCompanyDollarSave.rootReducer;
export const ReimbursementCompanyDollarSaveSelectors = sliceCompanyDollarSave.selectors;
export const ReimbursementCompanyDollarSaveActions = sliceCompanyDollarSave.actions;

export const ReimbursementCompanyDollarListReducer = sliceCompanyDollarList.rootReducer;
export const ReimbursementCompanyDollarListSelectors = sliceCompanyDollarList.selectors;
export const ReimbursementCompanyDollarListActions = sliceCompanyDollarList.actions;