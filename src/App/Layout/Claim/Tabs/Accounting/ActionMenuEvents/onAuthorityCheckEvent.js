import { validateOpenActivityForLegalEntity3, validateCloseActivity, validateReserveChangeActivityForLegalEntity3, validateGenesisPaymentActivity, validateWCTabularUpdateActivityForCheckAuthority, validateWCPaymentReserveActivityForCheckAuthority, validateWCExpenseOnlyPaymentActivityForCheckAuthority } from '../Validations/validateFinancial';
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { LEGAL_ENTITY } from '../../../../../Core/Enumerations/app/legal-entity';
import { ACTION_TYPES } from '../../../../../Core/Enumerations/app/action-type';
import { STATUTORY_SYSTEM } from '../../../../../Core/Enumerations/app/statutory-system';
import { onCompletedGenesisMLARule } from './onCompletedEvent';

export const onAuthorityCheck = async (request, claim, activityCreatorAuthorityAmount, currentUser, formValidator, enqueueSnackbar, dispatch, saveActivity, createActionLogForFinacialActivityType, loadActivityView, fsriFinancialDB2, conferFinancialDB2, financialDB2, lossExpenseReserve, users ) => {
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN) {
        let isValid = await validateOpenActivityForLegalEntity3(formValidator.trigger)
        if (isValid) {
            let cededPaidLoss = ((request.currentClaimActivity.openRegistrations || {}).cededPaidLoss || 0);
            let cededLossReserves = ((request.currentClaimActivity.openRegistrations || {}).cededLossReserves || 0);
            let cededPaidExpense = ((request.currentClaimActivity.openRegistrations || {}).cededPaidExpense || 0);
            let cededExpenseReserve = ((request.currentClaimActivity.openRegistrations || {}).cededExpenseReserve || 0);
            let acr = ((request.currentClaimActivity.openRegistrations || {}).acr || 0);
            let aer = ((request.currentClaimActivity.openRegistrations || {}).aer || 0);
            let amountSum = parseFloat(cededPaidLoss) + parseFloat(cededLossReserves) + parseFloat(cededPaidExpense) + parseFloat(cededExpenseReserve) + parseFloat(acr) + parseFloat(aer);
            let activityCreatorAuthorityReserveAmount = (activityCreatorAuthorityAmount || {}).reserveAmount || 0;            
            if (Math.abs(amountSum) < activityCreatorAuthorityReserveAmount) {
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
                request.currentClaimActivity.openRegistrations.authorityCheckAmount = !isNaN(parseFloat(amountSum)) ? parseFloat(amountSum) : null;
                request.currentClaimActivity.openRegistrations.lossReserveTotal = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.lossReserveTotal)) ? parseFloat(request.currentClaimActivity.openRegistrations.lossReserveTotal) : null;
                request.currentClaimActivity.openRegistrations.expenseReserveTotal = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.expenseReserveTotal)) ? parseFloat(request.currentClaimActivity.openRegistrations.expenseReserveTotal) : null;
                request.currentClaimActivity.openRegistrations.medPayReserveTotal = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.medPayReserveTotal)) ? parseFloat(request.currentClaimActivity.openRegistrations.medPayReserveTotal) : null;
                request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
                request.currentClaimActivity.taskOwner = currentUser.id;
                let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
                delete activity.workflowTask;
                const result = await saveActivity(activity);
                if ((result.data || {}).saveActivity) {
                    await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (result.data || {}).saveActivity.activityID);
                    let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
                    enqueueSnackbar("Activity has been set to Submitted successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                } else {
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
                }
            }
            else {
                request.currentClaimActivity.taskOwner = null;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                enqueueSnackbar("This reserve change exceeds your authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }

        } else {
            enqueueSnackbar("All ceded financials must be entered before you may check authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.CLOSE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE) {
        let isValid = await validateCloseActivity(formValidator.trigger);
        if (isValid) {
            let currentClaimActivity = (request.currentClaimActivity || {});
            let currentCloseActivity = (currentClaimActivity.close || {});
            let lossExpenseReserve = {
                paidLoss: currentCloseActivity.cededPaidLoss != null ? currentCloseActivity.cededPaidLoss : null,
                paidExpense: currentCloseActivity.cededPaidExpense != null ? currentCloseActivity.cededPaidExpense : null,
                lossReserves: currentCloseActivity.cededLossReserves != null ? currentCloseActivity.cededLossReserves : null,
                expenseReserves: currentCloseActivity.cededExpenseReserve != null ? currentCloseActivity.cededExpenseReserve : null,
                additionalLossRes: currentCloseActivity.acr != null ? currentCloseActivity.acr : null,
                additionalExpenseRes: currentCloseActivity.aer != null ? currentCloseActivity.aer : null
            };
            currentCloseActivity.cededPaidLoss = !isNaN(parseFloat(lossExpenseReserve.paidLoss)) ? parseFloat(lossExpenseReserve.paidLoss) : null;
            currentCloseActivity.cededLossReserves = !isNaN(parseFloat(lossExpenseReserve.lossReserves)) ? parseFloat(lossExpenseReserve.lossReserves) : null;
            currentCloseActivity.cededPaidExpense = !isNaN(parseFloat(lossExpenseReserve.paidExpense)) ? parseFloat(lossExpenseReserve.paidExpense) : null;
            currentCloseActivity.cededExpenseReserve = !isNaN(parseFloat(lossExpenseReserve.expenseReserves)) ? parseFloat(lossExpenseReserve.expenseReserves) : null;
            currentCloseActivity.acr = !isNaN(parseFloat(lossExpenseReserve.additionalLossRes)) ? parseFloat(lossExpenseReserve.additionalLossRes) : null;
            currentCloseActivity.aer = !isNaN(parseFloat(lossExpenseReserve.additionalExpenseRes)) ? parseFloat(lossExpenseReserve.additionalExpenseRes) : null;
            const totalAmount = parseInt(lossExpenseReserve.expenseReserves || 0) + parseInt(lossExpenseReserve.lossReserves || 0) + parseInt(lossExpenseReserve.additionalLossRes || 0) + parseInt(lossExpenseReserve.additionalExpenseRes || 0);
            currentCloseActivity.totalIncuredChangeAmount = !isNaN(parseFloat(totalAmount)) ? parseFloat(totalAmount) : null;
            let activityCreatorAuthorityReserveAmount = (activityCreatorAuthorityAmount || {}).reserveAmount || 0;
            if (totalAmount < activityCreatorAuthorityReserveAmount) {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
                request.currentClaimActivity.close = currentCloseActivity;
                request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
                request.currentClaimActivity.taskOwner = currentUser.id;
                let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
                delete activity.workflowTask;
                const result = await saveActivity(activity);
                if ((result.data || {}).saveActivity) {
                    await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (result.data || {}).saveActivity.activityID);
                    let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
                    enqueueSnackbar("Activity has been set to Submitted successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                } else {
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
                }
            }
            else {
                request.currentClaimActivity.taskOwner = null;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                enqueueSnackbar("This reserve change exceeds your authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }

        }
        else {
            enqueueSnackbar("Ceded finacnials should be completed before authority check.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.RESERVE) {        
        let isValid = await validateReserveChangeActivityForLegalEntity3(formValidator.trigger);
        if (isValid) {

            let currentReserveChange = request.currentClaimActivity.reserveChanges || {};

            let cededLossReserves = currentReserveChange.cededLossReserves || 0;
            let cededExpenseReserve = currentReserveChange.cededExpenseReserve || 0;
            let acr = currentReserveChange.acr || 0;
            let aer = currentReserveChange.aer || 0;
            let currentCededLossReserves = null;
            let currentCededExpenseReserve = null;
            let currentAcr = null;
            let currentAer = null;
            if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.FSRI) {

                currentCededLossReserves = currentReserveChange.beginningCededLossReserve != null ? currentReserveChange.beginningCededLossReserve : fsriFinancialDB2.lossReserve;
                currentCededExpenseReserve = currentReserveChange.beginningCededExpenseReserve != null ? currentReserveChange.beginningCededExpenseReserve : fsriFinancialDB2.expenseReserve;
                currentAcr = currentReserveChange.beginningACR != null ? currentReserveChange.beginningACR : fsriFinancialDB2.additionalLossRes;
                currentAer = currentReserveChange.beginningAER != null ? currentReserveChange.beginningAER : fsriFinancialDB2.additionalExpenseRes;

            }
            if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.CONFER) {


                currentCededLossReserves = currentReserveChange.beginningCededLossReserve != null ? currentReserveChange.beginningCededLossReserve : conferFinancialDB2.totalLossReserve;
                currentCededExpenseReserve = currentReserveChange.beginningCededExpenseReserve != null ? currentReserveChange.beginningCededExpenseReserve : conferFinancialDB2.totalExpenseReserve;
                currentAcr = currentReserveChange.beginningACR != null ? currentReserveChange.beginningACR : conferFinancialDB2.totalACR;
                currentAer = currentReserveChange.beginningAER != null ? currentReserveChange.beginningAER : conferFinancialDB2.totalAER;

            }


            let activityCreatorAuthorityReserveAmount = (activityCreatorAuthorityAmount || {}).reserveAmount || 0;

            //let amountSum = Math.abs(parseFloat(acr)) + Math.abs(parseFloat(cededLossReserves)) + Math.abs(parseFloat(aer)) + Math.abs(parseFloat(cededExpenseReserve));
            //let db2Sum = Math.abs(parseFloat(currentAcr)) + Math.abs(parseFloat(currentCededLossReserves)) + Math.abs(parseFloat(currentAer)) + Math.abs(parseFloat(currentCededExpenseReserve));
            let amountSum = parseFloat(acr) + parseFloat(cededLossReserves) + parseFloat(aer) + parseFloat(cededExpenseReserve);
            let db2Sum = parseFloat(currentAcr) + parseFloat(currentCededLossReserves) + parseFloat(currentAer) + parseFloat(currentCededExpenseReserve);

            let calcAmount = Math.abs(amountSum - db2Sum);
            if (calcAmount < activityCreatorAuthorityReserveAmount) {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
                request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
                request.currentClaimActivity.taskOwner = currentUser.id;
                request.currentClaimActivity.reserveChanges.companyLossReserves = !isNaN(parseFloat(request.currentClaimActivity.reserveChanges.companyLossReserves)) ? parseFloat(request.currentClaimActivity.reserveChanges.companyLossReserves) : null;
                request.currentClaimActivity.reserveChanges.companyExpenseReserve = !isNaN(parseFloat(request.currentClaimActivity.reserveChanges.companyExpenseReserve)) ? parseFloat(request.currentClaimActivity.reserveChanges.companyExpenseReserve) : null;                
                request.currentClaimActivity.reserveChanges.cededLossReserves = !isNaN(parseFloat(request.currentClaimActivity.reserveChanges.cededLossReserves)) ? parseFloat(request.currentClaimActivity.reserveChanges.cededLossReserves) : null;
                request.currentClaimActivity.reserveChanges.cededExpenseReserve = !isNaN(parseFloat(request.currentClaimActivity.reserveChanges.cededExpenseReserve)) ? parseFloat(request.currentClaimActivity.reserveChanges.cededExpenseReserve) : null;
                request.currentClaimActivity.reserveChanges.acr = !isNaN(parseFloat(request.currentClaimActivity.reserveChanges.acr)) ? parseFloat(request.currentClaimActivity.reserveChanges.acr) : null;
                request.currentClaimActivity.reserveChanges.aer = !isNaN(parseFloat(request.currentClaimActivity.reserveChanges.aer)) ? parseFloat(request.currentClaimActivity.reserveChanges.aer) : null;                
                request.currentClaimActivity.reserveChanges.mlaAuthorityCheckAmount = amountSum - db2Sum;

                let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
                delete activity.workflowTask;                
                const result = await saveActivity(activity);
                if ((result.data || {}).saveActivity) {
                    await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (result.data || {}).saveActivity.activityID);
                    let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
                    enqueueSnackbar("Activity has been set to Submitted successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                } else {
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
                }
            }
            else {
                request.currentClaimActivity.taskOwner = null;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                enqueueSnackbar("This reserve change exceeds your authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }

        } else {
            enqueueSnackbar("All ceded financials must be entered before you may check authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT) {
        let isValid = await validateGenesisPaymentActivity(formValidator.trigger);
        if (isValid) {
            const currentClaimActivity = request.currentClaimActivity || {};
            const currentPayment = currentClaimActivity.payments || {};

            currentClaimActivity.payments.lossReserveTotal = !isNaN(parseFloat(currentPayment.lossReserveTotal)) ? parseFloat(currentPayment.lossReserveTotal) : null;
            currentClaimActivity.payments.expenseReserveTotal = !isNaN(parseFloat(currentPayment.expenseReserveTotal)) ? parseFloat(currentPayment.expenseReserveTotal) : null;
            currentClaimActivity.payments.companyPaidLoss = !isNaN(parseFloat(currentPayment.companyPaidLoss)) ? parseFloat(currentPayment.companyPaidLoss) : null;
            currentClaimActivity.payments.companyLossReserves = !isNaN(parseFloat(currentPayment.companyLossReserves)) ? parseFloat(currentPayment.companyLossReserves) : null;
            currentClaimActivity.payments.companyPaidExpense = !isNaN(parseFloat(currentPayment.companyPaidExpense)) ? parseFloat(currentPayment.companyPaidExpense) : null;
            currentClaimActivity.payments.companyExpenseReserve = !isNaN(parseFloat(currentPayment.companyExpenseReserve)) ? parseFloat(currentPayment.companyExpenseReserve) : null;
            currentClaimActivity.payments.cededPaidLoss = !isNaN(parseFloat(currentPayment.cededPaidLoss)) ? parseFloat(currentPayment.cededPaidLoss) : null;
            currentClaimActivity.payments.cededLossReserves = !isNaN(parseFloat(currentPayment.cededLossReserves)) ? parseFloat(currentPayment.cededLossReserves) : null;
            currentClaimActivity.payments.cededPaidExpense = !isNaN(parseFloat(currentPayment.cededPaidExpense)) ? parseFloat(currentPayment.cededPaidExpense) : null;
            currentClaimActivity.payments.cededExpenseReserve = !isNaN(parseFloat(currentPayment.cededExpenseReserve)) ? parseFloat(currentPayment.cededExpenseReserve) : null;
            currentClaimActivity.payments.acr = !isNaN(parseFloat(currentPayment.acr)) ? parseFloat(currentPayment.acr) : null;
            currentClaimActivity.payments.aer = !isNaN(parseFloat(currentPayment.aer)) ? parseFloat(currentPayment.aer) : null;

            currentClaimActivity.payments.beginningCededPaidLoss = !isNaN(parseFloat(currentPayment.beginningCededPaidLoss)) ? parseFloat(currentPayment.beginningCededPaidLoss) : null;
            currentClaimActivity.payments.beginningCededPaidExpense = !isNaN(parseFloat(currentPayment.beginningCededPaidExpense)) ? parseFloat(currentPayment.beginningCededPaidExpense) : null;
            currentClaimActivity.payments.beginningCededLossReserve = !isNaN(parseFloat(currentPayment.beginningCededLossReserve)) ? parseFloat(currentPayment.beginningCededLossReserve) : null;
            currentClaimActivity.payments.beginningCededExpenseReserve = !isNaN(parseFloat(currentPayment.beginningCededExpenseReserve)) ? parseFloat(currentPayment.beginningCededExpenseReserve) : null;
            currentClaimActivity.payments.beginningACR = !isNaN(parseFloat(currentPayment.beginningACR)) ? parseFloat(currentPayment.beginningACR) : null;
            currentClaimActivity.payments.beginningAER = !isNaN(parseFloat(currentPayment.beginningAER)) ? parseFloat(currentPayment.beginningAER) : null;

            let totalPaymentAmount = parseFloat(currentPayment.lossReserveTotal) + parseFloat(currentPayment.expenseReserveTotal)

            let activityCreatorAuthorityPaymentAmount = (activityCreatorAuthorityAmount || {}).paymentAmount || 0;
            if (totalPaymentAmount > parseFloat(activityCreatorAuthorityPaymentAmount)) {
                enqueueSnackbar("This payment exceeds your authority", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                request.currentClaimActivity["taskOwner"] = activityCreatorAuthorityAmount.legalEntityManagerID;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            };

            //let currentCededReserves = Math.abs(parseFloat(currentCededLossReserves)) + Math.abs(parseFloat(currentCededExpenseReserve)) + Math.abs(parseFloat(currentAcr)) + Math.abs(parseFloat(currentAer));
            //let cededReserves = Math.abs(parseFloat(currentPayment.cededLossReserves)) + Math.abs(parseFloat(currentPayment.cededExpenseReserve)) + Math.abs(parseFloat(currentPayment.acr)) + Math.abs(parseFloat(currentPayment.aer));
            let currentCededReserves = parseFloat(currentPayment.beginningCededLossReserve || 0) + parseFloat(currentPayment.beginningCededPaidExpense || 0) + parseFloat(currentPayment.beginningACR || 0) + parseFloat(currentPayment.beginningAER || 0);
            let cededReserves = parseFloat(currentPayment.cededLossReserves) + parseFloat(currentPayment.cededExpenseReserve) + parseFloat(currentPayment.acr) + parseFloat(currentPayment.aer);

            let totalCededReserves = Math.abs(cededReserves - currentCededReserves);
            let activityCreatorAuthorityReserveAmount = (activityCreatorAuthorityAmount || {}).reserveAmount || 0;
            if (totalCededReserves > parseFloat(activityCreatorAuthorityReserveAmount)) {
                enqueueSnackbar("This payment exceeds your authority", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                request.currentClaimActivity["taskOwner"] = activityCreatorAuthorityAmount.legalEntityManagerID;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            }
            currentClaimActivity.payments.mlaAuthorityCheckAmount = cededReserves - currentCededReserves + totalPaymentAmount;
            currentClaimActivity.payments.paymentAuthorityCheckAmount = totalPaymentAmount;
            currentClaimActivity.payments.reserveAuthorityCheckAmount = cededReserves - currentCededReserves;
            request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
            request.currentClaimActivity.taskOwner = currentUser.id;
            let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
            delete activity.workflowTask;
            const result = await saveActivity(activity);
            if ((result.data || {}).saveActivity) {
                await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (result.data || {}).saveActivity.activityID);
                let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
                enqueueSnackbar("Activity has been set to Submitted successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        }

        else {
            enqueueSnackbar("All financials must be entered before you may check authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE) {
        let isValid = await validateWCPaymentReserveActivityForCheckAuthority(formValidator.trigger);
        if (isValid) {
            let result1 = true;
            result1 = await formValidator.trigger("reserveAuthorityCheckAmount");
            if (!result1) {
                enqueueSnackbar("Total Incured Change Amount required.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            const currentClaimActivity = request.currentClaimActivity || {};
            const currentPayment = currentClaimActivity.payments || {};

            currentClaimActivity.payments.lossReserveTotal = !isNaN(parseFloat(currentPayment.lossReserveTotal)) ? parseFloat(currentPayment.lossReserveTotal) : null;
            currentClaimActivity.payments.expenseReserveTotal = !isNaN(parseFloat(currentPayment.expenseReserveTotal)) ? parseFloat(currentPayment.expenseReserveTotal) : null;
            currentClaimActivity.payments.cededPaidLoss = !isNaN(parseFloat(currentPayment.cededPaidLoss)) ? parseFloat(currentPayment.cededPaidLoss) : null;
            currentClaimActivity.payments.cededLossReserves = !isNaN(parseFloat(currentPayment.cededLossReserves)) ? parseFloat(currentPayment.cededLossReserves) : null;
            currentClaimActivity.payments.cededPaidExpense = !isNaN(parseFloat(currentPayment.cededPaidExpense)) ? parseFloat(currentPayment.cededPaidExpense) : null;
            currentClaimActivity.payments.cededExpenseReserve = !isNaN(parseFloat(currentPayment.cededExpenseReserve)) ? parseFloat(currentPayment.cededExpenseReserve) : null;
            currentClaimActivity.payments.acr = !isNaN(parseFloat(currentPayment.acr)) ? parseFloat(currentPayment.acr) : null;
            currentClaimActivity.payments.aer = !isNaN(parseFloat(currentPayment.aer)) ? parseFloat(currentPayment.aer) : null;

            currentClaimActivity.payments.beginningCededPaidLoss = !isNaN(parseFloat(currentPayment.beginningCededPaidLoss)) ? parseFloat(currentPayment.beginningCededPaidLoss) : null;
            currentClaimActivity.payments.beginningCededPaidExpense = !isNaN(parseFloat(currentPayment.beginningCededPaidExpense)) ? parseFloat(currentPayment.beginningCededPaidExpense) : null;
            currentClaimActivity.payments.beginningCededLossReserve = !isNaN(parseFloat(currentPayment.beginningCededLossReserve)) ? parseFloat(currentPayment.beginningCededLossReserve) : null;
            currentClaimActivity.payments.beginningCededExpenseReserve = !isNaN(parseFloat(currentPayment.beginningCededExpenseReserve)) ? parseFloat(currentPayment.beginningCededExpenseReserve) : null;
            currentClaimActivity.payments.beginningACR = !isNaN(parseFloat(currentPayment.beginningACR)) ? parseFloat(currentPayment.beginningACR) : null;
            currentClaimActivity.payments.beginningAER = !isNaN(parseFloat(currentPayment.beginningAER)) ? parseFloat(currentPayment.beginningAER) : null;

            let totalPaymentAmount = parseFloat(currentPayment.lossReserveTotal) + parseFloat(currentPayment.expenseReserveTotal)
            let activityCreatorAuthorityPaymentAmount = (activityCreatorAuthorityAmount || {}).paymentAmount || 0;
            if (Math.abs(totalPaymentAmount) > parseFloat(activityCreatorAuthorityPaymentAmount)) {
                enqueueSnackbar("This payment exceeds your authority", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                request.currentClaimActivity["taskOwner"] = activityCreatorAuthorityAmount.legalEntityManagerID;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            };     
            let totalIncuredAmount = parseFloat(currentPayment.reserveAuthorityCheckAmount || 0)
            let activityCreatorAuthorityReserveAmount = (activityCreatorAuthorityAmount || {}).reserveAmount || 0;
            if (Math.abs(totalIncuredAmount) > parseFloat(activityCreatorAuthorityReserveAmount)) {
                enqueueSnackbar("This payment exceeds your authority", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                request.currentClaimActivity["taskOwner"] = activityCreatorAuthorityAmount.legalEntityManagerID;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            }
            currentClaimActivity.payments.mlaAuthorityCheckAmount = totalIncuredAmount + totalPaymentAmount;
            currentClaimActivity.payments.paymentAuthorityCheckAmount = totalPaymentAmount;
            currentClaimActivity.payments.reserveAuthorityCheckAmount = totalIncuredAmount;
            currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
            currentClaimActivity.taskOwner = currentUser.id;
            let activity = JSON.parse(JSON.stringify(currentClaimActivity));
            delete activity.workflowTask;
            const result = await saveActivity(activity);
            if ((result.data || {}).saveActivity) {
                await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (result.data || {}).saveActivity.activityID);
                let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
                enqueueSnackbar("Activity has been set to Submitted successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        }

        else {
            enqueueSnackbar("All ceded financials must be entered before you may check authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT) {
        let isValid = await validateWCExpenseOnlyPaymentActivityForCheckAuthority(formValidator.trigger);
        if (isValid) {
            let result1 = true;
            result1 = await formValidator.trigger("reserveAuthorityCheckAmount");
            if (!result1) {
                enqueueSnackbar("Transaction Reserve Change Amount required.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            const currentClaimActivity = request.currentClaimActivity || {};
            const currentPayment = currentClaimActivity.payments || {};

            currentClaimActivity.payments.expenseReserveTotal = !isNaN(parseFloat(currentPayment.expenseReserveTotal)) ? parseFloat(currentPayment.expenseReserveTotal) : null;
            currentClaimActivity.payments.cededPaidExpense = !isNaN(parseFloat(currentPayment.cededPaidExpense)) ? parseFloat(currentPayment.cededPaidExpense) : null;
            currentClaimActivity.payments.cededExpenseReserve = !isNaN(parseFloat(currentPayment.cededExpenseReserve)) ? parseFloat(currentPayment.cededExpenseReserve) : null;
            currentClaimActivity.payments.beginningCededPaidExpense = !isNaN(parseFloat(currentPayment.beginningCededPaidExpense)) ? parseFloat(currentPayment.beginningCededPaidExpense) : null;
            currentClaimActivity.payments.beginningCededExpenseReserve = !isNaN(parseFloat(currentPayment.beginningCededExpenseReserve)) ? parseFloat(currentPayment.beginningCededExpenseReserve) : null;

            let totalPaymentAmount = parseFloat(currentPayment.expenseReserveTotal)
            let activityCreatorAuthorityPaymentAmount = (activityCreatorAuthorityAmount || {}).paymentAmount || 0;
            if (Math.abs(totalPaymentAmount) > parseFloat(activityCreatorAuthorityPaymentAmount)) {
                enqueueSnackbar("This payment exceeds your authority", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                request.currentClaimActivity["taskOwner"] = activityCreatorAuthorityAmount.legalEntityManagerID;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            };
            let trasactionReserveChangeAmount = parseFloat(currentPayment.reserveAuthorityCheckAmount || 0)
            let activityCreatorAuthorityReserveAmount = (activityCreatorAuthorityAmount || {}).reserveAmount || 0;
            if (Math.abs(trasactionReserveChangeAmount) > parseFloat(activityCreatorAuthorityReserveAmount)) {
                enqueueSnackbar("This payment exceeds your authority", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                request.currentClaimActivity["taskOwner"] = activityCreatorAuthorityAmount.legalEntityManagerID;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            }
            currentClaimActivity.payments.mlaAuthorityCheckAmount = trasactionReserveChangeAmount;
            currentClaimActivity.payments.paymentAuthorityCheckAmount = totalPaymentAmount;
            currentClaimActivity.payments.reserveAuthorityCheckAmount = trasactionReserveChangeAmount;
            request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
            request.currentClaimActivity.taskOwner = currentUser.id;
            let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
            delete activity.workflowTask;
            const result = await saveActivity(activity);
            if ((result.data || {}).saveActivity) {
                await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (result.data || {}).saveActivity.activityID);
                let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
                enqueueSnackbar("Activity has been set to Submitted successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        }

        else {
            enqueueSnackbar("All ceded financials must be entered before you may check authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE || request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_RESERVE) {
        let isValid = await validateWCTabularUpdateActivityForCheckAuthority(formValidator.trigger);        
        if (isValid) {
            let result = true;
            result = await formValidator.trigger("totalIncuredChangeAmount");            
            if (!result) {
                enqueueSnackbar("Total Incured Change Amount required.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }            
            const currentClaimActivity = request.currentClaimActivity || {};
            const currentWCTabularUpdate = currentClaimActivity.wCTabularUpdate || {};
            let cededIndemnityPaid = (currentWCTabularUpdate.cededIndemnityPaid || 0);
            let cededIndemnityReserves = (currentWCTabularUpdate.cededIndemnityReserves || 0);
            let cededExpensePaid = (currentWCTabularUpdate.cededExpensePaid || 0);
            let cededExpenseReserves = (currentWCTabularUpdate.cededExpenseReserves || 0);
            let cededACR = (currentWCTabularUpdate.cededACR || 0);
            let cededAER = (currentWCTabularUpdate.cededAER || 0);
            let totalIncuredChangeAmount = (currentWCTabularUpdate.totalIncuredChangeAmount || 0);


            request.currentClaimActivity.wCTabularUpdate.beginningIndemnityPaid = !isNaN(parseFloat(currentWCTabularUpdate.beginningIndemnityPaid)) ? parseFloat(currentWCTabularUpdate.beginningIndemnityPaid) : null;
            request.currentClaimActivity.wCTabularUpdate.beginningIndemnityReserves = !isNaN(parseFloat(currentWCTabularUpdate.beginningIndemnityReserves)) ? parseFloat(currentWCTabularUpdate.beginningIndemnityReserves) : null;
            request.currentClaimActivity.wCTabularUpdate.beginningExpensePaid = !isNaN(parseFloat(currentWCTabularUpdate.beginningExpensePaid)) ? parseFloat(currentWCTabularUpdate.beginningExpensePaid) : null;
            request.currentClaimActivity.wCTabularUpdate.beginningExpenseReserves = !isNaN(parseFloat(currentWCTabularUpdate.beginningExpenseReserves)) ? parseFloat(currentWCTabularUpdate.beginningExpenseReserves) : null;
            request.currentClaimActivity.wCTabularUpdate.beginningACR = !isNaN(parseFloat(currentWCTabularUpdate.beginningACR)) ? parseFloat(currentWCTabularUpdate.beginningACR) : null;
            request.currentClaimActivity.wCTabularUpdate.beginningAER = !isNaN(parseFloat(currentWCTabularUpdate.beginningAER)) ? parseFloat(currentWCTabularUpdate.beginningAER) : null;

            request.currentClaimActivity.wCTabularUpdate.cededIndemnityReserves = !isNaN(parseFloat(currentWCTabularUpdate.cededIndemnityReserves)) ? parseFloat(currentWCTabularUpdate.cededIndemnityReserves) : null;
            request.currentClaimActivity.wCTabularUpdate.cededExpenseReserves = !isNaN(parseFloat(currentWCTabularUpdate.cededExpenseReserves)) ? parseFloat(currentWCTabularUpdate.cededExpenseReserves) : null;
            request.currentClaimActivity.wCTabularUpdate.cededACR = !isNaN(parseFloat(currentWCTabularUpdate.cededACR)) ? parseFloat(currentWCTabularUpdate.cededACR) : null;
            request.currentClaimActivity.wCTabularUpdate.cededAER = !isNaN(parseFloat(currentWCTabularUpdate.cededAER)) ? parseFloat(currentWCTabularUpdate.cededAER) : null;
            request.currentClaimActivity.wCTabularUpdate.totalIncuredChangeAmount = !isNaN(parseFloat(currentWCTabularUpdate.totalIncuredChangeAmount)) ? parseFloat(currentWCTabularUpdate.totalIncuredChangeAmount) : null;

            let activityCreatorAuthorityReserveAmount = (activityCreatorAuthorityAmount || {}).reserveAmount || 0;
            if (Math.abs(parseFloat(totalIncuredChangeAmount)) < activityCreatorAuthorityReserveAmount) {
                request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
                request.currentClaimActivity.taskOwner = currentUser.id;
                let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
                delete activity.workflowTask;
                const result = await saveActivity(activity);
                if ((result.data || {}).saveActivity) {
                    await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (result.data || {}).saveActivity.activityID);
                    let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
                    enqueueSnackbar("Activity has been set to Submitted successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                } else {
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
                }
            }
            else {
                request.currentClaimActivity["taskOwner"] = activityCreatorAuthorityAmount.legalEntityManagerID;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                enqueueSnackbar("This reserve change exceeds your authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }

        }
        else {
            enqueueSnackbar("All ceded financials must be entered before you may check authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }
}