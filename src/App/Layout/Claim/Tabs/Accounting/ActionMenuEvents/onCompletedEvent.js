import { createActionLogForFinacialActivityType } from '../../../../ActionLog/Queries';
import { loadQALogs, saveActivity } from '../Queries';
import { createNotification } from '../../../../Notifications/Query/saveNotifications';
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { CLAIM_TYPES } from '../../../../../Core/Enumerations/app/claim-type';
import { LEGAL_ENTITY } from '../../../../../Core/Enumerations/app/legal-entity';
import { ACTION_TYPES } from '../../../../../Core/Enumerations/app/action-type';
import { STATUTORY_SYSTEM } from '../../../../../Core/Enumerations/app/statutory-system';
import { PAYMENT_TYPE_CODE } from '../../../../../Core/Enumerations/app/payment-type-code';



function ParseGQErrors(errors, error, enqueueSnackbar) {
    if (error || errors) {
        enqueueSnackbar("An error occured.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    }
}

export const onCompleted = async (request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users) => {
    let qaLogs = await loadQALogs(request.currentClaimActivity.activityID);
    qaLogs = (qaLogs.data.qALogList || []);
    if (qaLogs.length === 0) {
        enqueueSnackbar("Please add QA log first", { variant: 'error', autoHideDuration: 10000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        return;
    }

    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
    request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.COMPLETED_PI_2;
    let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
    delete activity.workflowTask;
    const result = await saveActivity(activity);
    ParseGQErrors(result.errors, result.error);
    if ((result.data || {}).saveActivity) {
        await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Completed, (result.data || {}).saveActivity.activityID)
        await onCompletedGenesisMLARule(request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users);
        let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
    } else {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
    }
}

export const onCompletedGenesisMLARule = async (request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users) => {
    if (![
            ACCOUNTING_TRANS_TYPES.OPEN,
            ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE,
            ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE,
            ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT,
            ACCOUNTING_TRANS_TYPES.WC_RESERVE,
            ACCOUNTING_TRANS_TYPES.CLOSE,
            ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
            ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
            ACCOUNTING_TRANS_TYPES.RESERVE,
            ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT,
            ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT
        ].includes(request.currentClaimActivity.accountingTransTypeID) || claim.claimType === CLAIM_TYPES.LEGAL)
        return;
    if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE && claim.claimType === CLAIM_TYPES.WORKERS_COMP ) {
        return;
    }
    //Open Activity
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN)
    {
        if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_INSURANCE && (claim.claimType === CLAIM_TYPES.PROPERTY || claim.claimType === CLAIM_TYPES.CASUALTY)) {
            let expenseReserveTotal = ((request.currentClaimActivity.openRegistrations || {}).expenseReserveTotal || 0);
            let lossReserveTotal = ((request.currentClaimActivity.openRegistrations || {}).lossReserveTotal || 0);
            let totalAmount = expenseReserveTotal + lossReserveTotal;
            if (Math.abs(totalAmount) > request.mlaThresholdAmount) {
                await createGenesisMLAActivity(request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users, totalAmount);
            }
        }
        else if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && ([CLAIM_TYPES.PROPERTY, CLAIM_TYPES.CASUALTY, CLAIM_TYPES.WORKERS_COMP].includes(claim.claimType))) {
            let cededPaidLoss = ((request.currentClaimActivity.openRegistrations || {}).cededPaidLoss || 0);
            let cededPaidExpense = ((request.currentClaimActivity.openRegistrations || {}).cededPaidExpense || 0);
            let cededLossReserves = ((request.currentClaimActivity.openRegistrations || {}).cededLossReserves || 0);
            let cededExpenseReserve = ((request.currentClaimActivity.openRegistrations || {}).cededExpenseReserve || 0);
            let acr = ((request.currentClaimActivity.openRegistrations || {}).acr || 0);
            let aer = ((request.currentClaimActivity.openRegistrations || {}).aer || 0);
            let totalAmount = parseFloat(cededPaidLoss) + parseFloat(cededPaidExpense) + parseFloat(cededLossReserves) + parseFloat(cededExpenseReserve) + parseFloat(acr) + parseFloat(aer);
            if (Math.abs(totalAmount) > request.mlaThresholdAmount) {
                await createGenesisMLAActivity(request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users, totalAmount);
            }
        }
    }
    //Close Activity
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.CLOSE)
    {
        if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_INSURANCE && (claim.claimType === CLAIM_TYPES.PROPERTY || claim.claimType === CLAIM_TYPES.CASUALTY)) {
            let lossReserve = !isNaN(parseFloat(financialDB2.lossReserves)) ? parseFloat(financialDB2.lossReserves) : 0;
            let expenseReserve = !isNaN(parseFloat(financialDB2.expenseReserves)) ? parseFloat(financialDB2.expenseReserves) : 0;
            let totalAmount = Math.abs(lossReserve) + Math.abs(expenseReserve);
            if (totalAmount > request.mlaThresholdAmount) {
                await createGenesisMLAActivity(request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users, totalAmount);
            }
        }
        else if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && (([CLAIM_TYPES.PROPERTY, CLAIM_TYPES.CASUALTY].includes(claim.claimType) || ([CLAIM_TYPES.WORKERS_COMP].includes(claim.claimType) && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE))))
        {
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
            let totalAmount = Math.abs(parseFloat(lossExpenseReserve.expenseReserves || 0)) + Math.abs(parseFloat(lossExpenseReserve.lossReserves || 0)) + Math.abs(parseFloat(lossExpenseReserve.additionalLossRes || 0)) + Math.abs(parseFloat(lossExpenseReserve.additionalExpenseRes || 0));
            if (totalAmount > request.mlaThresholdAmount) {
                await createGenesisMLAActivity(request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users, totalAmount);
            }

        }
    }
    //Reserve Activity
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.RESERVE) {
        if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_INSURANCE && (claim.claimType === CLAIM_TYPES.PROPERTY || claim.claimType === CLAIM_TYPES.CASUALTY)) {
            let endingLossReserve = (request.currentClaimActivity.reserveChanges || {}).endingLossReserve || 0;
            let endingExpenseReserve = (request.currentClaimActivity.reserveChanges || {}).endingExpenseReserve || 0;
            let currentLossReserve = (lossExpenseReserve || {}).lossReserves || 0;
            let currentExpenseReserve = (lossExpenseReserve || {}).expenseReserves || 0;
            let totalAmount = Math.abs((Math.abs(parseFloat(currentLossReserve)) - Math.abs(parseFloat(endingLossReserve)))) + Math.abs((Math.abs(parseFloat(currentExpenseReserve)) - Math.abs(parseFloat(endingExpenseReserve))));
            if (totalAmount > request.mlaThresholdAmount) {
                await createGenesisMLAActivity(request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users, totalAmount);
            }
        }
        else if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && (claim.claimType === CLAIM_TYPES.PROPERTY || claim.claimType === CLAIM_TYPES.CASUALTY)) {

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



            let actualCededReserves = parseFloat(cededLossReserves || 0) + parseFloat(cededExpenseReserve || 0) + parseFloat(acr || 0) + parseFloat(aer || 0);
            let actualCurrentCededReserves = parseFloat(currentCededLossReserves) + parseFloat(currentCededExpenseReserve) + parseFloat(currentAcr) + parseFloat(currentAer);
            let actualTotalAmount = actualCededReserves - actualCurrentCededReserves;


            //let amountSum = Math.abs(parseFloat(cededLossReserves)) + Math.abs(parseFloat(cededExpenseReserve)) + Math.abs(parseFloat(acr)) + Math.abs(parseFloat(aer));
            //let db2Sum = Math.abs(parseFloat(currentAcr || 0)) + Math.abs(parseFloat(currentCededLossReserves || 0)) + Math.abs(parseFloat(currentAer || 0)) + Math.abs(parseFloat(currentCededExpenseReserve || 0));
            let calcAmount = Math.abs(actualTotalAmount);
            if (calcAmount > request.mlaThresholdAmount) {
                await createGenesisMLAActivity(request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users, actualTotalAmount);
            }
        }
    }
    //Expense Payment Activity
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT) {

        let totalAmount = 0;
        const payment = request.currentClaimActivity.payments;
        if (payment?.paymentTypeCode === PAYMENT_TYPE_CODE.WIRED) {
            totalAmount = (payment.paymentWires || []).reduce((sum, pay) => sum + (pay.wireAmount || 0), 0);
        }
        else {
            totalAmount = (payment.paymentVendors || []).reduce((sum, pay) => sum + (pay.paymentAmount || 0), 0);
        }

        if ([LEGAL_ENTITY.GENESIS_INSURANCE, LEGAL_ENTITY.GENESIS_REINSURANCE].includes(claim.g2LegalEntityID) && [CLAIM_TYPES.PROPERTY, CLAIM_TYPES.CASUALTY].includes(claim.claimType) && totalAmount > request.mlaThresholdAmount) {
            await createGenesisMLAActivity(request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users, totalAmount);
        }
    }

    //Indemnity Payment Activity
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT)
    {
        let totalAmount = 0;
        const payment = request.currentClaimActivity.payments;
        if (payment?.paymentTypeCode === PAYMENT_TYPE_CODE.WIRED) {
            totalAmount = (payment.paymentWires || []).reduce((sum, pay) => sum + (pay.wireAmount || 0), 0);
        }
        else {
            totalAmount = (payment.paymentVendors || []).reduce((sum, pay) => sum + (pay.paymentAmount || 0), 0);
        }

        if ([LEGAL_ENTITY.GENESIS_INSURANCE, LEGAL_ENTITY.GENESIS_REINSURANCE].includes(claim.g2LegalEntityID) && [CLAIM_TYPES.PROPERTY, CLAIM_TYPES.CASUALTY].includes(claim.claimType) && totalAmount > request.mlaThresholdAmount) {
            await createGenesisMLAActivity(request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users, totalAmount);
        }
    }

    //MedPay Payment Activity
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT)
    {
        let totalAmount = 0;
        const payment = request.currentClaimActivity.payments;
        if (payment?.paymentTypeCode === PAYMENT_TYPE_CODE.WIRED) {
            totalAmount = (payment.paymentWires || []).reduce((sum, pay) => sum + (pay.wireAmount || 0), 0);
        }
        else {
            totalAmount = (payment.paymentVendors || []).reduce((sum, pay) => sum + (pay.paymentAmount || 0), 0);
        }

        if ([LEGAL_ENTITY.GENESIS_INSURANCE, LEGAL_ENTITY.GENESIS_REINSURANCE].includes(claim.g2LegalEntityID) && [CLAIM_TYPES.PROPERTY, CLAIM_TYPES.CASUALTY].includes(claim.claimType) && totalAmount > request.mlaThresholdAmount) {
            await createGenesisMLAActivity(request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users, totalAmount);
        }
    }
    
    //Genesis Payment Activity
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT) {
        if (claim.claimType === CLAIM_TYPES.PROPERTY || claim.claimType === CLAIM_TYPES.CASUALTY) {
            const currentClaimActivity = request.currentClaimActivity || {};
            const currentPayment = currentClaimActivity.payments || {};

            let currentCededPaidLoss = null;
            let currentCededLossReserves = null;
            let currentCededPaidExpense = null;
            let currentCededExpenseReserve = null;
            let currentAcr = null;
            let currentAer = null;
            if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.FSRI) {
                currentCededPaidLoss = currentPayment.beginningCededPaidLoss != null ? currentPayment.beginningCededPaidLoss : fsriFinancialDB2.paidLoss;
                currentCededPaidExpense = currentPayment.beginningCededPaidExpense != null ? currentPayment.beginningCededPaidExpense : fsriFinancialDB2.paidExpense;
                currentCededLossReserves = currentPayment.beginningCededLossReserve != null ? currentPayment.beginningCededLossReserve : fsriFinancialDB2.lossReserve;
                currentCededExpenseReserve = currentPayment.beginningCededExpenseReserve != null ? currentPayment.beginningCededExpenseReserve : fsriFinancialDB2.expenseReserve;
                currentAcr = currentPayment.beginningACR != null ? currentPayment.beginningACR : fsriFinancialDB2.additionalLossRes;
                currentAer = currentPayment.beginningAER != null ? currentPayment.beginningAER : fsriFinancialDB2.additionalExpenseRes;

            };
            if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.CONFER) {

                currentCededPaidLoss = currentPayment.beginningCededPaidLoss != null ? currentPayment.beginningCededPaidLoss : conferFinancialDB2.totalPaidLoss;
                currentCededPaidExpense = currentPayment.beginningCededPaidExpense != null ? currentPayment.beginningCededPaidExpense : conferFinancialDB2.totalPaidExpense;
                currentCededLossReserves = currentPayment.beginningCededLossReserve != null ? currentPayment.beginningCededLossReserve : conferFinancialDB2.totalLossReserve;
                currentCededExpenseReserve = currentPayment.beginningCededExpenseReserve != null ? currentPayment.beginningCededExpenseReserve : conferFinancialDB2.totalExpenseReserve;
                currentAcr = currentPayment.beginningACR != null ? currentPayment.beginningACR : conferFinancialDB2.totalACR;
                currentAer = currentPayment.beginningAER != null ? currentPayment.beginningAER : conferFinancialDB2.totalAER;

            };
            currentPayment.lossReserveTotal = !isNaN(parseFloat(currentPayment.lossReserveTotal)) ? parseFloat(currentPayment.lossReserveTotal) : null;
            currentPayment.expenseReserveTotal = !isNaN(parseFloat(currentPayment.expenseReserveTotal)) ? parseFloat(currentPayment.expenseReserveTotal) : null;
            currentPayment.cededLossReserves = !isNaN(parseFloat(currentPayment.cededLossReserves)) ? parseFloat(currentPayment.cededLossReserves) : null;
            currentPayment.cededExpenseReserve = !isNaN(parseFloat(currentPayment.cededExpenseReserve)) ? parseFloat(currentPayment.cededExpenseReserve) : null;
            currentPayment.acr = !isNaN(parseFloat(currentPayment.acr)) ? parseFloat(currentPayment.acr) : null;
            currentPayment.aer = !isNaN(parseFloat(currentPayment.aer)) ? parseFloat(currentPayment.aer) : null;

            let totalPaymentAmount = parseFloat(currentPayment.lossReserveTotal) + parseFloat(currentPayment.expenseReserveTotal)


            let actualCededReserves = parseFloat(currentPayment.cededLossReserves || 0) + parseFloat(currentPayment.cededExpenseReserve || 0) + parseFloat(currentPayment.acr || 0) + parseFloat(currentPayment.aer || 0);
            let actualCurrentCededReserves = parseFloat(currentCededLossReserves) + parseFloat(currentCededExpenseReserve) + parseFloat(currentAcr) + parseFloat(currentAer);
            let actualTotalAmount = actualCededReserves - actualCurrentCededReserves + totalPaymentAmount;

            //let cededReserves = Math.abs(parseFloat(currentPayment.cededLossReserves || 0)) + Math.abs(parseFloat(currentPayment.cededExpenseReserve || 0)) + Math.abs(parseFloat(currentPayment.acr || 0)) + Math.abs(parseFloat(currentPayment.aer || 0));
            //let currentCededReserves = Math.abs(parseFloat(currentCededLossReserves)) + Math.abs(parseFloat(currentCededExpenseReserve)) + Math.abs(parseFloat(currentAcr)) + Math.abs(parseFloat(currentAer));
            //let totalCededReserves = Math.abs(cededReserves - currentCededReserves);
            //let totalAmount = totalCededReserves + totalPaymentAmount;
            let totalAmount = Math.abs(actualTotalAmount);

            if (totalAmount > request.mlaThresholdAmount) {
                await createGenesisMLAActivity(request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users, actualTotalAmount);
            }
        }
    }

    //WC_PAYMENT_RESERVE Activity
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE) {
        if (claim.claimType === CLAIM_TYPES.WORKERS_COMP) {
            const currentClaimActivity = request.currentClaimActivity || {};
            const currentPayment = currentClaimActivity.payments || {};

            let totalPaymentAmount = parseFloat(currentPayment.lossReserveTotal) + parseFloat(currentPayment.expenseReserveTotal)

            let totalIncuredAmount = parseFloat(currentPayment.reserveAuthorityCheckAmount || 0)
            let actualTotalAmount = parseFloat(totalIncuredAmount + totalPaymentAmount);

            //let totalAmount = totalCededReserves + totalPaymentAmount;
            let totalAmount = Math.abs(actualTotalAmount);

            if (totalAmount > request.mlaThresholdAmount) {
                await createGenesisMLAActivity(request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users, actualTotalAmount);
            }
        }
    }

    //WC_EXPENSE_ONLY_PAYMENT Activity
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT) {
        if (claim.claimType === CLAIM_TYPES.WORKERS_COMP) {
            const currentClaimActivity = request.currentClaimActivity || {};
            const currentPayment = currentClaimActivity.payments || {};

            let transactionReserveChangeAmount = parseFloat(currentPayment.reserveAuthorityCheckAmount || 0)
            let actualTotalAmount = parseFloat(transactionReserveChangeAmount);

            //let totalAmount = totalCededReserves + totalPaymentAmount;
            let totalAmount = Math.abs(actualTotalAmount);

            if (totalAmount > request.mlaThresholdAmount) {
                await createGenesisMLAActivity(request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users, actualTotalAmount);
            }
        }
    }

    //WC Tabular Update Activity & WC Reserve Update Activity
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE || request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_RESERVE) {
            const currentClaimActivity = request.currentClaimActivity || {};
            const currentWCTabularUpdate = currentClaimActivity.wCTabularUpdate || {};
            let cededIndemnityPaid = (currentWCTabularUpdate.cededIndemnityPaid || 0);
            let cededIndemnityReserves = (currentWCTabularUpdate.cededIndemnityReserves || 0);
            let cededExpensePaid = (currentWCTabularUpdate.cededExpensePaid || 0);
            let cededExpenseReserves = (currentWCTabularUpdate.cededExpenseReserves || 0);
            let cededACR = (currentWCTabularUpdate.cededACR || 0);
            let cededAER = (currentWCTabularUpdate.cededAER || 0);
            let totalIncuredChangeAmount = (currentWCTabularUpdate.totalIncuredChangeAmount || 0);


            let currentCededPaidLoss = null;
            let currentCededPaidExpense = null;
            let currentCededLossReserves = null;
            let currentCededExpenseReserve = null;
            let currentAcr = null;
            let currentAer = null;
            if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.FSRI) {
                currentCededPaidLoss = currentWCTabularUpdate.beginningIndemnityPaid != null ? currentWCTabularUpdate.beginningIndemnityPaid : fsriFinancialDB2.paidLoss;
                currentCededPaidExpense = currentWCTabularUpdate.beginningIndemnityReserves != null ? currentWCTabularUpdate.beginningIndemnityReserves : fsriFinancialDB2.paidExpense;
                currentCededLossReserves = currentWCTabularUpdate.beginningExpensePaid != null ? currentWCTabularUpdate.beginningExpensePaid : fsriFinancialDB2.lossReserve;
                currentCededExpenseReserve = currentWCTabularUpdate.beginningExpenseReserves != null ? currentWCTabularUpdate.beginningExpenseReserves : fsriFinancialDB2.expenseReserve;
                currentAcr = currentWCTabularUpdate.beginningACR != null ? currentWCTabularUpdate.beginningACR : fsriFinancialDB2.additionalLossRes;
                currentAer = currentWCTabularUpdate.beginningAER != null ? currentWCTabularUpdate.beginningAER : fsriFinancialDB2.additionalExpenseRes;

            };
            if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.CONFER) {

                currentCededPaidLoss = currentWCTabularUpdate.beginningIndemnityPaid != null ? currentWCTabularUpdate.beginningIndemnityPaid : conferFinancialDB2.totalPaidLoss;
                currentCededPaidExpense = currentWCTabularUpdate.beginningIndemnityReserves != null ? currentWCTabularUpdate.beginningIndemnityReserves : conferFinancialDB2.totalPaidExpense;
                currentCededLossReserves = currentWCTabularUpdate.beginningExpensePaid != null ? currentWCTabularUpdate.beginningExpensePaid : conferFinancialDB2.totalLossReserve;
                currentCededExpenseReserve = currentWCTabularUpdate.beginningExpenseReserves != null ? currentWCTabularUpdate.beginningExpenseReserves : conferFinancialDB2.totalExpenseReserve;
                currentAcr = currentWCTabularUpdate.beginningACR != null ? currentWCTabularUpdate.beginningACR : conferFinancialDB2.totalACR;
                currentAer = currentWCTabularUpdate.beginningAER != null ? currentWCTabularUpdate.beginningAER : conferFinancialDB2.totalAER;

            };
            let totalAmount = Math.abs(totalIncuredChangeAmount);

        if (totalAmount > request.mlaThresholdAmount) {
                await createGenesisMLAActivity(request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users, totalIncuredChangeAmount);
            }
        
    }

}


export const createGenesisMLAActivity = async (request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users, actualTotalAmount) =>
{
    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
    let currentClaimActivity = {};
    currentClaimActivity.accountingTransTypeID = ACCOUNTING_TRANS_TYPES.GENESIS_MLA;
    currentClaimActivity.claimMasterID = claim.claimMasterID;
    currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.NEW_PI_2;
    currentClaimActivity.taskOwner = currentUser.id;
    currentClaimActivity.urgent = false;
    currentClaimActivity.sendNoticeToReinsurance = false;
    currentClaimActivity.qAGenServeChecked = false;
    currentClaimActivity.qAConferChecked = false;
    currentClaimActivity.qAFRSIChecked = false;


    currentClaimActivity.genesisMLA = {};
    currentClaimActivity.genesisMLA.claimMasterID = claim.claimMasterID;
    currentClaimActivity.genesisMLA.associatedActivityID = request.currentClaimActivity.activityID;
    currentClaimActivity.genesisMLA.associatedActivityAmount = actualTotalAmount

    const result = await saveActivity(currentClaimActivity);
    ParseGQErrors(result.errors, result.error, enqueueSnackbar);
    if ((result.data || {}).saveActivity) {
        createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.New, (result.data || {}).saveActivity.activityID)
        enqueueSnackbar("Genesis MLA Activity has been created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        //let notifyUser = (users.filter(x => x.userID.toLowerCase() == ((request.currentClaimActivity || {}).taskOwner || "").toLowerCase())[0] || {});
        let notifyUser = (users.filter(x => x.userID.toLowerCase() === (claim.claimExaminerID || "").toLowerCase()))[0] || {};
        
        //let notifyUser = currentUser;
        const notificationUsers = {
            firstName: notifyUser.firstName,
            lastName: notifyUser.lastName,
            emailAddress: notifyUser.emailAddress,
            networkID: claim.claimExaminerID,
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
            title: "A financial activity on " + claim.claimID+" has triggered the MLA process. Please complete an MLA here",
            body: "A financial activity on " + claim.claimID +" has triggered the MLA process. Please complete an MLA here",
            isHighPriority: false,
            roleID: null,
            notificationUsers: [notificationUsers],
            relatedURL: claimOrLegal + claim.claimMasterID + '/financials#Activity/' + (result.data || {}).saveActivity.activityID
        }

        const notificationResult = await createNotification(notificationRequest);

    }

}
