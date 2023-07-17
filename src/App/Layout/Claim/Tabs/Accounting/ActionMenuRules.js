import { ACCOUNTING_TRANS_TYPES } from '../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_STATUS_TYPE } from '../../../../Core/Enumerations/app/claim-status-type';
import { CLAIM_TYPES } from '../../../../Core/Enumerations/app/claim-type';
import { LEGAL_ENTITY } from '../../../../Core/Enumerations/app/legal-entity';
import { STATUTORY_SYSTEM } from '../../../../Core/Enumerations/app/statutory-system';


export const ShowCreateClaimActivityMenu = (request) => {
    return !request.currentClaimActivity;
}
export const ShowRequestDeductibleCollectionMenu = (request) => {
    return !request.currentClaimActivity && request.claim.claimType !== CLAIM_TYPES.WORKERS_COMP;
}
export const ShowRequestInitialRINoticebesentMenu = (request) => {
    return !request.currentClaimActivity && request.claim.claimType !== CLAIM_TYPES.WORKERS_COMP;
}
export const ShowCheckFacDatabaseforRIMenu = (request) => {
    return !request.currentClaimActivity && request.claim.claimType !== CLAIM_TYPES.WORKERS_COMP;
}
export const ShowManuallyAddVendorMenu = (request) => {
    return false &&
        request.currentClaimActivity &&
        request.selectedMenu === "VENDORDETAILS" &&
        request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT &&
        request.currentClaimActivity.claimStatusTypeID !== CLAIM_STATUS_TYPE.NEW_PI_2 &&
        request.currentClaimActivity.claimStatusTypeID !== CLAIM_STATUS_TYPE.PENDING_APPROVAL &&
        ((request.currentClaimActivity.payments || {}).paymentVendors || []).length === 0;
}
export const ShowSearchVendorMenu = (request) => {
    return request.currentClaimActivity &&
        request.selectedMenu === "VENDORDETAILS" &&
        request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT &&
        !(request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT && request.claim.g2LegalEntityID !== LEGAL_ENTITY.GENERAL_STAR ) &&
        request.currentClaimActivity.claimStatusTypeID !== CLAIM_STATUS_TYPE.NEW_PI_2 &&
        request.currentClaimActivity.claimStatusTypeID !== CLAIM_STATUS_TYPE.PENDING_APPROVAL &&
        request.currentClaimActivity.claimStatusTypeID !== CLAIM_STATUS_TYPE.ALREADY_PAID &&
        ((request.currentClaimActivity.payments || {}).paymentVendors || []).length === 0;
}
export const ShowProcessingInProgressMenu = (request) => {
    return request.currentClaimActivity && request.currentClaimActivity.activityID
        && (request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.ERROR_PI_2 || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.PENDING_BOT_PROCESSING)
        //&& !([ACCOUNTING_TRANS_TYPES.OPEN, ACCOUNTING_TRANS_TYPES.RESERVE, ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT, ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE, ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE, ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT, ACCOUNTING_TRANS_TYPES.WC_RESERVE].includes(request.currentClaimActivity.accountingTransTypeID) && request.claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && request.claim.claimType !== CLAIM_TYPES.LEGAL)
        && request.isClaimAccountant;
}
export const ShowAuthorityCheckMenu = (request) => {    
    return request.currentClaimActivity && request.currentClaimActivity.activityID
        && (request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED_TO_ACCOUNTANT_AUTHORITY_CHECK)
        && (([ACCOUNTING_TRANS_TYPES.OPEN, ACCOUNTING_TRANS_TYPES.RESERVE, ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT, ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE, ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE, ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT, ACCOUNTING_TRANS_TYPES.WC_RESERVE].includes(request.currentClaimActivity.accountingTransTypeID)) || ([ACCOUNTING_TRANS_TYPES.CLOSE].includes(request.currentClaimActivity.accountingTransTypeID) && request.claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE))
        && (request.claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE)
        && request.claim.claimType !== CLAIM_TYPES.LEGAL
        && request.isClaimAccountant;
}
export const ShowProcessingCompleteMenu = (request) => {
    return request.currentClaimActivity
        && request.currentClaimActivity.activityID
        && (request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.ERROR_PI_2 || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.PENDING_BOT_PROCESSING || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.PROCESSING_IN_PROGRESS || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.REINSURANCE_PROCESSING_REQUIRED)
        //&& !(([ACCOUNTING_TRANS_TYPES.OPEN, ACCOUNTING_TRANS_TYPES.RESERVE, ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT, ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE, ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE, ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT, ACCOUNTING_TRANS_TYPES.WC_RESERVE].includes(request.currentClaimActivity.accountingTransTypeID)) && request.claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && request.claim.claimType !== CLAIM_TYPES.LEGAL && request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED )
        && request.isClaimAccountant;
}
export const ShowReinsuranceProcessingRequiredMenu = (request) => {
    return request.currentClaimActivity
        && request.currentClaimActivity.activityID
        && (request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.PENDING_BOT_PROCESSING || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.PROCESSING_IN_PROGRESS)
        //&& !(([ACCOUNTING_TRANS_TYPES.OPEN, ACCOUNTING_TRANS_TYPES.RESERVE, ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT, ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE, ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE, ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT, ACCOUNTING_TRANS_TYPES.WC_RESERVE].includes(request.currentClaimActivity.accountingTransTypeID)) && request.claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && request.claim.claimType !== CLAIM_TYPES.LEGAL && request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED )
        && request.isClaimAccountant;
}
export const ShowFlagAsIssueMenu = (request) => {
    return request.currentClaimActivity
        && request.currentClaimActivity.activityID
        && (request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.PENDING_BOT_PROCESSING || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.PROCESSING_IN_PROGRESS)
        //&& !(([ACCOUNTING_TRANS_TYPES.OPEN, ACCOUNTING_TRANS_TYPES.RESERVE, ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT, ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE, ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE, ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT, ACCOUNTING_TRANS_TYPES.WC_RESERVE].includes(request.currentClaimActivity.accountingTransTypeID)) && request.claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && request.claim.claimType !== CLAIM_TYPES.LEGAL && request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED )
        && request.isClaimAccountant;
}
export const ShowRejectedMenu = (request) => {
    return request.currentClaimActivity
        && request.currentClaimActivity.activityID
        && (request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.PENDING_BOT_PROCESSING || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.PROCESSING_IN_PROGRESS)
        //&& !(([ACCOUNTING_TRANS_TYPES.OPEN, ACCOUNTING_TRANS_TYPES.RESERVE, ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT, ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE, ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE, ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT, ACCOUNTING_TRANS_TYPES.WC_RESERVE].includes(request.currentClaimActivity.accountingTransTypeID)) && request.claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && request.claim.claimType !== CLAIM_TYPES.LEGAL && request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED)
        && request.isClaimAccountant;
}
export const ShowErrorMenu = (request) => {
    return false
        && request.currentClaimActivity
        && request.currentClaimActivity.activityID
        && (request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.IN_PROGRESS_PI_2)
        && request.isClaimAccountant;
}
export const ShowApproveMenu = (request, currentUser) => {
    return request.currentClaimActivity
        && request.currentClaimActivity?.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.GENESIS_MLA
        && request.currentClaimActivity.activityID
        && request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.PENDING_APPROVAL
        && (request.currentClaimActivity.taskOwner || "").toLowerCase() === currentUser.id.toLowerCase();
}
export const ShowRejectMenu = (request, currentUser) => {
    return request.currentClaimActivity        
        && (![ACCOUNTING_TRANS_TYPES.GENESIS_MLA, ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE, ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE, ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT, ACCOUNTING_TRANS_TYPES.WC_RESERVE].includes(request.currentClaimActivity?.accountingTransTypeID))
        && request.currentClaimActivity.activityID
        && request.claim.claimType !== CLAIM_TYPES.WORKERS_COMP
        && request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.PENDING_APPROVAL
        && (request.currentClaimActivity.taskOwner || "").toLowerCase() === currentUser.id.toLowerCase();
}
export const ShowCompletedMenu = (request) => {
    return request.currentClaimActivity
        && request.currentClaimActivity.activityID
        && request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.QA_PENDING;
}
export const ShowSetStatustoInprogressMenu = (request) => {
    return request.currentClaimActivity
        && request.currentClaimActivity.activityID
        && request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.NEW_PI_2
        && request.isExpenseAdmin
        && request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT;
}
export const ShowCheckforpriorpaymentMenu = (request) => {
    return request.currentClaimActivity
        && request.currentClaimActivity.activityID
        &&
        (
            (request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.IN_PROGRESS_PI_2
                &&
                (
                    request.isExpenseAdmin
                    || request.isClaimAccountant
                )
            )
            ||
            (request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.VENDOR_SETUP_COMPLETE
                &&
                (
                    request.isExpenseAdmin
                    || request.isClaimAccountant
                )
            )
        )
        && request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT;
}
export const ShowSubmittoCEforApprovalMenu = (request) => {
    return request.currentClaimActivity
        && request.currentClaimActivity.activityID
        &&
        (
            (request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.IN_PROGRESS_PI_2
                &&
                (
                    request.isExpenseAdmin
                    || request.isClaimAccountant
                )
            )
            ||
            (request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.VENDOR_SETUP_COMPLETE
                &&
                (
                    request.isExpenseAdmin
                    || request.isClaimAccountant
                )
            )
        )
        && request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT;
}
export const ShowRequestVendorsetupMenu = (request) => {
    return request.currentClaimActivity
        && request.currentClaimActivity.activityID
        &&
        (
            (request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.IN_PROGRESS_PI_2
                &&
                (
                    request.isExpenseAdmin
                    || request.isClaimAccountant
                )
            )
            ||
            (request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.VENDOR_SETUP_COMPLETE
                &&
                (
                    request.isExpenseAdmin
                    || request.isClaimAccountant
                )
            )
        )
        && request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT;
}
export const ShowSetStatustoVendorsetupcompletedMenu = (request) => {
    return request.currentClaimActivity
        && request.currentClaimActivity.activityID
        && request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.REQUEST_VENDOR_SETUP
        && request.isClaimAccountant
        && request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT;
}
export const ShowSetStatustoAlreadyPaidMenu = (request) => {
    return request.currentClaimActivity
        && request.currentClaimActivity.activityID
        &&
        (
            (request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.IN_PROGRESS_PI_2
                &&
                (
                    request.isExpenseAdmin
                    || request.isClaimAccountant
                )
            )
            ||
            (
                request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.REQUEST_VENDOR_SETUP
                && request.isClaimAccountant
            )
            ||
            (request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.VENDOR_SETUP_COMPLETE
                &&
                (
                    request.isExpenseAdmin
                    || request.isClaimAccountant
                )
            )
        )
        && request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT;
}
export const ShowSubmitMenu = (request) => {
    return request.currentClaimActivity
        && request.currentClaimActivity?.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.GENESIS_MLA
        && (
            !request.currentClaimActivity.activityID
            ||
            (
            request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.NEW_PI_2
                && request.isExpenseAdmin
            )
            || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE
            || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.VENDOR_SETUP_COMPLETE
            || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMIT_TO_CE_FOR_APPROVAL
            || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.DRAFT
        );
}

export const ShowSaveAsDraft = (request) => {
    return request.currentClaimActivity?.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.GENESIS_MLA
        && ([
        CLAIM_STATUS_TYPE.NEW_PI_2,
            CLAIM_STATUS_TYPE.DRAFT
        ].includes(request.currentClaimActivity?.claimStatusTypeID) && request.isClaimExaminer);
}
export const ShowSave = (request, currentUser) => {
    return request.currentClaimActivity?.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.GENESIS_MLA
        && ([
            CLAIM_STATUS_TYPE.PENDING_APPROVAL
           ].includes(request.currentClaimActivity?.claimStatusTypeID) && (currentUser?.id === request?.currentClaimActivity?.taskOwner));
}

export const ShowSubmitForApproval = (request) => {
    return [
        CLAIM_STATUS_TYPE.NEW_PI_2,
            CLAIM_STATUS_TYPE.DRAFT
        ].includes(request.currentClaimActivity?.claimStatusTypeID) && request.currentClaimActivity?.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.GENESIS_MLA && request.isClaimExaminer;
}

export const ShowSupressMLA = (request, currentUser) => {
    return request.currentClaimActivity?.claimStatusTypeID === CLAIM_STATUS_TYPE.PENDING_APPROVAL
        && request.currentClaimActivity?.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.GENESIS_MLA
        && (request.currentClaimActivity.taskOwner || "").toLowerCase() === currentUser?.id.toLowerCase();
    
}

export const ShowApproveMLA = (request, currentUser) => {
    //return true;
    return request.currentClaimActivity?.claimStatusTypeID === CLAIM_STATUS_TYPE.PENDING_APPROVAL
        && request.currentClaimActivity?.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.GENESIS_MLA
        && (request.currentClaimActivity.taskOwner || "").toLowerCase() === currentUser?.id.toLowerCase();

}

export const ShowVoidMenu = (request) => {
    return request.currentClaimActivity
        && request.currentClaimActivity.activityID
        && (
            (
                (
                request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.NEW_PI_2
                    && request.currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.GENESIS_MLA
                    && request.isExpenseAdmin
                )
                ||
                (
                    request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.IN_PROGRESS_PI_2
                    &&
                    (
                        request.isExpenseAdmin
                        || request.isClaimAccountant
                    )
                )
                || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED
                || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED_TO_ACCOUNTANT_AUTHORITY_CHECK
                || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.ERROR_PI_2
                || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE
                ||
                (
                    request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.REQUEST_VENDOR_SETUP
                    && request.isClaimAccountant
                )
                || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.VENDOR_SETUP_COMPLETE
                || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.PENDING_BOT_PROCESSING
                || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMIT_TO_CE_FOR_APPROVAL
                || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.PROCESSING_IN_PROGRESS
                || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.REINSURANCE_PROCESSING_REQUIRED
                || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.DRAFT
            )
            ||
            (
                request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED &&
                (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.INITIAL_RI_NOTICE
                    || request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.DEDUCTIBLE_COLLECTION)
            )
            || (
                request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.FILE_CIB
                && request.isClaimAccountant
            )
            || (
                [
                CLAIM_STATUS_TYPE.NEW_PI_2,
                    CLAIM_STATUS_TYPE.DRAFT
                ].includes(request.currentClaimActivity?.claimStatusTypeID) && request.currentClaimActivity?.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.GENESIS_MLA && request.isClaimExaminer
            )
        );
}
export const ShowActionMenu = (request, currentUser) => {
    return ShowCreateClaimActivityMenu(request)
        || ShowRequestDeductibleCollectionMenu(request)
        || ShowRequestInitialRINoticebesentMenu(request)
        || ShowCheckFacDatabaseforRIMenu(request)
        || ShowManuallyAddVendorMenu(request)
        || ShowSearchVendorMenu(request)
        || ShowProcessingInProgressMenu(request)
        || ShowProcessingCompleteMenu(request)
        || ShowReinsuranceProcessingRequiredMenu(request)
        || ShowFlagAsIssueMenu(request)
        || ShowRejectedMenu(request)
        || ShowErrorMenu(request)
        || ShowApproveMenu(request, currentUser)
        || ShowRejectMenu(request, currentUser)
        || ShowCompletedMenu(request)
        || ShowSetStatustoInprogressMenu(request)
        || ShowCheckforpriorpaymentMenu(request)
        || ShowSubmittoCEforApprovalMenu(request)
        || ShowRequestVendorsetupMenu(request)
        || ShowSetStatustoVendorsetupcompletedMenu(request)
        || ShowSetStatustoAlreadyPaidMenu(request)
        || ShowSubmitMenu(request)
        || ShowVoidMenu(request)
        || ShowSaveAsDraft(request)
        || ShowSubmitForApproval(request)
        || ShowApproveMLA(request, currentUser)
        || ShowSupressMLA(request, currentUser)
        || ShowSave(request, currentUser)
        || ShowAuthorityCheckMenu(request);
}