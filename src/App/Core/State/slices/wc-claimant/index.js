import {
    GetWCClaimantDetail
} from './queries/GetWCClaimantDetail';
import {
    GetWCClaimantList
} from './queries/GetWCClaimantList';
import {
    UpdateWCClaimantDetail
} from './queries/UpdateWCClaimantDetail';
import {
    SliceBuilder
} from '../SliceBuilder';

const slice = new SliceBuilder('wcClaimantDetail')
    .addThunkFromOperation('get', GetWCClaimantDetail)
    .create();

const sliceList = new SliceBuilder('wcClaimantList')
    .addThunkFromOperation('list', GetWCClaimantList)
    .create();

const sliceSave = new SliceBuilder('wcClaimantSave')
    .addThunkFromOperation('save', UpdateWCClaimantDetail)
    .create();

export const WCClaimantReducer = slice.rootReducer;
export const WCClaimantSelectors = slice.selectors;
export const WCClaimantActions = slice.actions;

export const WCClaimantSaveReducer = sliceSave.rootReducer;
export const WCClaimantSaveSelectors = sliceSave.selectors;
export const WCClaimantSaveActions = sliceSave.actions;

export const WCClaimantListReducer = sliceList.rootReducer;
export const WCClaimantListSelectors = sliceList.selectors;
export const WCClaimantListActions = sliceList.actions;