import {
    configureStore
} from '@reduxjs/toolkit';
import {
    claimReducer, policyAggregateReducer
} from './slices/claim';
import {
    LegalClaimReducer
} from './slices/legal-claim';
import {
    configReducer
} from './slices/config';
import {
    claimStatusTypeReducer
} from './slices/metadata/claim-status-types';
import {
    userReducer
} from './slices/user';
import {
    usersReducer
} from './slices/users';
import {
    createAppStatusReducer
} from './slices/app-status';
import {
    riskStatesReducer
} from './slices/metadata/risk-states';
import {
    claimExaminerReducer,
    claimExaminerAllReducer
} from './slices/metadata/claim-examiners';
import {
    companiesReducer
} from './slices/metadata/companies';
import {
    legalCompaniesReducer
} from './slices/metadata/legal-companies';
import {
    branchesReducer
} from './slices/metadata/branches';
import {
    contactsReducer
} from './slices/contact';
import {
    claimActivityReducer
} from './slices/claim-activity';
import {
    policyCodingReducer
} from './slices/policy-coding';
import {
    financialDB2Reducer,
    conferFinancialDB2Reducer,
    fsriFinancialDB2Reducer

} from './slices/metadata/financial-db2';
import {
    claimDB2Reducer
} from './slices/metadata/claim-db2';
import {
    authorityAmountReducer
} from './slices/metadata/authorityAmount';
import {
    lossExpenseReserveDB2Reducer
} from './slices/metadata/lossExpenseReserve-db2';
import {
    currencyReducer
} from './slices/metadata/currency';
import {
    ULClaimReducer,
    ULClaimsReducer,
    ULClaimDeleteReducer,
    FormOfCoverageReducer
} from './slices/ULClaims';
import {
    associatedPolicyContractReducer,
    associatedPolicyReducer,
    associatedPolicyDeleteReducer
} from './slices/associated-policy-contracts';
import {
    accountingTransCodeReducer
} from './slices/metadata/accountingTransCode';
import {
    causeOfLossCodeReducer
} from './slices/metadata/causeOfLossCodes';
import {
    accountingTransTypeReducer
} from './slices/metadata/accountingTransType';
import {
    mlaThresholdReducer
} from './slices/metadata/mlaThreshold';
import {
    claimDetailFlagTypesReducer
} from './slices/metadata/claimDetailFlagTypes';
import {
    openLineBobCoverageReducer
} from './slices/metadata/openLineBobCoverage';
import {
    genesisMLALossCodingReducer
} from './slices/metadata/genesisMLALossCoding';
//import {
//    CheckExaminerForAdjusterLicenseStateReducer
//} from './slices/metadata/CheckExaminerForAdjusterLicenseState';



import {
    CheckExaminerForAdjusterLicenseStateReducer
} from './slices/metadata/CheckExaminerForAdjusterLicenseState';
import {
    WCReimbursementPriorTPAPaidReducer,
    WCReimbursementPriorTPAPaidSaveReducer,
    WCReimbursementPriorTPAPaidSingleReducer
} from './slices/prior-tpa-paids';
import {
    WCReimbursementAdjustmentsReducer,
    WCReimbursementAdjustmentsSaveReducer,
    WCReimbursementAdjustmentsListReducer,
    WCReimbursementAdjustmentsDeleteReducer
} from './slices/reimbursement-adjustments'
import { litigationReducer } from './slices/litigation';
import { templateTextReducer } from './slices/metadata/template-text';
import { CourtSuitsSliceGetReducer, CourtSuitsSliceSaveReducer } from './slices/courtSuits';
import { supportTypeReducer } from './slices/notification/';
import { taskTypeReducer } from './slices/taskTypes';
import { notificationMessageTypeReducer } from './slices/notification-message-type';
import { PreTrailMemoReducer } from './slices/PreTrailMemo';
import { NotificationCommentsReducer, NotificationCommentsGetReducer } from './slices/notificationComment';
import { appLogsReducer } from './slices/app-logs';
import { NotificationRolesReducer } from './slices/notification-roles';
import { claimSupportTypeReducer } from './slices/claim-support';
import { claimSupportTypeRolesReducer } from './slices/claim-support';
import { professionalClaimCategoryReducer } from './slices/metadata/professionalClaimCategories';
import { legalEntityReducer } from './slices/metadata/legal-entities';
import { lineOfBusinessCodingTypeReducer } from './slices/metadata/lineOfBusinessTypes';
import { riskCodingSpecialFlagTypesReducer } from './slices/metadata/riskCodingSpecialFlagTypes';
import { causeOfLossCodeByG2LEReducer } from './slices/metadata/causeOfLossCodes';
import {
    ClaimantReducer,
    ClaimantListReducer,
    ClaimantSaveReducer,
    ClaimantCIBActivityReducer,
    ClaimantFileCIBReducer,
    ClaimantFlagAsRejectedReducer,
    ClaimantFlagMedicareEligibleReducer,
    ClaimantReportedToCMSReducer,
    ClaimantReportToISOCMSReducer,
    ClaimantReportingToCMSNotRequiredReducers
    
} from './slices/claimant';
import {
    WCReimbursementCalculationReducer, WCReimbursementCalculationSaveReducer
} from './slices/reimbursement-calculation'
import { propertyPolicyReducer } from './slices/property-policy';
import { assocClaimsReducer } from './slices/assoc-claims';
//import { adjusterLicenseStatesReducer } from './slices/metadata/adjusterLicenseStates';
import { WCClaimantReducer, WCClaimantSaveReducer, WCClaimantListReducer} from './slices/wc-claimant'
import { adjusterLicenseStatesReducer } from './slices/metadata/adjusterLicenseStates';
import { WCReimbursementReducer, WCReimbursementSaveReducer, WCReimbursementListReducer, ReimbursementCompanyDollarReducer, ReimbursementCompanyDollarSaveReducer, ReimbursementCompanyDollarListReducer, ReimbursementCompanyDollarDeleteReducer } from './slices/reimbursement'
/**
 * PUT SLICE REDUCERS HERE 
 */
const assembleReducer = () => {
    return {
        ...claimReducer,
        ...userReducer,
        ...configReducer,
        ...claimStatusTypeReducer,
        ...riskStatesReducer,
        ...claimExaminerReducer,
        ...companiesReducer,
        ...legalEntityReducer,
        ...branchesReducer,
        ...contactsReducer,
        ...claimActivityReducer,
        ...policyCodingReducer,
        ...litigationReducer,
        ...assocClaimsReducer,
        ...usersReducer,
        ...financialDB2Reducer,
        ...conferFinancialDB2Reducer,
        ...fsriFinancialDB2Reducer,
        ...claimDB2Reducer,
        ...authorityAmountReducer,
        ...lossExpenseReserveDB2Reducer,
        ...currencyReducer,
        ...accountingTransCodeReducer,
        ...causeOfLossCodeReducer,
        ...accountingTransTypeReducer,
        ...LegalClaimReducer,
        ...legalCompaniesReducer,
        ...ULClaimReducer,
        ...ULClaimsReducer,
        ...ULClaimDeleteReducer,
        ...FormOfCoverageReducer,
        ...templateTextReducer,
        ...associatedPolicyContractReducer,
        ...associatedPolicyReducer,
        ...associatedPolicyDeleteReducer,
        ...CourtSuitsSliceGetReducer,
        ...supportTypeReducer,
        ...PreTrailMemoReducer,
        ...taskTypeReducer,
        ...notificationMessageTypeReducer,
        ...CourtSuitsSliceSaveReducer,
        ...claimDetailFlagTypesReducer,
        ...NotificationCommentsReducer,
        ...NotificationCommentsGetReducer,
        ...claimSupportTypeReducer,
        ...appLogsReducer,
        ...NotificationRolesReducer,
        ...claimSupportTypeRolesReducer,
        ...professionalClaimCategoryReducer,
        ...claimExaminerAllReducer,
        ...lineOfBusinessCodingTypeReducer,
        ...riskCodingSpecialFlagTypesReducer,
        ...ClaimantReducer,
        ...ClaimantListReducer,
        ...ClaimantSaveReducer,
        ...ClaimantCIBActivityReducer,
        ...ClaimantFileCIBReducer,
        ...ClaimantFlagAsRejectedReducer,
        ...ClaimantFlagMedicareEligibleReducer,
        ...ClaimantReportedToCMSReducer,
        ...ClaimantReportToISOCMSReducer,
        ...ClaimantReportingToCMSNotRequiredReducers,
        ...propertyPolicyReducer,
        ...policyAggregateReducer,
        ...openLineBobCoverageReducer,
        ...causeOfLossCodeByG2LEReducer,
        ...genesisMLALossCodingReducer,
        ...adjusterLicenseStatesReducer,
        ...CheckExaminerForAdjusterLicenseStateReducer,
        ...WCClaimantReducer,
        ...WCClaimantSaveReducer,
        ...WCClaimantListReducer,
        ...WCReimbursementReducer,
        ...WCReimbursementSaveReducer,
        ...WCReimbursementListReducer,
        ...ReimbursementCompanyDollarReducer,
        ...ReimbursementCompanyDollarSaveReducer,
        ...ReimbursementCompanyDollarListReducer,
        ...ReimbursementCompanyDollarDeleteReducer,
        ...WCReimbursementPriorTPAPaidReducer,
        ...WCReimbursementPriorTPAPaidSaveReducer,
        ...WCReimbursementPriorTPAPaidSingleReducer,
        ...WCReimbursementAdjustmentsReducer,
        ...WCReimbursementAdjustmentsListReducer,
        ...WCReimbursementAdjustmentsSaveReducer,
        ...WCReimbursementAdjustmentsDeleteReducer,
        ...WCReimbursementCalculationSaveReducer,
        ...WCReimbursementCalculationReducer,
        ...mlaThresholdReducer
    };
}

/** @type {import('@reduxjs/toolkit').Slice<any, any, string>} */
let appStatusSlice = null;

export const initStore = () => {
    const sliceReducers = assembleReducer();
    appStatusSlice = createAppStatusReducer();

    return configureStore({
        reducer: {
            ...sliceReducers,
            appStatus: appStatusSlice.reducer
        }
    });
};

export const clearAppStatus = () => {
    return appStatusSlice.actions.clearStatus();
}

export const selectAppStatus = (state) => {
    return state.appStatus;
}