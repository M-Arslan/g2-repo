import { CLAIM_TYPES } from "../../../../../Core/Enumerations/app/claim-type";
import { LEGAL_ENTITY } from "../../../../../Core/Enumerations/app/legal-entity";
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type';

export const validateFinancial = async (triggerValidation) => {
    let isClaimantValid = true;


    return isClaimantValid;
}

export const validateActivity = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("accountingTransTypeID");
    if (!result)
        isActivityValid = result;

    return isActivityValid;
}

export const validateWCTabularUpdateActivity = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("companyFinancialDate");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyIndemnityPaid");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyIndemnityReserves");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyMedicalPaid");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyMedicalReserves");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyExpensePaid");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyExpenseReserves");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companySubroSIF");
    if (!result)
        isActivityValid = result;

    return isActivityValid;
}

export const validateWCTabularUpdateActivityForCheckAuthority = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("cededIndemnityPaid");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("cededIndemnityReserves");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("cededExpensePaid");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("cededExpenseReserves");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("cededACR");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("cededAER");
    if (!result)
        isActivityValid = result;

    return isActivityValid;
}

export const validateOpenActivity = async (claim, triggerValidation) => {
    let isActivityValid = true, result = true;
    if (claim.g2LegalEntityID !== LEGAL_ENTITY.GENERAL_STAR) {
        result = await triggerValidation("boBCoverageID");
        if (!result)
            isActivityValid = result;

    }
    if (claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE) {

        result = await triggerValidation("causeOfLossCode");
        if (!result)
            isActivityValid = result;
        if (claim.claimType === CLAIM_TYPES.CASUALTY) {
            result = await triggerValidation("typeOfLoss");
            if (!result)
                isActivityValid = result;
        }
        result = await triggerValidation("injuriesOrDamages");
        if (!result)
            isActivityValid = result;
        result = await triggerValidation("descriptionOfOccurence");
        if (!result)
            isActivityValid = result;

        result = await triggerValidation("examinerDiaryDate");
        if (!result)
            isActivityValid = result;

        result = await triggerValidation("supervisorUserID");
        if (!result)
            isActivityValid = result;

    }

    return isActivityValid;
}
export const validateReserveChangeActivity = async (claim, triggerValidation, reserve) => {
    let isActivityValid = true, result = true;

    if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE) {
        result = (reserve.companyLossReserves === 0 || await triggerValidation("companyLossReserves"));       
        if (!result)
            isActivityValid = result;
        result = (reserve.companyExpenseReserve === 0 || await triggerValidation("companyExpenseReserve"));        
        if (!result)
            isActivityValid = result;
        result = await triggerValidation("acr");
        if (!result)
            isActivityValid = result;
        result = await triggerValidation("aer");
        if (!result)
            isActivityValid = result;
    }
    else
    {
        result =  await triggerValidation("endingLossReserve");        
        if (!result)
            isActivityValid = result;

        result = await triggerValidation("endingExpenseReserve");
        if (!result)
            isActivityValid = result;

        if (claim.claimType === CLAIM_TYPES.CASUALTY) {
            result = await triggerValidation("endingMedPayReserve");
            if (!result)
                isActivityValid = result;
        }

        if (claim.claimType === CLAIM_TYPES.LEGAL) {
            result = await triggerValidation("currentLossReserve");
            if (!result)
                isActivityValid = result;
        }
        if (claim.claimType === CLAIM_TYPES.LEGAL) {
            result = await triggerValidation("currentExpenseReserve");
            if (!result)
                isActivityValid = result;
        }
    }

    return isActivityValid;
}
export const validateOpenActivityForType1 = async (claim,triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("lossReserveTotal");
    if (!result)
        isActivityValid = result;
    result = await triggerValidation("expenseReserveTotal");

    if (claim.claimType !== CLAIM_TYPES.PROPERTY && claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_INSURANCE) {
        if (!result)
            isActivityValid = result;
        result = await triggerValidation("medPayReserveTotal");
    }
    return isActivityValid;
}
export const validateOpenActivityForLegalEntity3 = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("cededPaidLoss");
    if (!result)
        isActivityValid = result
    result = await triggerValidation("cededLossReserves");
    if (!result)
        isActivityValid = result
    result = await triggerValidation("cededPaidExpense");
    if (!result)
        isActivityValid = result
    result = await triggerValidation("cededExpenseReserve");
    if (!result)
        isActivityValid = result;
    //result = await triggerValidation("acr");
    //if (!result)
    //    isActivityValid = result;
    //result = await triggerValidation("aer");
    //if (!result)
    //    isActivityValid = result;

    return isActivityValid;
}

export const validateReserveChangeActivityForLegalEntity3 = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("cededLossReserves");
    if (!result)
        isActivityValid = result
    result = await triggerValidation("cededExpenseReserve");
    if (!result)
        isActivityValid = result;    
    

    return isActivityValid;
}

export const validateCloseActivity = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("cededPaidLoss");
    if (!result)
        isActivityValid = result
    result = await triggerValidation("cededLossReserves");
    if (!result)
        isActivityValid = result;
    result = await triggerValidation("cededPaidExpense");
    if (!result)
        isActivityValid = result;
    result = await triggerValidation("cededExpenseReserve");
    if (!result)
        isActivityValid = result;
    result = await triggerValidation("acr");
    if (!result)
        isActivityValid = result;
    result = await triggerValidation("aer");
    if (!result)
        isActivityValid = result;


    return isActivityValid;
}

export const validateGenesisPaymentActivity = async (triggerValidation) => {
    let isActivityValid = true, result = true;
    result = await triggerValidation("cededPaidLoss");
    if (!result)
        isActivityValid = result
    result = await triggerValidation("cededLossReserves");
    if (!result)
        isActivityValid = result
    result = await triggerValidation("cededPaidExpense");
    if (!result)
        isActivityValid = result
    result = await triggerValidation("cededExpenseReserve");
    if (!result)
        isActivityValid = result;
    

    return isActivityValid;
}

export const validateWCPaymentReserveActivityForCheckAuthority = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("cededPaidLoss");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("cededLossReserves");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("cededPaidExpense");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("cededExpenseReserve");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("acr");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("aer");
    if (!result)
        isActivityValid = result;

    return isActivityValid;
}

export const validateWCExpenseOnlyPaymentActivityForCheckAuthority = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("cededPaidExpense");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("cededExpenseReserve");
    if (!result)
        isActivityValid = result;
    return isActivityValid;
}


export const validateOpenActivityForCE_LegalEntity3 = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("companyPaidLoss");
    if (!result)
        isActivityValid = result
    result = await triggerValidation("companyLossReserves");
    if (!result)
        isActivityValid = result
    result = await triggerValidation("companyPaidExpense");
    if (!result)
        isActivityValid = result
    result = await triggerValidation("companyExpenseReserve");
    if (!result)
        isActivityValid = result;
    result = await triggerValidation("boBCoverageID");
    if (!result)
        isActivityValid = result;

    return isActivityValid;
}

export const validateMLASuppressionActivity = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("mLASuppressionReasonTypeID");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("additionalDetail");
    if (!result)
        isActivityValid = result;

    return isActivityValid;
}
export const validateSpecialInstructionsActivity = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    return isActivityValid;
}
export const validateReopenActivity = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("endingLossReserve");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("endingExpenseReserve");
    if (!result)
        isActivityValid = result;

    return isActivityValid;
}
export const validatePaymentClaimActivity = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    return isActivityValid;
}
export const validatePaymentVendor = async (triggerValidation,request) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("payeeName");
    if (!result)
        isActivityValid = result;
    result = await triggerValidation("paymentAmount");
    if (!result)
        isActivityValid = result;
    result = await triggerValidation("payeeAddressStreet1");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("payeeAddressCity");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("payeeAddressState");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("payeeAddressZIP");
    if (!result)
        isActivityValid = result;
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT) {

        result = await triggerValidation("taxID");
        if (!result)
            isActivityValid = result;

        result = await triggerValidation("invoiceNumber");
        if (!result)
            isActivityValid = result;
    }

    return isActivityValid;
}
export const validateWirePayment = async (currentWirePayment, triggerValidation) => {
    let isActivityValid = true, result = true;

    if (!currentWirePayment.paymentVendorID) {
        result = await triggerValidation("paymentVendorID");
        if (!result)
            isActivityValid = result;
    }

    if (!currentWirePayment.wireCurrencyISO) {
        result = await triggerValidation("wireCurrencyISO");
        if (!result)
            isActivityValid = result;
    }

    if (!currentWirePayment.wireAmount) {
        result = await triggerValidation("wireAmount");
        if (!result)
            isActivityValid = result;
    }

    if (!currentWirePayment.bankName) {
        result = await triggerValidation("bankName");
        if (!result)
            isActivityValid = result;
    }
    return isActivityValid;

}

export const validateWCPaymentReserveWirePayment = async (currentWirePayment, triggerValidation) => {
    let isActivityValid = true, result = true;
    if (!currentWirePayment.bankName) {
        result = await triggerValidation("bankName");
        if (!result)
            isActivityValid = result;
    }
    return isActivityValid;

}

export const validateApprover = async (triggerValidation, currentClaimActivity) => {
    let isActivityValid = true, result = true;
    if (!currentClaimActivity.taskOwner) {
        result = await triggerValidation("taskOwner");
        if (!result)
            isActivityValid = result;
    }
    return isActivityValid;
}
export const validateAccountant = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("taskOwner");
    if (!result)
        isActivityValid = result;

    return isActivityValid;
}
export const validateApproverSection = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("comment");
    if (!result)
        isActivityValid = result;

    return isActivityValid;
}

export const validateCollectDeductible = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("amount");
    if (!result)
        isActivityValid = result;

    return isActivityValid;
}



export const validateInitialRINoticeRequested = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("comments");
    if (!result)
        isActivityValid = result;

    return isActivityValid;
}
export const validateGenesisPayementActivity = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("lossReserveTotal");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("lossDescCode");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("expenseReserveTotal");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("expenseDescCode");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyPaidLoss");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyLossReserves");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyPaidExpense");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyExpenseReserve");
    if (!result)
        isActivityValid = result;
    result = await triggerValidation("acr");
    if (!result)
        isActivityValid = result;
    result = await triggerValidation("aer");
    if (!result)
        isActivityValid = result;

    return isActivityValid;
}

export const validateWCReservePayementActivity = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("lossReserveTotal");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("expenseReserveTotal");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyFinancialDate");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyPaidLoss");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyLossReserves");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyMedicalPaid");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyMedicalReserves");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companySubroSIF");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyPaidExpense");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyExpenseReserve");
    if (!result)
        isActivityValid = result;

    return isActivityValid;
}

export const validateWCExpenseOnlyPayementActivity = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("companyFinancialDate");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("expenseReserveTotal");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyPaidExpense");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("companyExpenseReserve");
    if (!result)
        isActivityValid = result;

    return isActivityValid;
}


export const validateGenesisMLAActivity = async (triggerValidation) => {
    let isActivityValid = true, result = true;

    result = await triggerValidation("uWDivison");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("injury");
    if (!result)
        isActivityValid = result;

    result = await triggerValidation("reason");
    if (!result)
        isActivityValid = result;

    return isActivityValid;
}