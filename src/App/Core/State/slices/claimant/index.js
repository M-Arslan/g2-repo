import {
    SliceBuilder
} from '../SliceBuilder';
import {
    GetClaimantDetail
} from './queries/GetClaimantDetail';
import {
    UpdateClaimantDetail
} from './queries/UpdateClaimantDetail';
import {
    GetClaimantList
} from './queries/GetClaimantList';
import {
    SaveClaimantCIBActivity
} from './queries/SaveClaimantCIBActivity';
import {
    SaveFileCIB
} from './queries/SaveFileCIB';
import {
    SaveFlagAsRejected
} from './queries/SaveFlagAsRejected';
import {
    SaveFlagMedicareEligible
} from './queries/SaveFlagMedicareEligible';
import {
    SaveReportedToCMS
} from './queries/SaveReportedToCMS';
import {
    SaveReportToISO
} from './queries/SaveReportToISO';

import {
    SaveReportingToCMSNotRequired
} from './queries/SaveReportingToCMSNotRequired';


/** @type {import('./types.d').LegalClaimSlice} */
const slice = new SliceBuilder('claimantDetail')
    .addThunkFromOperation('get', GetClaimantDetail)
    .create();

const sliceList = new SliceBuilder('claimantList')
    .addThunkFromOperation('list', GetClaimantList)
    .create();

const sliceSave = new SliceBuilder('claimantSave')
    .addThunkFromOperation('save', UpdateClaimantDetail)
    .create();

const sliceSaveClaimantCIBActivity = new SliceBuilder('saveClaimantCIBActivity')
    .addThunkFromOperation('save', SaveClaimantCIBActivity)
    .create();

const sliceSaveFileCIB = new SliceBuilder('saveFileCIB')
    .addThunkFromOperation('save', SaveFileCIB)
    .create();

const sliceSaveFlagAsRejected = new SliceBuilder('saveFlagAsRejected')
    .addThunkFromOperation('save', SaveFlagAsRejected)
    .create();

const sliceSaveFlagMedicareEligible = new SliceBuilder('saveFlagMedicareEligible')
    .addThunkFromOperation('save', SaveFlagMedicareEligible)
    .create();

const sliceSaveReportedToCMS = new SliceBuilder('saveReportedToCMS')
    .addThunkFromOperation('save', SaveReportedToCMS)
    .create();

const sliceSaveReportToISO = new SliceBuilder('saveReportToISO')
    .addThunkFromOperation('save', SaveReportToISO)
    .create();

const sliceSaveReportingToCMSNotRequired = new SliceBuilder('saveReportingToCMSNotRequired')
    .addThunkFromOperation('save', SaveReportingToCMSNotRequired)
    .create();






export const ClaimantReducer = slice.rootReducer;
export const ClaimantSelectors = slice.selectors;
export const ClaimantActions = slice.actions;

export const ClaimantSaveReducer = sliceSave.rootReducer;
export const ClaimantSaveSelectors = sliceSave.selectors;
export const ClaimantSaveActions = sliceSave.actions;

export const ClaimantListReducer = sliceList.rootReducer;
export const ClaimantListSelectors = sliceList.selectors;
export const ClaimantListActions = sliceList.actions;

export const ClaimantCIBActivityReducer = sliceSaveClaimantCIBActivity.rootReducer;
export const ClaimantCIBActivitySelectors = sliceSaveClaimantCIBActivity.selectors;
export const ClaimantCIBActivityActions = sliceSaveClaimantCIBActivity.actions;

export const ClaimantFileCIBReducer = sliceSaveFileCIB.rootReducer;
export const ClaimantFileCIBSelectors = sliceSaveFileCIB.selectors;
export const ClaimantFileCIBActions = sliceSaveFileCIB.actions;

export const ClaimantFlagAsRejectedReducer = sliceSaveFlagAsRejected.rootReducer;
export const ClaimantFlagAsRejectedSelectors = sliceSaveFlagAsRejected.selectors;
export const ClaimantFlagAsRejectedActions = sliceSaveFlagAsRejected.actions;

export const ClaimantFlagMedicareEligibleReducer = sliceSaveFlagMedicareEligible.rootReducer;
export const ClaimantFlagMedicareEligibleSelectors = sliceSaveFlagMedicareEligible.selectors;
export const ClaimantFlagMedicareEligibleActions = sliceSaveFlagMedicareEligible.actions;

export const ClaimantReportedToCMSReducer = sliceSaveReportedToCMS.rootReducer;
export const ClaimantReportedToCMSSelectors = sliceSaveReportedToCMS.selectors;
export const ClaimantReportedToCMSActions = sliceSaveReportedToCMS.actions;

export const ClaimantReportToISOCMSReducer = sliceSaveReportToISO.rootReducer;
export const ClaimantReportToISOSelectors = sliceSaveReportToISO.selectors;
export const ClaimantReportToISOActions = sliceSaveReportToISO.actions;


export const ClaimantReportingToCMSNotRequiredReducers = sliceSaveReportingToCMSNotRequired.rootReducer;
export const ClaimantReportingToCMSNotRequiredSelectors = sliceSaveReportingToCMSNotRequired.selectors;
export const ClaimantReportingToCMSNotRequiredActions = sliceSaveReportingToCMSNotRequired.actions;
