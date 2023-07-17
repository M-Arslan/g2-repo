import { createActionLogForFinacialActivityType } from '../../../../ActionLog/Queries';
import { findAcitivityTypeUIByAcitivityType, findMenusToDisplay, saveActivity } from '../Queries';
import { validateMLASuppressionActivity, validateOpenActivity, validateReserveChangeActivity, validateOpenActivityForType1, validatePaymentClaimActivity, validateSpecialInstructionsActivity, validateWirePayment, validateWCTabularUpdateActivity, validateWCPaymentReserveWirePayment} from '../Validations/validateFinancial';
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_STATUS_TYPE, GENSERVE_CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { CLAIM_TYPES } from '../../../../../Core/Enumerations/app/claim-type';
import { LEGAL_ENTITY } from '../../../../../Core/Enumerations/app/legal-entity';
import { ACTION_TYPES } from '../../../../../Core/Enumerations/app/action-type';
import { STATUTORY_SYSTEM } from '../../../../../Core/Enumerations/app/statutory-system';
import { PAYMENT_TYPE_CODE } from '../../../../../Core/Enumerations/app/payment-type-code';

function ParseGQErrors(errors, error, enqueueSnackbar) {
    if (error || errors) {
        console.log("An error occured: ", errors);
        console.log("An error occured: ", error);
        enqueueSnackbar("An error occured.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    }
}

export const onOpenClaimAcivitySave = async (request, claim, authorityAmount, currentUser, formValidator, enqueueSnackbar, dispatch, validateOpenActivityForCE_LegalEntity3, loadNotifications, loadClaimRiskCodingDetail, primaryPolicy) => {
    let isValid = await validateOpenActivity(claim, formValidator.trigger);
    let lossCoding = await loadClaimRiskCodingDetail(claim.claimMasterID);
    let isValid2 = true;

    if (claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE || claim.claimType === CLAIM_TYPES.LEGAL) {
        if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN) {
            isValid2 = await validateOpenActivityForType1(claim, formValidator.trigger);
        }
        if (claim.claimType !== CLAIM_TYPES.LEGAL && claim.g2LegalEntityID !== LEGAL_ENTITY.GENERAL_STAR) {
            if (lossCoding.data.detail) {
                if (!(lossCoding.data.detail || {}).lineOfBusinessCodingTypeID) {
                    enqueueSnackbar("Line of Business must be selected on Loss coding tab before you may proceed.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    isValid2 = false;
                }
            }
            else {
                enqueueSnackbar("Line of Business must be selected on Loss coding tab before you may proceed.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid2 = false;
            }
        }
        if (claim.claimType === CLAIM_TYPES.CASUALTY) {
            if ((((request.currentClaimActivity || {}).openRegistrations || {}).openRegistrationClaimants || []).length < 1) {
                enqueueSnackbar("Please select at least one claimant.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid2 = false;
            }
        }
        if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN && claim.claimType !== CLAIM_TYPES.LEGAL && request.claim.g2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR) {
            if ((((request.currentClaimActivity || {}).openRegistrations || {}).openRegistrationCoverages || []).length < 1 && !claim.claimPolicy) {
                enqueueSnackbar("Please select at least one coverage.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid2 = false;
            }
        }

        if (!isValid || !isValid2)
            return;

        if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN && claim.claimType === CLAIM_TYPES.CASUALTY) {

            let expenseReserveTotal = ((request.currentClaimActivity.openRegistrations || {}).expenseReserveTotal || 0);
            let lossReserveTotal = ((request.currentClaimActivity.openRegistrations || {}).lossReserveTotal || 0);
            let medPayReserveTotal = ((request.currentClaimActivity.openRegistrations || {}).medPayReserveTotal || 0);

            let expenseReserveSum = 0;
            let lossReserveSum = 0;
            let medPayReserveSum = 0;
            if ((request.currentClaimActivity.openRegistrations || {}).openRegistrationClaimants) {
                request.currentClaimActivity.openRegistrations.openRegistrationClaimants.map(X => {
                    expenseReserveSum = expenseReserveSum + (X.expenseReserve || 0);
                    lossReserveSum = lossReserveSum + (X.lossReserve || 0);
                    medPayReserveSum = medPayReserveSum + (X.medPayReserve || 0);
                });
            }
            let isValuesValid = true;
            if (parseInt(expenseReserveTotal) !== parseInt(expenseReserveSum)) {
                enqueueSnackbar("Expense Reserve sum should be equal to Expense Reserve Total", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValuesValid = false;
            }
            if (parseInt(lossReserveTotal) !== parseInt(lossReserveSum)) {
                enqueueSnackbar("Loss Reserve sum should be equal to Loss Reserve Total", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValuesValid = false;
            }
            if (claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_INSURANCE) {
                if (parseInt(medPayReserveTotal) !== parseInt(medPayReserveSum)) {
                    enqueueSnackbar("Med Pay Reserve sum should be equal to Med Pay Reserve Total", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    isValuesValid = false;
                }
            }

            if (!isValuesValid)
                return;
        }
        let expenseReserveTotal = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.expenseReserveTotal)) ? parseFloat(request.currentClaimActivity.openRegistrations.expenseReserveTotal) : null;
        let lossReserveTotal = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.lossReserveTotal)) ? parseFloat(request.currentClaimActivity.openRegistrations.lossReserveTotal) : null;
        let medPayReserveTotal = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.medPayReserveTotal)) ? parseFloat(request.currentClaimActivity.openRegistrations.medPayReserveTotal) : null;
        let authorityAmountReserveAmount = (authorityAmount || {}).reserveAmount || 0;
        let amountSum = expenseReserveTotal + lossReserveTotal + medPayReserveTotal;
        if (Math.abs(amountSum) > authorityAmountReserveAmount) {
            request.currentClaimActivity.claimMasterID = claim.claimMasterID;
            request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PENDING_APPROVAL;
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
            enqueueSnackbar("This reserve change exceeds your authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }
        request.currentClaimActivity.openRegistrations.authorityCheckAmount = !isNaN(parseFloat(amountSum)) ? parseFloat(amountSum) : null;
    }
    else {       
        let isValid = true;
        isValid = await validateOpenActivityForCE_LegalEntity3(formValidator.trigger);
        let notifications = await loadNotifications("", "", claim.claimMasterID, true);

        if (notifications.filter(X => X.typeCode === "D").length > 0 && request.claim.claimType !== CLAIM_TYPES.WORKERS_COMP) {
            var len = notifications.filter(X => X.typeCode === "D").filter(X => X.notificationUsers.filter(Y => (new Date(Y.reminderDate)) > (new Date())).length > 0).length;
            if (len === 0) {
                enqueueSnackbar("This claim is off diary.  Please create a new diary that has a date that is greater than today", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid = false;
            }
        }

        if (claim.claimType !== CLAIM_TYPES.LEGAL) {
            if (lossCoding.data.detail) {
                if (!(lossCoding.data.detail || {}).lineOfBusinessCodingTypeID) {
                    enqueueSnackbar("Line of Business must be selected on Loss coding tab before you may proceed.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    isValid = false;
                }
            }
            else {
                enqueueSnackbar("Line of Business must be selected on Loss coding tab before you may proceed.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid = false;
            }
        }
        if ((claim.statutoryClaimID || claim.statutorySystem) && claim.statutorySystem !== STATUTORY_SYSTEM.NAT_RE ) {
            enqueueSnackbar("Statutory Claim ID and Statutory System should be empty on Claim Detail tab before you may proceed.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            isValid = false;
        }


        if (claim.claimType !== CLAIM_TYPES.LEGAL && !(claim.claimPolicy || claim.claimPolicyID || claim.policy)) {
            enqueueSnackbar("Policy is required on Claim Detail tab before you may proceed.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            isValid = false;
        }
        if (claim.claimType === CLAIM_TYPES.LEGAL && !primaryPolicy) {
            enqueueSnackbar("Primary policy is required on associated policy tab before you may proceed.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            isValid = false;
        }

        if (!isValid)
            return;

    }

    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
    request.currentClaimActivity.openRegistrations.companyPaidLoss = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.companyPaidLoss)) ? parseFloat(request.currentClaimActivity.openRegistrations.companyPaidLoss) : null;
    request.currentClaimActivity.openRegistrations.companyLossReserves = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.companyLossReserves)) ? parseFloat(request.currentClaimActivity.openRegistrations.companyLossReserves) : null;
    request.currentClaimActivity.openRegistrations.companyPaidExpense = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.companyPaidExpense)) ? parseFloat(request.currentClaimActivity.openRegistrations.companyPaidExpense) : null;
    request.currentClaimActivity.openRegistrations.companyExpenseReserve = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.companyExpenseReserve)) ? parseFloat(request.currentClaimActivity.openRegistrations.companyExpenseReserve) : null;
    request.currentClaimActivity.openRegistrations.cededPaidLoss = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.cededPaidLoss)) ? parseFloat(request.currentClaimActivity.openRegistrations.cededPaidLoss) : null;
    request.currentClaimActivity.openRegistrations.cededLossReserves = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.cededLossReserves)) ? parseFloat(request.currentClaimActivity.openRegistrations.cededLossReserves) : null;
    request.currentClaimActivity.openRegistrations.cededPaidExpense = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.cededPaidExpense)) ? parseFloat(request.currentClaimActivity.openRegistrations.cededPaidExpense) : null;
    request.currentClaimActivity.openRegistrations.cededExpenseReserve = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.cededExpenseReserve)) ? parseFloat(request.currentClaimActivity.openRegistrations.cededExpenseReserve) : null;
    request.currentClaimActivity.openRegistrations.acr = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.acr)) ? parseFloat(request.currentClaimActivity.openRegistrations.acr) : null;
    request.currentClaimActivity.openRegistrations.aer = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.aer)) ? parseFloat(request.currentClaimActivity.openRegistrations.aer) : null;
    request.currentClaimActivity.openRegistrations.lossReserveTotal = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.lossReserveTotal)) ? parseFloat(request.currentClaimActivity.openRegistrations.lossReserveTotal) : null;
    request.currentClaimActivity.openRegistrations.expenseReserveTotal = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.expenseReserveTotal)) ? parseFloat(request.currentClaimActivity.openRegistrations.expenseReserveTotal) : null;
    request.currentClaimActivity.openRegistrations.medPayReserveTotal = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.medPayReserveTotal)) ? parseFloat(request.currentClaimActivity.openRegistrations.medPayReserveTotal) : null;
    request.currentClaimActivity.claimMasterID = claim.claimMasterID;
    if (request.claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE) {
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED_TO_ACCOUNTANT_AUTHORITY_CHECK;
    }
    else {
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
    }
    request.currentClaimActivity.taskOwner = currentUser.id;
    delete request.currentClaimActivity.workflowTask;

    const result = await saveActivity(request.currentClaimActivity);
    ParseGQErrors(result.errors, result.error, enqueueSnackbar);
    if ((result.data || {}).saveActivity) {
        if (request.claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE) {
            await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted_to_Accountant_Authority_Check, (result.data || {}).saveActivity.activityID);
        }
        else {
            await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (result.data || {}).saveActivity.activityID);
        }
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: null, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(-1), isSaving: false, isProcessing: false } });
        enqueueSnackbar("Open Claim Activity has been created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    } else {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
    }

}

export const onMLASuppressionClaimAcivitySave = async (request, formValidator, dispatch) => {
    //setAnchorEl(null);
    let isValid = await validateMLASuppressionActivity(formValidator.trigger);
    if (!isValid)
        return;
    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true } });
}

export const onReopenClaimActivitySave = async (request, claim, authorityAmount, currentUser, enqueueSnackbar, dispatch) => {
    //setAnchorEl(null);
    let isValid = true;
    //isValid = await validateReopenActivity(formValidator.trigger);
    if (!(request.currentClaimActivity.reopens || {}).endingLossReserve && !(request.currentClaimActivity.reopens || {}).endingExpenseReserve) {
        enqueueSnackbar('Loss, Expense and MedPay are required"', { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        isValid = false;
    }
    let expenseReserveTotal = (request.currentClaimActivity.reopens || {}).endingExpenseReserve || 0;
    let lossReserveTotal = (request.currentClaimActivity.reopens || {}).endingLossReserve || 0;
    let medPayReserveTotal = (request.currentClaimActivity.reopens || {}).endingMedPayReserve || 0;
    let authorityAmountReserveAmount = authorityAmount.reserveAmount || 0;
    let amountSum = parseInt(expenseReserveTotal) + parseInt(lossReserveTotal) + parseInt(medPayReserveTotal);
    if (amountSum > authorityAmountReserveAmount) {
        request.currentClaimActivity.claimMasterID = claim.claimMasterID;
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PENDING_APPROVAL;
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
        enqueueSnackbar("This reserve change exceeds your authority.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        return;
    }
    if (isValid) {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimMasterID = claim.claimMasterID;
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
        request.currentClaimActivity.taskOwner = currentUser.id;
        delete request.currentClaimActivity.workflowTask;

        const result = await saveActivity(request.currentClaimActivity);
        ParseGQErrors(result.errors, result.error, enqueueSnackbar);
        if ((result.data || {}).saveActivity) {
            createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (result.data || {}).saveActivity.activityID)
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: null, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(-1), isSaving: false, isProcessing: false } });
            enqueueSnackbar("Reopen Claim Activity has been created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }

}

export const onCloseClaimActivitySave = async (request, claim, db2Claim, financialDB2, authorityAmount, enqueueSnackbar, dispatch, fsriFinancialDB2, conferFinancialDB2) => {
    const currentClaimActivity = request.currentClaimActivity || {};
    const currentCloseActivity = (currentClaimActivity.close || {});
    let authorityAmountReserveAmount = authorityAmount.reserveAmount || 0;

    if (claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE || claim.claimType === CLAIM_TYPES.LEGAL ) {
        let expenseReserve = 0;
        let lossReserve = 0;
        if ((db2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.OPEN) {
            if (financialDB2 == null) {
                enqueueSnackbar("Unable to find Financial Data in GenServe", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            } else {
                lossReserve = isNaN(parseFloat(financialDB2.lossReserves)) ? financialDB2.lossReserves : parseFloat(financialDB2.lossReserves);
                expenseReserve = isNaN(parseFloat(financialDB2.expenseReserves)) ? financialDB2.expenseReserves : parseFloat(financialDB2.expenseReserves);
            }
        }
        let totalAmount = lossReserve + expenseReserve;

        if (totalAmount > authorityAmountReserveAmount) {
            request.currentClaimActivity.claimMasterID = claim.claimMasterID;
            request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PENDING_APPROVAL;
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
            enqueueSnackbar("This reserve change exceeds your authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }
        currentCloseActivity.cededLossReserves = !isNaN(parseFloat(lossReserve)) ? parseFloat(lossReserve) : null;
        currentCloseActivity.cededExpenseReserve = !isNaN(parseFloat(expenseReserve)) ? parseFloat(expenseReserve) : null;

    }
    else if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE) {
        if (!(claim.statutoryClaimID && claim.statutorySystem)) {
            enqueueSnackbar("Statutory System and Statutory Claim ID must be provided before you may proceed.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }
        if (!(fsriFinancialDB2 || conferFinancialDB2) && claim.statutorySystem !== STATUTORY_SYSTEM.NAT_RE ) {
            enqueueSnackbar("Unable to find Financial Data in GenServe", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }
        let lossExpenseReserve = null;
        if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE) {
            lossExpenseReserve = {
                paidLoss: currentCloseActivity.cededPaidLoss != null ? currentCloseActivity.cededPaidLoss : null,
                paidExpense: currentCloseActivity.cededPaidExpense != null ? currentCloseActivity.cededPaidExpense : null,
                lossReserves: currentCloseActivity.cededLossReserves != null ? currentCloseActivity.cededLossReserves : null,
                expenseReserves: currentCloseActivity.cededExpenseReserve != null ? currentCloseActivity.cededExpenseReserve : null,
                additionalLossRes: currentCloseActivity.acr != null ? currentCloseActivity.acr : null,
                additionalExpenseRes: currentCloseActivity.aer != null ? currentCloseActivity.aer : null
            };
        }
        if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.FSRI) {
            lossExpenseReserve = fsriFinancialDB2 ? {
                paidLoss: fsriFinancialDB2.paidLoss,
                paidExpense: fsriFinancialDB2.paidExpense,
                lossReserves: fsriFinancialDB2.lossReserve,
                expenseReserves: fsriFinancialDB2.expenseReserve,
                additionalLossRes: fsriFinancialDB2.additionalLossRes,
                additionalExpenseRes: fsriFinancialDB2.additionalExpenseRes
            } : null;
        }
        else if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.CONFER) {
            lossExpenseReserve = conferFinancialDB2 ? {
                paidLoss: conferFinancialDB2.totalPaidLoss,
                paidExpense: conferFinancialDB2.totalPaidExpense,
                lossReserves: conferFinancialDB2.totalLossReserve,
                expenseReserves: conferFinancialDB2.totalExpenseReserve,
                additionalLossRes: conferFinancialDB2.totalACR,
                additionalExpenseRes: conferFinancialDB2.totalAER
            } : null;
        }
        let totalAmount = null;
        if (!(claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE)) {
            totalAmount = parseInt(lossExpenseReserve.expenseReserves || 0) + parseInt(lossExpenseReserve.lossReserves || 0) + parseInt(lossExpenseReserve.additionalLossRes || 0) + parseInt(lossExpenseReserve.additionalExpenseRes || 0);
            if (totalAmount > authorityAmountReserveAmount) {
                request.currentClaimActivity.claimMasterID = claim.claimMasterID;
                request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PENDING_APPROVAL;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                enqueueSnackbar("This reserve change exceeds your authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
        }
        currentCloseActivity.cededPaidLoss = !isNaN(parseFloat(lossExpenseReserve.paidLoss)) ? parseFloat(lossExpenseReserve.paidLoss) : null;
        currentCloseActivity.cededLossReserves = !isNaN(parseFloat(lossExpenseReserve.lossReserves)) ? parseFloat(lossExpenseReserve.lossReserves) : null;
        currentCloseActivity.cededPaidExpense = !isNaN(parseFloat(lossExpenseReserve.paidExpense)) ? parseFloat(lossExpenseReserve.paidExpense) : null;
        currentCloseActivity.cededExpenseReserve = !isNaN(parseFloat(lossExpenseReserve.expenseReserves)) ? parseFloat(lossExpenseReserve.expenseReserves) : null;
        currentCloseActivity.acr = !isNaN(parseFloat(lossExpenseReserve.additionalLossRes)) ? parseFloat(lossExpenseReserve.additionalLossRes) : null;
        currentCloseActivity.aer = !isNaN(parseFloat(lossExpenseReserve.additionalExpenseRes)) ? parseFloat(lossExpenseReserve.additionalExpenseRes) : null;
        currentCloseActivity.totalIncuredChangeAmount = !isNaN(parseFloat(totalAmount)) ? parseFloat(totalAmount) : null;
    }
    request.currentClaimActivity.close = currentCloseActivity;
    request.currentClaimActivity.claimMasterID = claim.claimMasterID;
    if (!(claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE)) {
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
    }
    else {
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED_TO_ACCOUNTANT_AUTHORITY_CHECK;
    }
    delete request.currentClaimActivity.workflowTask;
    const result = await saveActivity(currentClaimActivity);

    ParseGQErrors(result.errors, result.error, enqueueSnackbar);
    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });

    if ((result.data || {}).saveActivity) {
        if (!(claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE)) {
            createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (result.data || {}).saveActivity.activityID)
        }
        else {
            createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted_to_Accountant_Authority_Check, (result.data || {}).saveActivity.activityID)
        }
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: null, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(- 1), isSaving: false, isProcessing: false } });
        enqueueSnackbar("Close Activity has been Created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    } else {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, selectedMenu: "CLOSECLAIMACTIVITY", isSaving: false, isProcessing: false } });
    }
}

export const onWCTabularUpdateClaimActivitySave = async (request, claim, formValidator, db2Claim, financialDB2, authorityAmount, enqueueSnackbar, dispatch, fsriFinancialDB2, conferFinancialDB2) => {
    let isValid = await validateWCTabularUpdateActivity(formValidator.trigger)
    if (!isValid) {
        return;
    }
    const currentClaimActivity = request.currentClaimActivity || {};
    const currentWCTabularUpdate = currentClaimActivity.wCTabularUpdate || {};

    request.currentClaimActivity.wCTabularUpdate.beginningIndemnityPaid = !isNaN(parseFloat(currentWCTabularUpdate.beginningIndemnityPaid)) ? parseFloat(currentWCTabularUpdate.beginningIndemnityPaid) : null;
    request.currentClaimActivity.wCTabularUpdate.beginningIndemnityReserves = !isNaN(parseFloat(currentWCTabularUpdate.beginningIndemnityReserves)) ? parseFloat(currentWCTabularUpdate.beginningIndemnityReserves) : null;
    request.currentClaimActivity.wCTabularUpdate.beginningExpensePaid = !isNaN(parseFloat(currentWCTabularUpdate.beginningExpensePaid)) ? parseFloat(currentWCTabularUpdate.beginningExpensePaid) : null;
    request.currentClaimActivity.wCTabularUpdate.beginningExpenseReserves = !isNaN(parseFloat(currentWCTabularUpdate.beginningExpenseReserves)) ? parseFloat(currentWCTabularUpdate.beginningExpenseReserves) : null;
    request.currentClaimActivity.wCTabularUpdate.beginningACR = !isNaN(parseFloat(currentWCTabularUpdate.beginningACR)) ? parseFloat(currentWCTabularUpdate.beginningACR) : null;
    request.currentClaimActivity.wCTabularUpdate.beginningAER = !isNaN(parseFloat(currentWCTabularUpdate.beginningAER)) ? parseFloat(currentWCTabularUpdate.beginningAER) : null;

    request.currentClaimActivity.wCTabularUpdate.companyIndemnityPaid = !isNaN(parseFloat(currentWCTabularUpdate.companyIndemnityPaid)) ? parseFloat(currentWCTabularUpdate.companyIndemnityPaid) : null;
    request.currentClaimActivity.wCTabularUpdate.companyIndemnityReserves = !isNaN(parseFloat(currentWCTabularUpdate.companyIndemnityReserves)) ? parseFloat(currentWCTabularUpdate.companyIndemnityReserves) : null;
    request.currentClaimActivity.wCTabularUpdate.companyMedicalPaid = !isNaN(parseFloat(currentWCTabularUpdate.companyMedicalPaid)) ? parseFloat(currentWCTabularUpdate.companyMedicalPaid) : null;
    request.currentClaimActivity.wCTabularUpdate.companyMedicalReserves = !isNaN(parseFloat(currentWCTabularUpdate.companyMedicalReserves)) ? parseFloat(currentWCTabularUpdate.companyMedicalReserves) : null;
    request.currentClaimActivity.wCTabularUpdate.companyExpensePaid = !isNaN(parseFloat(currentWCTabularUpdate.companyExpensePaid)) ? parseFloat(currentWCTabularUpdate.companyExpensePaid) : null;
    request.currentClaimActivity.wCTabularUpdate.companyExpenseReserves = !isNaN(parseFloat(currentWCTabularUpdate.companyExpenseReserves)) ? parseFloat(currentWCTabularUpdate.companyExpenseReserves) : null;
    request.currentClaimActivity.wCTabularUpdate.companySubroSIF = !isNaN(parseFloat(currentWCTabularUpdate.companySubroSIF)) ? parseFloat(currentWCTabularUpdate.companySubroSIF) : null;

    request.currentClaimActivity.wCTabularUpdate.totalIncuredChangeAmount = !isNaN(parseFloat(currentWCTabularUpdate.totalIncuredChangeAmount)) ? parseFloat(currentWCTabularUpdate.companySubroSIF) : null;



    request.currentClaimActivity.claimMasterID = claim.claimMasterID;
    request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED_TO_ACCOUNTANT_AUTHORITY_CHECK;
    delete request.currentClaimActivity.workflowTask;

    const result = await saveActivity(request.currentClaimActivity);

    ParseGQErrors(result.errors, result.error, enqueueSnackbar);
    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });

    if ((result.data || {}).saveActivity) {
        createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted_to_Accountant_Authority_Check, (result.data || {}).saveActivity.activityID)
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: null, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(- 1), isSaving: false, isProcessing: false } });
        if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE)
            enqueueSnackbar("WC Tabular Update Activity has been Created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        else if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_RESERVE)
            enqueueSnackbar("WC Reserve Update Activity has been Created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    } else {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, selectedMenu: "CLOSECLAIMACTIVITY", isSaving: false, isProcessing: false } });
    }    
}

export const onReserveChangeClaimActivitySave = async (request, claim, lossExpenseReserve, authorityAmount, currentUser, formValidator, enqueueSnackbar, dispatch, fsriFinancialDB2, conferFinancialDB2) => {
    if (claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE || claim.claimType === CLAIM_TYPES.LEGAL) {
        let isValid = await validateReserveChangeActivity(claim, formValidator.trigger, (request.currentClaimActivity.reserveChanges || {}));
        if (!isValid)
            return;
        let authorityAmountReserveAmount = authorityAmount.reserveAmount || 0;
        let endingLossReserve = (request.currentClaimActivity.reserveChanges || {}).endingLossReserve || 0;
        let endingExpenseReserve = (request.currentClaimActivity.reserveChanges || {}).endingExpenseReserve || 0;
        let endingMedPayReserve = (request.currentClaimActivity.reserveChanges || {}).endingMedPayReserve || 0;
        let currentLossReserve = (lossExpenseReserve || {}).lossReserves || 0;
        let currentExpenseReserve = (lossExpenseReserve || {}).expenseReserves || 0;
        let currentMedpayReserve = (lossExpenseReserve || {}).medPayLossReserves || 0;

        if (claim.claimType === CLAIM_TYPES.CASUALTY) {
            let totalAmount = Math.abs((currentLossReserve - endingLossReserve)) + Math.abs((currentExpenseReserve - endingExpenseReserve)) + Math.abs((currentMedpayReserve - endingMedPayReserve));
            if (totalAmount> authorityAmountReserveAmount) {
                request.currentClaimActivity.claimMasterID = claim.claimMasterID;
                //request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PENDING_APPROVAL;
                request.currentClaimActivity["taskOwner"] = authorityAmount.legalEntityManagerID;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                enqueueSnackbar("This reserve change exceeds your authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
        }
        if (claim.claimType === CLAIM_TYPES.PROPERTY || claim.claimType === CLAIM_TYPES.LEGAL) {
            let totalAmount = Math.abs((parseFloat(currentLossReserve) - parseFloat(endingLossReserve))) + Math.abs((parseFloat(currentExpenseReserve) - parseFloat(endingExpenseReserve)));
            if (totalAmount > authorityAmountReserveAmount) {
                request.currentClaimActivity.claimMasterID = claim.claimMasterID;
                //request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PENDING_APPROVAL;
                request.currentClaimActivity["taskOwner"] = authorityAmount.legalEntityManagerID;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                enqueueSnackbar("This reserve change exceeds your authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
        }


        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimMasterID = claim.claimMasterID;
        if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.RESERVE && claim.g2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR) {
            request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PENDING_BOT_PROCESSING;
            request.currentClaimActivity.taskOwner = "GRN\VKathy";

        } else {
            request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
            request.currentClaimActivity.taskOwner = currentUser.id;
        }

        delete request.currentClaimActivity.workflowTask;
        const result = await saveActivity(request.currentClaimActivity);

        ParseGQErrors(result.errors, result.error, enqueueSnackbar);

        if ((result.data || {}).saveActivity) {
            createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (result.data || {}).saveActivity.activityID)
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: null, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(-1), isSaving: false, isProcessing: false } });
            enqueueSnackbar("Reserve Change Activity has been created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }
    else {
        let isValid = await validateReserveChangeActivity(claim, formValidator.trigger, (request.currentClaimActivity.reserveChanges || {}));

        if (!(claim.statutoryClaimID && claim.statutorySystem)) {
            enqueueSnackbar("Statutory System and Statutory Claim ID must be provided before you may proceed.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            isValid = false;
        }
        if (!isValid) {
            return;
        }        
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimMasterID = claim.claimMasterID;
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED_TO_ACCOUNTANT_AUTHORITY_CHECK;
        request.currentClaimActivity.taskOwner = currentUser.id;        
        delete request.currentClaimActivity.workflowTask;
        request.currentClaimActivity.reserveChanges.companyLossReserves = !isNaN(parseFloat(request.currentClaimActivity.reserveChanges.companyLossReserves)) ? parseFloat(request.currentClaimActivity.reserveChanges.companyLossReserves) : null;
        request.currentClaimActivity.reserveChanges.companyExpenseReserve = !isNaN(parseFloat(request.currentClaimActivity.reserveChanges.companyExpenseReserve)) ? parseFloat(request.currentClaimActivity.reserveChanges.companyExpenseReserve) : null;
        request.currentClaimActivity.reserveChanges.cededLossReserves = !isNaN(parseFloat(request.currentClaimActivity.reserveChanges.cededLossReserves)) ? parseFloat(request.currentClaimActivity.reserveChanges.cededLossReserves) : null;
        request.currentClaimActivity.reserveChanges.cededExpenseReserve = !isNaN(parseFloat(request.currentClaimActivity.reserveChanges.cededExpenseReserve)) ? parseFloat(request.currentClaimActivity.reserveChanges.cededExpenseReserve) : null;
        request.currentClaimActivity.reserveChanges.acr = !isNaN(parseFloat(request.currentClaimActivity.reserveChanges.acr)) ? parseFloat(request.currentClaimActivity.reserveChanges.acr) : null;
        request.currentClaimActivity.reserveChanges.aer = !isNaN(parseFloat(request.currentClaimActivity.reserveChanges.aer)) ? parseFloat(request.currentClaimActivity.reserveChanges.aer) : null;        

        let currentCededPaidLoss = null;
        let currentCededPaidExpense = null;
        let currentCededLossReserves = null;
        let currentCededExpenseReserve = null;
        let currentAcr = null;
        let currentAer = null;
        if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.FSRI) {
            currentCededPaidLoss = fsriFinancialDB2.paidLoss;
            currentCededPaidExpense = fsriFinancialDB2.paidExpense;
            currentCededLossReserves = fsriFinancialDB2.lossReserve;
            currentCededExpenseReserve = fsriFinancialDB2.expenseReserve;
            currentAcr = fsriFinancialDB2.additionalLossRes;
            currentAer = fsriFinancialDB2.additionalExpenseRes;
        };
        if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.CONFER) {
            currentCededPaidLoss = conferFinancialDB2.totalPaidLoss;
            currentCededPaidExpense = conferFinancialDB2.totalPaidExpense;
            currentCededLossReserves = conferFinancialDB2.totalLossReserve;
            currentCededExpenseReserve = conferFinancialDB2.totalExpenseReserve;
            currentAcr = conferFinancialDB2.totalACR;
            currentAer = conferFinancialDB2.totalAER;
        };

        if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE) {
            request.currentClaimActivity.reserveChanges.beginningCededLossReserve = !isNaN(parseFloat(currentCededLossReserves)) ? parseFloat(currentCededLossReserves) : null;
            request.currentClaimActivity.reserveChanges.beginningCededExpenseReserve = !isNaN(parseFloat(currentCededExpenseReserve)) ? parseFloat(currentCededExpenseReserve) : null;
            request.currentClaimActivity.reserveChanges.beginningACR = !isNaN(parseFloat(currentAcr)) ? parseFloat(currentAcr) : null;
            request.currentClaimActivity.reserveChanges.beginningAER = !isNaN(parseFloat(currentAer)) ? parseFloat(currentAer) : null;

            let acr = ((request.currentClaimActivity.reserveChanges || {}).acr || 0);
            let aer = ((request.currentClaimActivity.reserveChanges || {}).aer || 0);
            let cededLossReserves = ((request.currentClaimActivity.reserveChanges || {}).cededLossReserves || 0);
            let cededExpenseReserve = ((request.currentClaimActivity.reserveChanges || {}).cededExpenseReserve || 0);


            let actualCededReserves = parseFloat(cededLossReserves) + parseFloat(cededExpenseReserve) + parseFloat(acr) + parseFloat(aer);
            let actualCurrentCededReserves = parseFloat(currentCededLossReserves) + parseFloat(currentCededExpenseReserve) + parseFloat(currentAcr) + parseFloat(currentAer);
            let actualTotalAmount = actualCededReserves - actualCurrentCededReserves;
            request.currentClaimActivity.reserveChanges.mlaAuthorityCheckAmount = actualTotalAmount;
        }

        const result = await saveActivity(request.currentClaimActivity);
        ParseGQErrors(result.errors, result.error, enqueueSnackbar);

        if ((result.data || {}).saveActivity) {
            createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted_to_Accountant_Authority_Check, (result.data || {}).saveActivity.activityID)
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: null, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(-1), isSaving: false, isProcessing: false } });
            enqueueSnackbar("Reserve Change Activity has been created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }

    }
}

export const onRecoveryClaimActivitySave = async (request, claim, currentUser, formValidator, enqueueSnackbar, dispatch) => {
    //setAnchorEl(null);
    let isValid = await validateSpecialInstructionsActivity(formValidator.trigger);
    if (isValid) {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimMasterID = claim.claimMasterID;
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
        request.currentClaimActivity.taskOwner = currentUser.id;
        request.currentClaimActivity.specialInstructions = request.currentClaimActivity.specialInstructions || {};
        request.currentClaimActivity.specialInstructions.recoveryAmount = !isNaN(parseFloat(request.currentClaimActivity.specialInstructions.recoveryAmount)) ? parseFloat(request.currentClaimActivity.specialInstructions.recoveryAmount) : null;
        delete request.currentClaimActivity.workflowTask;
        const result = await saveActivity(request.currentClaimActivity);
        ParseGQErrors(result.errors, result.error, enqueueSnackbar);
        if ((result.data || {}).saveActivity) {
            createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (result.data || {}).saveActivity.activityID)
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: null, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(-1), isSaving: false, isProcessing: false } });
            enqueueSnackbar("Activity has been created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }
}

export const onPaymentClaimActivitySave = async (validateClaimDetailForActivity, validateGenesisPayementActivity, validateWCReservePayementActivity, validateWCExpenseOnlyPayementActivity, request, claim, db2Claim, lossExpenseReserve, authorityAmount, currentUser, formValidator, enqueueSnackbar, dispatch, fsriFinancialDB2, conferFinancialDB2) => {
    //setAnchorEl(null);
    let accountingTransTypeID = parseInt(request.currentClaimActivity.accountingTransTypeID);
    let currentDB2Claim = db2Claim;
    
    // Validate Claim Data
    let isValid = true;
    isValid = await validateClaimDetailForActivity();

    if (!isValid && [
            ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
            ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
            ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT,
            ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT
        ].includes(accountingTransTypeID)) {
        return;
    }

    // Check DB2 Claim
    if (!currentDB2Claim && [
            ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
            ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
            ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT,
            ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT
        ].includes(accountingTransTypeID)) {
        enqueueSnackbar("This claim does not exist in GenServe. Please request an Open Claim activity.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        return;
    }

    // Check DB2 Claim Status == P
    if (currentDB2Claim?.statusCode === GENSERVE_CLAIM_STATUS_TYPE.PENDING && [
            ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
            ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
            ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT
        ].includes(accountingTransTypeID)) {
        enqueueSnackbar("Claim is a pending file in GenServe. Please request an Open claim activity.", { variant: 'error', autoHideDuration: 10000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        return;
    }

    // Check DB2 Claim Status == X
    if (currentDB2Claim?.statusCode === GENSERVE_CLAIM_STATUS_TYPE.CLOSED_PENDING && [
            ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
            ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
            ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT
        ].includes(accountingTransTypeID)) {
        enqueueSnackbar("Claim is a closed pending file in GenServe. Please request an Open claim activity.", { variant: 'error', autoHideDuration: 10000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        return;
    }

    //// Check DB2 Claim Status == C
    //if (currentDB2Claim.statusCode == GENSERVE_CLAIM_STATUS_TYPE.CLOSED && [ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT].includes(accountingTransTypeID)) {
    //    enqueueSnackbar("This claim is closed in GenServe, please request claim be reopened.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    //    return;
    //}

    // Check Authority Amount
    if (!authorityAmount && [
            ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
            ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
            ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT,
            ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT
        ].includes(accountingTransTypeID)) {
        enqueueSnackbar("Authority amount does not exist for current user.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        return;
    }

    // Check Loss Expense Reserve
    if (!lossExpenseReserve && [
            ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
            ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
            ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT
        ].includes(accountingTransTypeID)) {
        enqueueSnackbar("Loss expense and reserve does not exist in GenServe.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        return;
    }

    if (accountingTransTypeID === ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT) {
        const currentClaimActivity = request.currentClaimActivity || {};
        const currentPayment = currentClaimActivity.payments || {};
        currentPayment.paymentWires = currentPayment.paymentWires || [{}];
        let currentWirePayment = (currentPayment.paymentWires || [{}])[0];
        currentWirePayment = !currentWirePayment ? {} : currentWirePayment;
        currentWirePayment.wireAmount = 0;

        // Validate statutoryClaimID & statutorySystem
        if (!(claim.statutoryClaimID && claim.statutorySystem)) {
            enqueueSnackbar("Statutory System and Statutory Claim ID must be provided before you may proceed.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }

        if (request.selectedMenu === "EXPENSEPAYMENTCLAIMACTIVITY") {
            isValid = await validateGenesisPayementActivity(formValidator.trigger);
            if (!currentWirePayment.bankName && currentPayment.paymentTypeCode === PAYMENT_TYPE_CODE.WIRED) {
                enqueueSnackbar("Bank Name is required in Wire Payment.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid = false;
            }

        }

        if (request.selectedMenu === "WIREPAYMENTDETAILS") {
            isValid = await validateWirePayment(currentWirePayment, formValidator.trigger);
            if (request.claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE) {
                if (!(currentPayment.lossReserveTotal && currentPayment.lossDescCode && currentPayment.expenseReserveTotal && currentPayment.expenseDescCode && currentPayment.companyPaidLoss && currentPayment.companyLossReserves && currentPayment.companyPaidExpense && currentPayment.companyExpenseReserve)) {
                    enqueueSnackbar("Please provide all required information in Genesis Payment.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    isValid = false;
                }
            } else {
                if (!(currentPayment.lossReserveTotal && currentPayment.expenseReserveTotal && currentPayment.companyPaidLoss && currentPayment.companyLossReserves && currentPayment.companyPaidExpense && currentPayment.companyExpenseReserve)) {
                    enqueueSnackbar("Please provide all required information in Genesis Payment.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    isValid = false;
                }
            }
        }


        if (!isValid)
            return
        
        currentClaimActivity.payments.lossReserveTotal = !isNaN(parseFloat(currentClaimActivity.payments.lossReserveTotal)) ? parseFloat(currentClaimActivity.payments.lossReserveTotal) : null;
        currentClaimActivity.payments.expenseReserveTotal = !isNaN(parseFloat(currentClaimActivity.payments.expenseReserveTotal)) ? parseFloat(currentClaimActivity.payments.expenseReserveTotal) : null;
        currentClaimActivity.payments.companyPaidLoss = !isNaN(parseFloat(currentClaimActivity.payments.companyPaidLoss)) ? parseFloat(currentClaimActivity.payments.companyPaidLoss) : null;
        currentClaimActivity.payments.companyLossReserves = !isNaN(parseFloat(currentClaimActivity.payments.companyLossReserves)) ? parseFloat(currentClaimActivity.payments.companyLossReserves) : null;
        currentClaimActivity.payments.companyPaidExpense = !isNaN(parseFloat(currentClaimActivity.payments.companyPaidExpense)) ? parseFloat(currentClaimActivity.payments.companyPaidExpense) : null;
        currentClaimActivity.payments.companyExpenseReserve = !isNaN(parseFloat(currentClaimActivity.payments.companyExpenseReserve)) ? parseFloat(currentClaimActivity.payments.companyExpenseReserve) : null;
        currentClaimActivity.payments.cededPaidLoss = !isNaN(parseFloat(currentClaimActivity.payments.cededPaidLoss)) ? parseFloat(currentClaimActivity.payments.cededPaidLoss) : null;
        currentClaimActivity.payments.cededLossReserves = !isNaN(parseFloat(currentClaimActivity.payments.cededLossReserves)) ? parseFloat(currentClaimActivity.payments.cededLossReserves) : null;
        currentClaimActivity.payments.cededPaidExpense = !isNaN(parseFloat(currentClaimActivity.payments.cededPaidExpense)) ? parseFloat(currentClaimActivity.payments.cededPaidExpense) : null;
        currentClaimActivity.payments.cededExpenseReserve = !isNaN(parseFloat(currentClaimActivity.payments.cededExpenseReserve)) ? parseFloat(currentClaimActivity.payments.cededExpenseReserve) : null;
        currentClaimActivity.payments.acr = !isNaN(parseFloat(currentClaimActivity.payments.acr)) ? parseFloat(currentClaimActivity.payments.acr) : null;
        currentClaimActivity.payments.aer = !isNaN(parseFloat(currentClaimActivity.payments.aer)) ? parseFloat(currentClaimActivity.payments.aer) : null;


        currentClaimActivity.payments.beginningCededPaidLoss = !isNaN(parseFloat(currentPayment.beginningCededPaidLoss)) ? parseFloat(currentPayment.beginningCededPaidLoss) : null;
        currentClaimActivity.payments.beginningCededPaidExpense = !isNaN(parseFloat(currentPayment.beginningCededPaidExpense)) ? parseFloat(currentPayment.beginningCededPaidExpense) : null;
        currentClaimActivity.payments.beginningCededLossReserve = !isNaN(parseFloat(currentPayment.beginningCededLossReserve)) ? parseFloat(currentPayment.beginningCededLossReserve) : null;
        currentClaimActivity.payments.beginningCededExpenseReserve = !isNaN(parseFloat(currentPayment.beginningCededExpenseReserve)) ? parseFloat(currentPayment.beginningCededExpenseReserve) : null;
        currentClaimActivity.payments.beginningACR = !isNaN(parseFloat(currentPayment.beginningACR)) ? parseFloat(currentPayment.beginningACR) : null;
        currentClaimActivity.payments.beginningAER = !isNaN(parseFloat(currentPayment.beginningAER)) ? parseFloat(currentPayment.beginningAER) : null;

        let totalPaymentAmount = parseFloat(currentPayment.lossReserveTotal) + parseFloat(currentPayment.expenseReserveTotal)
        let actualCededReserves = parseFloat(currentPayment.cededLossReserves || 0) + parseFloat(currentPayment.cededExpenseReserve || 0) + parseFloat(currentPayment.acr || 0) + parseFloat(currentPayment.aer || 0);
        let actualCurrentCededReserves = parseFloat(currentPayment.beginningCededLossReserve || 0) + parseFloat(currentPayment.beginningCededExpenseReserve || 0) + parseFloat(currentPayment.beginningACR || 0) + parseFloat(currentPayment.beginningAER || 0);
        let actualTotalAmount = actualCededReserves - actualCurrentCededReserves + totalPaymentAmount;

        currentClaimActivity.payments.mlaAuthorityCheckAmount = actualTotalAmount;
        currentClaimActivity.payments.paymentAuthorityCheckAmount = totalPaymentAmount;
        currentClaimActivity.payments.reserveAuthorityCheckAmount = actualCededReserves - actualCurrentCededReserves;       

        if (isValid) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
            currentClaimActivity.claimMasterID = claim.claimMasterID;
            currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED_TO_ACCOUNTANT_AUTHORITY_CHECK;
            currentClaimActivity.taskOwner = currentUser.id;
            let activity = JSON.parse(JSON.stringify(currentClaimActivity));
            delete activity.workflowTask;
            if (currentPayment.paymentTypeCode !== PAYMENT_TYPE_CODE.WIRED)
                delete activity.payments.paymentWires;
            if (!currentPayment.paymentTypeCode)
                delete activity.payments.paymentTypeCode;
            const result = await saveActivity(activity);
            ParseGQErrors(result.errors, result.error, enqueueSnackbar);
            if ((result.data || {}).saveActivity) {
                await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted_to_Accountant_Authority_Check, (result.data || {}).saveActivity.activityID);
                request.currentClaimActivity = null;
                request.selectedMenu = findAcitivityTypeUIByAcitivityType(-1);
                request.menusToDisplay = findMenusToDisplay(-1);
                request.isSaving = false;
                request.isProcessing = false;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request } });
                enqueueSnackbar("Genesis Payment Activity has been created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        }
        else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }
    else if (accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE) {
        const currentClaimActivity = request.currentClaimActivity || {};
        const currentPayment = currentClaimActivity.payments || {};
        currentPayment.paymentWires = currentPayment.paymentWires || [{}];
        let currentWirePayment = (currentPayment.paymentWires || [{}])[0];
        currentWirePayment = !currentWirePayment ? {} : currentWirePayment;
        currentWirePayment.wireAmount = 0;
        let isValid1 = true;
        // Validate statutoryClaimID & statutorySystem
        if (!(claim.statutoryClaimID && claim.statutorySystem)) {
            enqueueSnackbar("Statutory System and Statutory Claim ID must be provided before you may proceed.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }

        if (request.selectedMenu === "EXPENSEPAYMENTCLAIMACTIVITY") {
            isValid1 = await validateWCReservePayementActivity(formValidator.trigger);
            if (!currentWirePayment.bankName && currentPayment.paymentTypeCode === PAYMENT_TYPE_CODE.WIRED) {
                enqueueSnackbar("Bank Name is required in Wire Payment.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid1 = false;
            }

        }

        if (request.selectedMenu === "WIREPAYMENTDETAILS") {
            isValid1 = await validateWCPaymentReserveWirePayment(currentWirePayment, formValidator.trigger);
            if (!(currentPayment.lossReserveTotal && currentPayment.expenseReserveTotal && currentPayment.companyFinancialDate && currentPayment.companyPaidLoss && currentPayment.companyLossReserves && currentPayment.companyMedicalPaid && currentPayment.companyMedicalReserves && currentPayment.companySubroSIF && currentPayment.companyPaidExpense && currentPayment.companyExpenseReserve)) {
                enqueueSnackbar("Please provide all required information in WC Payment Reserve.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid1 = false;
            }                       
        }


        if (!isValid1)
            return

        currentClaimActivity.payments.lossReserveTotal = !isNaN(parseFloat(currentClaimActivity.payments.lossReserveTotal)) ? parseFloat(currentClaimActivity.payments.lossReserveTotal) : null;
        currentClaimActivity.payments.expenseReserveTotal = !isNaN(parseFloat(currentClaimActivity.payments.expenseReserveTotal)) ? parseFloat(currentClaimActivity.payments.expenseReserveTotal) : null;

        currentClaimActivity.payments.companyPaidLoss = !isNaN(parseFloat(currentClaimActivity.payments.companyPaidLoss)) ? parseFloat(currentClaimActivity.payments.companyPaidLoss) : null;
        currentClaimActivity.payments.companyLossReserves = !isNaN(parseFloat(currentClaimActivity.payments.companyLossReserves)) ? parseFloat(currentClaimActivity.payments.companyLossReserves) : null;
        currentClaimActivity.payments.companyPaidExpense = !isNaN(parseFloat(currentClaimActivity.payments.companyPaidExpense)) ? parseFloat(currentClaimActivity.payments.companyPaidExpense) : null;
        currentClaimActivity.payments.companyExpenseReserve = !isNaN(parseFloat(currentClaimActivity.payments.companyExpenseReserve)) ? parseFloat(currentClaimActivity.payments.companyExpenseReserve) : null;
        currentClaimActivity.payments.companyMedicalPaid = !isNaN(parseFloat(currentClaimActivity.payments.companyMedicalPaid)) ? parseFloat(currentClaimActivity.payments.companyMedicalPaid) : null;
        currentClaimActivity.payments.companyMedicalReserves = !isNaN(parseFloat(currentClaimActivity.payments.companyMedicalReserves)) ? parseFloat(currentClaimActivity.payments.companyMedicalReserves) : null;
        currentClaimActivity.payments.companySubroSIF = !isNaN(parseFloat(currentClaimActivity.payments.companySubroSIF)) ? parseFloat(currentClaimActivity.payments.companySubroSIF) : null;

        currentClaimActivity.payments.cededPaidLoss = !isNaN(parseFloat(currentClaimActivity.payments.cededPaidLoss)) ? parseFloat(currentClaimActivity.payments.cededPaidLoss) : null;
        currentClaimActivity.payments.cededLossReserves = !isNaN(parseFloat(currentClaimActivity.payments.cededLossReserves)) ? parseFloat(currentClaimActivity.payments.cededLossReserves) : null;
        currentClaimActivity.payments.cededPaidExpense = !isNaN(parseFloat(currentClaimActivity.payments.cededPaidExpense)) ? parseFloat(currentClaimActivity.payments.cededPaidExpense) : null;
        currentClaimActivity.payments.cededExpenseReserve = !isNaN(parseFloat(currentClaimActivity.payments.cededExpenseReserve)) ? parseFloat(currentClaimActivity.payments.cededExpenseReserve) : null;
        currentClaimActivity.payments.acr = !isNaN(parseFloat(currentClaimActivity.payments.acr)) ? parseFloat(currentClaimActivity.payments.acr) : null;
        currentClaimActivity.payments.aer = !isNaN(parseFloat(currentClaimActivity.payments.aer)) ? parseFloat(currentClaimActivity.payments.aer) : null;
        currentClaimActivity.payments.reserveAuthorityCheckAmount = !isNaN(parseFloat(currentClaimActivity.payments.reserveAuthorityCheckAmount)) ? parseFloat(currentClaimActivity.payments.reserveAuthorityCheckAmount) : null;


        currentClaimActivity.payments.beginningCededPaidLoss = !isNaN(parseFloat(currentPayment.beginningCededPaidLoss)) ? parseFloat(currentPayment.beginningCededPaidLoss) : null;
        currentClaimActivity.payments.beginningCededPaidExpense = !isNaN(parseFloat(currentPayment.beginningCededPaidExpense)) ? parseFloat(currentPayment.beginningCededPaidExpense) : null;
        currentClaimActivity.payments.beginningCededLossReserve = !isNaN(parseFloat(currentPayment.beginningCededLossReserve)) ? parseFloat(currentPayment.beginningCededLossReserve) : null;
        currentClaimActivity.payments.beginningCededExpenseReserve = !isNaN(parseFloat(currentPayment.beginningCededExpenseReserve)) ? parseFloat(currentPayment.beginningCededExpenseReserve) : null;
        currentClaimActivity.payments.beginningACR = !isNaN(parseFloat(currentPayment.beginningACR)) ? parseFloat(currentPayment.beginningACR) : null;
        currentClaimActivity.payments.beginningAER = !isNaN(parseFloat(currentPayment.beginningAER)) ? parseFloat(currentPayment.beginningAER) : null;



        let totalPaymentAmount = parseFloat(currentPayment.lossReserveTotal) + parseFloat(currentPayment.expenseReserveTotal)
        let totalIncuredChangeAmount = parseFloat(currentPayment.reserveAuthorityCheckAmount || 0);
        let actualTotalAmount = totalIncuredChangeAmount + totalPaymentAmount;

        currentClaimActivity.payments.mlaAuthorityCheckAmount = actualTotalAmount;
        currentClaimActivity.payments.paymentAuthorityCheckAmount = totalPaymentAmount;
        //currentClaimActivity.payments.reserveAuthorityCheckAmount = totalIncuredChangeAmount;
        if (isValid1) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
            currentClaimActivity.claimMasterID = claim.claimMasterID;
            currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED_TO_ACCOUNTANT_AUTHORITY_CHECK;
            currentClaimActivity.taskOwner = currentUser.id;
            let activity = JSON.parse(JSON.stringify(currentClaimActivity));
            delete activity.workflowTask;
            if (currentPayment.paymentTypeCode !== PAYMENT_TYPE_CODE.WIRED)
                delete activity.payments.paymentWires;
            if (!currentPayment.paymentTypeCode)
                delete activity.payments.paymentTypeCode;

            const result = await saveActivity(activity);
            ParseGQErrors(result.errors, result.error, enqueueSnackbar);
            if ((result.data || {}).saveActivity) {
                await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted_to_Accountant_Authority_Check, (result.data || {}).saveActivity.activityID);
                request.currentClaimActivity = null;
                request.selectedMenu = findAcitivityTypeUIByAcitivityType(-1);
                request.menusToDisplay = findMenusToDisplay(-1);
                request.isSaving = false;
                request.isProcessing = false;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request } });
                enqueueSnackbar("W/C Payment Reserve Activity has been created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        }
        else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }
    else if (accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT) {
        const currentClaimActivity = request.currentClaimActivity || {};
        const currentPayment = currentClaimActivity.payments || {};
        currentPayment.paymentWires = currentPayment.paymentWires || [{}];
        let currentWirePayment = (currentPayment.paymentWires || [{}])[0];
        currentWirePayment = !currentWirePayment ? {} : currentWirePayment;
        currentWirePayment.wireAmount = 0;
        let isValid1 = true;
        // Validate statutoryClaimID & statutorySystem
        if (!(claim.statutoryClaimID && claim.statutorySystem)) {
            enqueueSnackbar("Statutory System and Statutory Claim ID must be provided before you may proceed.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }

        if (request.selectedMenu === "EXPENSEPAYMENTCLAIMACTIVITY") {
            isValid1 = await validateWCExpenseOnlyPayementActivity(formValidator.trigger);
            if (!currentWirePayment.bankName && currentPayment.paymentTypeCode === PAYMENT_TYPE_CODE.WIRED) {
                enqueueSnackbar("Bank Name is required in Wire Payment.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid1 = false;
            }

        }

        if (request.selectedMenu === "WIREPAYMENTDETAILS") {
            isValid1 = await validateWCPaymentReserveWirePayment(currentWirePayment, formValidator.trigger);
            if (!(currentPayment.expenseReserveTotal && currentPayment.companyFinancialDate && currentPayment.companyPaidExpense && currentPayment.companyExpenseReserve)) {
                enqueueSnackbar("Please provide all required information in WC Expense only Payment.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid1 = false;
            }
        }


        if (!isValid1)
            return

        currentClaimActivity.payments.expenseReserveTotal = !isNaN(parseFloat(currentClaimActivity.payments.expenseReserveTotal)) ? parseFloat(currentClaimActivity.payments.expenseReserveTotal) : null;

        currentClaimActivity.payments.companyPaidExpense = !isNaN(parseFloat(currentClaimActivity.payments.companyPaidExpense)) ? parseFloat(currentClaimActivity.payments.companyPaidExpense) : null;
        currentClaimActivity.payments.companyExpenseReserve = !isNaN(parseFloat(currentClaimActivity.payments.companyExpenseReserve)) ? parseFloat(currentClaimActivity.payments.companyExpenseReserve) : null;

        currentClaimActivity.payments.cededPaidExpense = !isNaN(parseFloat(currentClaimActivity.payments.cededPaidExpense)) ? parseFloat(currentClaimActivity.payments.cededPaidExpense) : null;
        currentClaimActivity.payments.cededExpenseReserve = !isNaN(parseFloat(currentClaimActivity.payments.cededExpenseReserve)) ? parseFloat(currentClaimActivity.payments.cededExpenseReserve) : null;
        currentClaimActivity.payments.reserveAuthorityCheckAmount = !isNaN(parseFloat(currentClaimActivity.payments.reserveAuthorityCheckAmount)) ? parseFloat(currentClaimActivity.payments.reserveAuthorityCheckAmount) : null;


        currentClaimActivity.payments.beginningCededPaidExpense = !isNaN(parseFloat(currentPayment.beginningCededPaidExpense)) ? parseFloat(currentPayment.beginningCededPaidExpense) : null;
        currentClaimActivity.payments.beginningCededExpenseReserve = !isNaN(parseFloat(currentPayment.beginningCededExpenseReserve)) ? parseFloat(currentPayment.beginningCededExpenseReserve) : null;



        let totalPaymentAmount = parseFloat(currentPayment.expenseReserveTotal)
        let transactionReserveChangeAmount = parseFloat(currentClaimActivity.payments.reserveAuthorityCheckAmount || 0);

        currentClaimActivity.payments.mlaAuthorityCheckAmount = transactionReserveChangeAmount;
        currentClaimActivity.payments.paymentAuthorityCheckAmount = totalPaymentAmount;
        //currentClaimActivity.payments.reserveAuthorityCheckAmount = totalIncuredChangeAmount;
        if (isValid1) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
            currentClaimActivity.claimMasterID = claim.claimMasterID;
            currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED_TO_ACCOUNTANT_AUTHORITY_CHECK;
            currentClaimActivity.taskOwner = currentUser.id;
            let activity = JSON.parse(JSON.stringify(currentClaimActivity));
            delete activity.workflowTask;
            if (currentPayment.paymentTypeCode !== PAYMENT_TYPE_CODE.WIRED)
                delete activity.payments.paymentWires;
            if (!currentPayment.paymentTypeCode)
                delete activity.payments.paymentTypeCode;

            const result = await saveActivity(activity);
            ParseGQErrors(result.errors, result.error, enqueueSnackbar);
            if ((result.data || {}).saveActivity) {
                await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted_to_Accountant_Authority_Check, (result.data || {}).saveActivity.activityID);
                request.currentClaimActivity = null;
                request.selectedMenu = findAcitivityTypeUIByAcitivityType(-1);
                request.menusToDisplay = findMenusToDisplay(-1);
                request.isSaving = false;
                request.isProcessing = false;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request } });
                enqueueSnackbar("W/C Expense only Payment Activity has been created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        }
        else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }
    else {

        // Check Vendor
        const currentClaimActivity = request.currentClaimActivity || {};
        const currentPayment = currentClaimActivity.payments || {};
        if ((currentPayment.paymentVendors || []).length === 0) {
            if ([ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT].includes(accountingTransTypeID))
                enqueueSnackbar("Vendor is required.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            else
                enqueueSnackbar("Payee is required.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

            return;
        }

        currentPayment.paymentWires = currentPayment.paymentWires || [{}];
        let currentWirePayment = (currentPayment.paymentWires || [{}])[0];
        currentWirePayment = !currentWirePayment ? {} : currentWirePayment;

        let currentVendor = {};
        if (currentPayment.paymentTypeCode !== PAYMENT_TYPE_CODE.WIRED) {
            currentVendor = currentPayment.paymentVendors[0];
        }
        else {
            currentVendor = currentWirePayment.paymentVendorID ? currentPayment.paymentVendors.filter(X => X.paymentVendorID === currentWirePayment.paymentVendorID)[0] : {};
        }

        if (request.selectedMenu === "EXPENSEPAYMENTCLAIMACTIVITY") {
            isValid = await validatePaymentClaimActivity(formValidator.trigger);
        }

        if (request.selectedMenu === "WIREPAYMENTDETAILS") {
            isValid = await validateWirePayment(currentWirePayment, formValidator.trigger);
        }
        else {
            if (currentPayment.paymentTypeCode === PAYMENT_TYPE_CODE.WIRED) {
                if (!currentWirePayment.paymentVendorID || !currentVendor) {
                    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT)
                        enqueueSnackbar("Vendor is required in Wire Payment.", { variant: 'error', autoHideDuration: 10000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    else
                        enqueueSnackbar("Payee is required in Wire Payment.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    isValid = false;
                }
                if (!currentWirePayment.wireCurrencyISO) {
                    enqueueSnackbar("Wire Currency is required in Wire Payment.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    isValid = false;
                }
                if (isNaN(parseInt(currentWirePayment.wireAmount))) {
                    enqueueSnackbar("Wire Amount is required in Wire Payment.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    isValid = false;
                }
                if (!currentWirePayment.bankName) {
                    enqueueSnackbar("Bank Name is required in Wire Payment.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    isValid = false;
                }
            }
        }

        //Check Vendor Financial Transaction Code
        if (!currentVendor.accountingTransCode && request.claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE ) {
            enqueueSnackbar("Financial transaction code is required in Vendor.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            isValid = false;
        }

        //Check Vendor Payment Type 
        if ([ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT].includes(accountingTransTypeID) && !currentVendor.paymentTypeCode) {
            enqueueSnackbar("Payment Type is required in Vendor.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            isValid = false;
        }

        // Check - Financial transaction code must be same for all payees
        let accountingTransCode = "";
        for (let i = 0; i < currentPayment.paymentVendors.length; i++) {
            if (i === 0)
                accountingTransCode = (currentPayment.paymentVendors[i].accountingTransCode || {}).transCode;
            else if (accountingTransCode !== (currentPayment.paymentVendors[i].accountingTransCode || {}).transCode) {
                enqueueSnackbar("Financial transaction code must be same for all payees.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid = false;
                break;
            }

        }

        let sumOfPaymentAmount = 0;
        currentPayment.paymentVendors.map(X => {
            sumOfPaymentAmount = sumOfPaymentAmount + X.paymentAmount;
        });
        // Check Expense - Vendor Payment with Expense Reserves
        if (request.claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE) {
            if ([ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT].includes(accountingTransTypeID) && isValid && currentVendor.accountingTransCode.reserveChange && parseFloat(currentVendor.paymentAmount) > parseInt(lossExpenseReserve.expenseReserves)) {
                enqueueSnackbar("The amount of payment requested exceeds the current  expense reserve balance, select a transaction code without takedown or request a reserve increase", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid = false;

            }

            // Check Indemnity - Payee Payment with Loss Reserves
            if ([ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT].includes(accountingTransTypeID) && isValid && currentVendor.accountingTransCode.reserveChange && parseFloat(sumOfPaymentAmount) > parseInt(lossExpenseReserve.lossReserves)) {
                enqueueSnackbar("The amount of payment requested exceeds the current  indemnity reserve balance, select a transaction code without takedown or request a reserve increase", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid = false;
            }
            // Check MedPay - Payee Payment with MedPayExpenseReserves + MedPayLossReserves
            if ([ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT].includes(accountingTransTypeID) && isValid && currentVendor.accountingTransCode.reserveChange && parseFloat(currentVendor.paymentAmount) > (parseInt(lossExpenseReserve.medPayExpenseReserves) + parseInt(lossExpenseReserve.medPayLossReserves))) {
                enqueueSnackbar("The amount of payment requested exceeds the current  medpay reserve balance, select a transaction code without takedown or request a reserve increase", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid = false;
            }

            // Check Vendor/Payee Payment with AuthorityAmount.PaymentAmount
            if ([
                    ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT
                ].includes(accountingTransTypeID) && isValid && parseFloat(sumOfPaymentAmount) > parseInt(authorityAmount.paymentAmount)) {
                enqueueSnackbar("This payment exceeds your authority", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid = false;
                request.openApproverSelectionDrawer = true;
                request.currentClaimActivity["taskOwner"] = authorityAmount.legalEntityManagerID;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request } });
            }
        }
        else {

            //if ([ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT].includes(accountingTransTypeID) && isValid && parseFloat(currentVendor.paymentAmount) > parseInt(lossExpenseReserve.expenseReserves)) {
            //    enqueueSnackbar("The amount of payment requested exceeds the current  expense reserve balance.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            //    isValid = false;

            //}

            //// Check Indemnity - Payee Payment with Loss Reserves
            //if ([ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT].includes(accountingTransTypeID) && isValid && parseFloat(sumOfPaymentAmount) > parseInt(lossExpenseReserve.lossReserves)) {
            //    enqueueSnackbar("The amount of payment requested exceeds the current  indemnity reserve balance.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            //    isValid = false;
            //}

            //// Check MedPay - Payee Payment with MedPayExpenseReserves + MedPayLossReserves
            //if ([ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT].includes(accountingTransTypeID) && isValid && parseFloat(currentVendor.paymentAmount) > (parseInt(lossExpenseReserve.medPayExpenseReserves) + parseInt(lossExpenseReserve.medPayLossReserves))) {
            //    enqueueSnackbar("The amount of payment requested exceeds the current  medpay reserve balance.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            //    isValid = false;
            //}

            // Check Vendor/Payee Payment with AuthorityAmount.PaymentAmount
            if ([
                    ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT
                ].includes(accountingTransTypeID) && isValid && parseFloat(sumOfPaymentAmount) > parseInt(authorityAmount.paymentAmount)) {
                enqueueSnackbar("This payment exceeds your authority", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid = false;
                request.openApproverSelectionDrawer = true;
                request.currentClaimActivity["taskOwner"] = authorityAmount.legalEntityManagerID;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request } });
            }
        }
        if (isValid) {
            if ([
                ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
                ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
                ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT
            ].includes(accountingTransTypeID)) {
                request.currentClaimActivity.payments.mlaAuthorityCheckAmount = sumOfPaymentAmount;                
            }
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
            request.currentClaimActivity.claimMasterID = claim.claimMasterID;
            if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT && currentPayment.paymentTypeCode !== PAYMENT_TYPE_CODE.WIRED && currentPayment.paymentTypeCode !== PAYMENT_TYPE_CODE.FEDEX && claim.g2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR) {
                request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PENDING_BOT_PROCESSING;
                request.currentClaimActivity.taskOwner = "GRN\VKathy";

            } else {                             
                request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
                request.currentClaimActivity.taskOwner = currentUser.id;
            }
            let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
            delete activity.workflowTask;
            if (currentPayment.paymentTypeCode !== PAYMENT_TYPE_CODE.WIRED)
                delete activity.payments.paymentWires;
            if (!currentPayment.paymentTypeCode)
                delete activity.payments.paymentTypeCode;
            const result = await saveActivity(activity);
            ParseGQErrors(result.errors, result.error, enqueueSnackbar);
            if ((result.data || {}).saveActivity) {
                if (request.claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE) {
                    await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted_to_Accountant_Authority_Check, (result.data || {}).saveActivity.activityID);
                }
                else {
                    await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (result.data || {}).saveActivity.activityID);
                }
                request.currentClaimActivity = null;
                request.selectedMenu = findAcitivityTypeUIByAcitivityType(-1);
                request.menusToDisplay = findMenusToDisplay(-1);
                request.isSaving = false;
                request.isProcessing = false;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request } });
                enqueueSnackbar("Payment Activity has been created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        }
        else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }
}