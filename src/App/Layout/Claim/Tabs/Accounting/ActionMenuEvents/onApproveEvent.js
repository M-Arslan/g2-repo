import { createActionLogForFinacialActivityType } from '../../../../ActionLog/Queries';
import { createNotification } from '../../../../Notifications/Query/saveNotifications';
import { findAcitivityTypeUIByAcitivityType, findMenusToDisplay, saveActivity, saveWorkFlowTask } from '../Queries';
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_STATUS_TYPE, GENSERVE_CLAIM_STATUS_TYPE  } from '../../../../../Core/Enumerations/app/claim-status-type';
import { CLAIM_TYPES } from '../../../../../Core/Enumerations/app/claim-type';
import { LEGAL_ENTITY } from '../../../../../Core/Enumerations/app/legal-entity';
import { ACTION_TYPES } from '../../../../../Core/Enumerations/app/action-type';
import { STATUTORY_SYSTEM } from '../../../../../Core/Enumerations/app/statutory-system';
import { onCompletedGenesisMLARule } from '../ActionMenuEvents/onCompletedEvent';


function ParseGQErrors(errors, error, enqueueSnackbar) {
    if (error || errors) {
        enqueueSnackbar("An error occured.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    }
}
export const onApprove = async (validateClaimDetailForActivity, request, claim, db2Claim, financialDB2, lossExpenseReserve, authorityAmount, currentUser, users, formValidator, enqueueSnackbar, dispatch, loadActivityView, fsriFinancialDB2, conferFinancialDB2) => {
    let isValid = true;

    if (isValid) {

        if (!authorityAmount) {
            enqueueSnackbar("Authority amount does not exist for current user.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }

        const currentClaimActivity = request.currentClaimActivity || {};
        if (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT || currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT || currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT) {
            let currentPayment = currentClaimActivity.payments || {};

            let sumOfPaymentAmount = 0;
            currentPayment.paymentVendors.map(X => {
                sumOfPaymentAmount = sumOfPaymentAmount + X.paymentAmount;
            });

            if (sumOfPaymentAmount > authorityAmount.paymentAmount) {
                enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
        }
        else if (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.RESERVE) {
            if (claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE || claim.claimType === CLAIM_TYPES.LEGAL) {
                let endingLossReserve = (request.currentClaimActivity.reserveChanges || {}).endingLossReserve || 0;
                let endingExpenseReserve = (request.currentClaimActivity.reserveChanges || {}).endingExpenseReserve || 0;
                let endingMedPayReserve = (request.currentClaimActivity.reserveChanges || {}).endingMedPayReserve || 0;
                let currentLossReserve = (lossExpenseReserve || {}).lossReserves || 0;
                let currentExpenseReserve = (lossExpenseReserve || {}).expenseReserves || 0;
                let currentMedpayReserve = (lossExpenseReserve || {}).medPayLossReserves || 0;

                if (claim.claimType === CLAIM_TYPES.CASUALTY) {
                    let totalAmount = Math.abs((currentLossReserve - endingLossReserve)) + Math.abs((currentExpenseReserve - endingExpenseReserve)) + Math.abs((currentMedpayReserve - endingMedPayReserve));
                    if (totalAmount > authorityAmount.reserveAmount) {
                        enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                        return;
                    }
                }
                if (claim.claimType === CLAIM_TYPES.PROPERTY || claim.claimType === CLAIM_TYPES.LEGAL) {
                    let totalAmount = Math.abs((currentLossReserve - endingLossReserve)) + Math.abs((currentExpenseReserve - endingExpenseReserve));
                    if (totalAmount > authorityAmount.reserveAmount) {
                        enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                        return;
                    }
                }
            }
            else {


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

                //let amountSum = Math.abs(parseFloat(acr)) + Math.abs(parseFloat(cededLossReserves)) + Math.abs(parseFloat(aer)) + Math.abs(parseFloat(cededExpenseReserve));
                //let db2Sum = Math.abs(parseFloat(currentAcr)) + Math.abs(parseFloat(currentCededLossReserves)) + Math.abs(parseFloat(currentAer)) + Math.abs(parseFloat(currentCededExpenseReserve));
                let amountSum = parseFloat(acr) + parseFloat(cededLossReserves) + parseFloat(aer) + parseFloat(cededExpenseReserve);
                let db2Sum = parseFloat(currentAcr) + parseFloat(currentCededLossReserves) + parseFloat(currentAer) + parseFloat(currentCededExpenseReserve);
                let calcAmount = Math.abs(amountSum - db2Sum);
                if (calcAmount > authorityAmount.reserveAmount) {
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                    enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    return;
                }
            }
        }
        else if (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.CLOSE) {
            if (claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE || claim.claimType === CLAIM_TYPES.LEGAL) {
                var expenseReserve = 0;
                var lossReserve = 0;
                let isValid = await validateClaimDetailForActivity();
                if (!isValid)
                    return;

                if ((db2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.OPEN) {
                    if (financialDB2 === null) {
                        enqueueSnackbar("Unable to find Financial Data in GenServe", { variant: 'error', autoHideDuration: 10000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                        return;
                    } else {
                        lossReserve = isNaN(parseFloat(financialDB2.lossReserves)) ? financialDB2.lossReserves : parseFloat(financialDB2.lossReserves);
                        expenseReserve = isNaN(parseFloat(financialDB2.expenseReserves)) ? financialDB2.expenseReserves : parseFloat(financialDB2.expenseReserves);
                    }
                }
                let totalAmount = lossReserve + expenseReserve;
                if (totalAmount > authorityAmount.reserveAmount) {
                    enqueueSnackbar("This reserve change exceeds your authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    return;
                }

            }
            else if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE) {
                if (!(fsriFinancialDB2 || conferFinancialDB2) && claim.statutorySystem !== STATUTORY_SYSTEM.NAT_RE ) {
                    enqueueSnackbar("Unable to find Financial Data in GenServe", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    return;
                }
                let currentClaimActivity = (request.currentClaimActivity || {});
                let currentCloseActivity = (currentClaimActivity.close || {});
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
                let totalAmount = parseInt(lossExpenseReserve.expenseReserves || 0) + parseInt(lossExpenseReserve.lossReserves || 0) + parseInt(lossExpenseReserve.additionalLossRes || 0) + parseInt(lossExpenseReserve.additionalExpenseRes || 0);
                if (parseInt(totalAmount) > authorityAmount.reserveAmount) {
                    enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    return;
                }
            }
        }
        else if (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.REOPEN) {
            let expenseReserveTotal = (request.currentClaimActivity.reopens || {}).endingExpenseReserve || 0;
            let lossReserveTotal = (request.currentClaimActivity.reopens || {}).endingLossReserve || 0;
            let medPayReserveTotal = (request.currentClaimActivity.reopens || {}).endingMedPayReserve || 0;
            let amountSum = parseInt(expenseReserveTotal) + parseInt(lossReserveTotal) + parseInt(medPayReserveTotal);
            if (amountSum > authorityAmount.reserveAmount) {
                enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
        }
        else if (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN) {
            if (claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE || claim.claimType === CLAIM_TYPES.LEGAL) {
                let expenseReserveTotal = ((request.currentClaimActivity.openRegistrations || {}).expenseReserveTotal || 0);
                let lossReserveTotal = ((request.currentClaimActivity.openRegistrations || {}).lossReserveTotal || 0);
                let medPayReserveTotal = ((request.currentClaimActivity.openRegistrations || {}).medPayReserveTotal || 0);
                let amountSum = expenseReserveTotal + lossReserveTotal + medPayReserveTotal;

                if (Math.abs(amountSum) > authorityAmount.reserveAmount) {
                    request.currentClaimActivity.claimMasterID = claim.claimMasterID;
                    request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PENDING_APPROVAL;
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                    enqueueSnackbar("This reserve change exceeds your authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    return;
                }
            }
            else {
                let cededPaidLoss = ((request.currentClaimActivity.openRegistrations || {}).cededPaidLoss || 0);
                let cededLossReserves = ((request.currentClaimActivity.openRegistrations || {}).cededLossReserves || 0);
                let cededPaidExpense = ((request.currentClaimActivity.openRegistrations || {}).cededPaidExpense || 0);
                let cededExpenseReserve = ((request.currentClaimActivity.openRegistrations || {}).cededExpenseReserve || 0);
                let acr = ((request.currentClaimActivity.openRegistrations || {}).acr || 0);
                let aer = ((request.currentClaimActivity.openRegistrations || {}).aer || 0);
                let amountSum = parseFloat(cededPaidLoss) + parseFloat(cededLossReserves) + parseFloat(cededPaidExpense) + parseFloat(cededExpenseReserve) + parseFloat(acr) + parseFloat(aer);
                if (Math.abs(amountSum) > authorityAmount.reserveAmount) {
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                    enqueueSnackbar("This reserve change exceeds your authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    return;
                }
            }
        }
        else if (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT) {            
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
            if (totalPaymentAmount > parseFloat(authorityAmount.paymentAmount)) {
                enqueueSnackbar("This payment exceeds your authority", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            };
            //let currentCededReserves = Math.abs(parseFloat(currentCededLossReserves)) + Math.abs(parseFloat(currentCededExpenseReserve)) + Math.abs(parseFloat(currentAcr)) + Math.abs(parseFloat(currentAer));
            //let cededReserves = Math.abs(parseFloat(currentPayment.cededExpenseReserve)) + Math.abs(parseFloat(currentPayment.cededLossReserves)) + Math.abs(parseFloat(currentPayment.acr)) + Math.abs(parseFloat(currentPayment.aer));
            let currentCededReserves = parseFloat(currentPayment.beginningCededLossReserve || 0) + parseFloat(currentPayment.beginningCededExpenseReserve || 0) + parseFloat(currentPayment.beginningACR || 0) + parseFloat(currentPayment.beginningAER || 0);
            let cededReserves = parseFloat(currentPayment.cededExpenseReserve) + parseFloat(currentPayment.cededLossReserves) + parseFloat(currentPayment.acr) + parseFloat(currentPayment.aer);
            let totalCededReserves = Math.abs(cededReserves - currentCededReserves);
            if (totalCededReserves > parseFloat(authorityAmount.reserveAmount)) {
                enqueueSnackbar("This payment exceeds your authority", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            }
        }
        else if (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE) {
            const currentClaimActivity = request.currentClaimActivity || {};
            const currentPayment = currentClaimActivity.payments || {};

            let totalPaymentAmount = parseFloat(currentPayment.lossReserveTotal) + parseFloat(currentPayment.expenseReserveTotal)

            if (totalPaymentAmount > parseFloat(authorityAmount.paymentAmount)) {
                enqueueSnackbar("This payment exceeds your authority", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            };
            let totalIncuredAmount = parseFloat(currentPayment.reserveAuthorityCheckAmount || 0)
            if (Math.abs(totalIncuredAmount) > parseFloat(authorityAmount.reserveAmount)) {
                enqueueSnackbar("This payment exceeds your authority", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            }
        }
        else if (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT) {
            const currentClaimActivity = request.currentClaimActivity || {};
            const currentPayment = currentClaimActivity.payments || {};

            let totalPaymentAmount = parseFloat(currentPayment.expenseReserveTotal)

            if (totalPaymentAmount > parseFloat(authorityAmount.paymentAmount)) {
                enqueueSnackbar("This payment exceeds your authority", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            };
            let transactionReserveChangeAmount = parseFloat(currentPayment.reserveAuthorityCheckAmount || 0)
            if (Math.abs(transactionReserveChangeAmount) > parseFloat(authorityAmount.reserveAmount)) {
                enqueueSnackbar("This payment exceeds your authority", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            }
        }
        else if (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE || currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_RESERVE) {
            const currentClaimActivity = request.currentClaimActivity || {};
            const currentWCTabularUpdate = currentClaimActivity.wCTabularUpdate || {};
            let totalIncuredChangeAmount = (currentWCTabularUpdate.totalIncuredChangeAmount || 0);


            if (Math.abs(parseFloat(totalIncuredChangeAmount)) > parseFloat(authorityAmount.reserveAmount)) {
                enqueueSnackbar("This payment exceeds your authority", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            };            
        }

        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        if ((request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT || request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.RESERVE) && claim.g2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR) {
            request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PENDING_BOT_PROCESSING;
            request.currentClaimActivity.taskOwner = (authorityAmount || {}).userID || "GRN\\VKathy";

        }
        else {
            request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;          
        }
        if (claim.claimType === CLAIM_TYPES.LEGAL) {
            request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
        }
        let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
        delete activity.workflowTask;
        const result = await saveActivity(activity);
        ParseGQErrors(result.errors, result.error);

        if ((result.data || {}).saveActivity) {
            let approveActionLogResult = await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Approve, (result.data || {}).saveActivity.activityID)                        
            let submitActionLogResult = await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (result.data || {}).saveActivity.activityID)            
            ParseGQErrors(approveActionLogResult.errors, approveActionLogResult.error);
            ParseGQErrors(submitActionLogResult.errors, submitActionLogResult.error);
            if ((request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT || request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.RESERVE) && claim.g2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR) {
                request.currentClaimActivity.workflowTask.claimStatusTypeID = CLAIM_STATUS_TYPE.PENDING_BOT_PROCESSING;
            }
            else {
                request.currentClaimActivity.workflowTask = (request.currentClaimActivity.workflowTask || {});
                request.currentClaimActivity.workflowTask.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
            }
            const workFlowTaskResult = await saveWorkFlowTask(request.currentClaimActivity.workflowTask);
            ParseGQErrors(workFlowTaskResult.errors, workFlowTaskResult.error);

            let notifyUser = (users.filter(x => x.userID.toLowerCase() === ((request.currentClaimActivity || {}).createdBy || "").toLowerCase())[0] || {});
            const notificationUsers = {
                firstName: notifyUser.firstName,
                lastName: notifyUser.lastName,
                emailAddress: notifyUser.emailAddress,
                networkID: request.currentClaimActivity.createdBy,
                statusCode: 'N',
                isCopyOnly: false,
                reminderDate: null
            }
            var claimOrLegal = '/Claim/';
            if (claim.claimType === CLAIM_TYPES.LEGAL) {
                claimOrLegal = '/Legal/'
            }
            const notificationRequest = {
                claimMasterID: claim.claimMasterID,
                typeCode: 'T',
                title: request.currentClaimActivity.accountingTransTypeText + " has been approved",
                body: request.currentClaimActivity.accountingTransTypeText + " has been approved",
                isHighPriority: false,
                roleID: null,
                notificationUsers: [notificationUsers],
                relatedURL: claimOrLegal + claim.claimMasterID + '/financials#Activity/' + (result.data || {}).saveActivity.activityID
            }

            const notificationResult = await createNotification(notificationRequest);
            ParseGQErrors(notificationResult.errors, notificationResult.error);

            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: null, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(-1), isSaving: false, isProcessing: false } });
            enqueueSnackbar("Activity has been approved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            enqueueSnackbar("Unable to approve activity.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }
}