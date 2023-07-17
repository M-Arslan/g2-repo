import { createActionLogForFinacialActivityType } from '../../../../ActionLog/Queries';
import { findAcitivityTypeUIByAcitivityType, findMenusToDisplay, getQAPendingRandom, saveActivity } from '../Queries';
import {
    onCompletedGenesisMLARule
} from './onCompletedEvent';
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { ACTION_TYPES } from '../../../../../Core/Enumerations/app/action-type';


const getRandomNumber = (maximum_number) => {
    return Math.floor(Math.random() * Math.floor(maximum_number));
}
const SaveQAPending = async (request, claim, enqueueSnackbar, dispatch) => {
    request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.QA_PENDING;
    let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
    delete activity.workflowTask;
    const result = await saveActivity(activity);
    if ((result.data || {}).saveActivity) {
        createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.QA_Pending, (result.data || {}).saveActivity.activityID)
        //dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, selectedMenu: "QAUI", isSaving: false, isProcessing: false } });
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: null, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(-1), isSaving: false, isProcessing: false } });

        enqueueSnackbar("Activity has been saved as QA Pending.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    } else {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
    }
}

export const onProcessingCompleted = async (request, claim, lossExpenseReserve,  currentUser, users, enqueueSnackbar, dispatch, loadActivityView, financialDB2, fsriFinancialDB2, conferFinancialDB2) => {
    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });

    let canQAPending = request.actionLogList.filter(X => X.actionTypeID === ACTION_TYPES.Successfully_Processed_by_Bot).length === 0;
    //Open QA Check
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN) {
        let lossReserve = request.currentClaimActivity.openRegistrations.lossReserveTotal;
        let expenseReserve = request.currentClaimActivity.openRegistrations.expenseReserveTotal;
        if ((lossReserve >= 150000 || expenseReserve >= 50000)&& canQAPending) {
            SaveQAPending(request, claim, enqueueSnackbar, dispatch);
            return;
        }
    }
    //Reopen QA Check
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.REOPEN) {
        let lossReserve = request.currentClaimActivity.reopens.endingLossReserve;
        let expenseReserve = request.currentClaimActivity.reopens.endingExpenseReserve;
        if ((lossReserve >= 150000 || expenseReserve >= 50000) && canQAPending) {
            SaveQAPending(request, claim, enqueueSnackbar, dispatch);
            return;
        }
    }

    // Reserve Check
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.RESERVE) {
        let initialLossReserve = lossExpenseReserve.lossReserves;
        let initialExpenseReserve = lossExpenseReserve.expenseReserves;

        let endingLossReserve = request.currentClaimActivity.reserveChanges.endingLossReserve;
        let endingExpenseReserve = request.currentClaimActivity.reserveChanges.endingExpenseReserve;

        let totalLossReserve = initialLossReserve - endingLossReserve;
        let totalExpenseReserve = initialExpenseReserve - endingExpenseReserve;

        if ((totalLossReserve >= 150000 || totalExpenseReserve >= 50000) && canQAPending) {
            SaveQAPending(request, claim, enqueueSnackbar, dispatch);
            return;
        }
    }
    //Expense Payment QA Check
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT) {
        let vendors = request.currentClaimActivity.payments.paymentVendors;

        let paymentSum = 0;
        vendors.filter(function (payment) {
            paymentSum = paymentSum + payment.paymentAmount;
        });

        if (paymentSum >= 50000 && canQAPending) {
            SaveQAPending(request, claim, enqueueSnackbar, dispatch);
            return;
        }
    }
    //Indemnity Payment QA Checked
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT) {
        let payments = request.currentClaimActivity.payments.paymentVendors;
        let paymentSum = 0;
        payments.filter(function (payment) {
            paymentSum = paymentSum + payment.paymentAmount;
        });

        if (paymentSum >= 100000 && canQAPending) {
            SaveQAPending(request, claim, enqueueSnackbar, dispatch);
            return;
        }

    }
    let number = getRandomNumber(100);
    let qAPendingRandomNumber = await getQAPendingRandom();
    if (number <= parseInt(qAPendingRandomNumber) && canQAPending) {
        SaveQAPending(request, claim, enqueueSnackbar, dispatch);
        return;
    }
    request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.COMPLETED_PI_2;
    let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
    delete activity.workflowTask;
    const result = await saveActivity(activity);
    if ((result.data || {}).saveActivity) {
        enqueueSnackbar("Activity updated successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Processing_Complete, (result.data || {}).saveActivity.activityID)
        await onCompletedGenesisMLARule(request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users);
        //let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
        //dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: null, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(-1), isSaving: false, isProcessing: false } });
    } else {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
    }
}
