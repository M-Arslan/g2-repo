import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const saveActivity = async (activity) => {
    activity.accountingTransTypeID = parseInt(activity.accountingTransTypeID);

    if (activity.hasOwnProperty('openRegistrations')) {

        if (activity.openRegistrations?.lossReserveTotal) {
            activity.openRegistrations.lossReserveTotal = parseFloat(activity.openRegistrations.lossReserveTotal);
        }
        if (activity.openRegistrations?.expenseReserveTotal) {
            activity.openRegistrations.expenseReserveTotal = parseFloat(activity.openRegistrations.expenseReserveTotal);
        }
        if (activity.openRegistrations?.examinerDiaryDate) {
            let prevEXDate = new Date(activity.openRegistrations.examinerDiaryDate);
            activity.openRegistrations.examinerDiaryDate = prevEXDate.toISOString();
        }
        if (activity.openRegistrations?.supervisorDiaryDate) {
            let prevSDDate = new Date(activity.openRegistrations.supervisorDiaryDate);
            activity.openRegistrations.supervisorDiaryDate = prevSDDate.toISOString();
        }

    }
    
    const query = {
        "query": "mutation($activity:ActivitiesInputType!) {saveActivity(activity:$activity){activityID claimMasterID}}",
        "variables": { "activity": activity }
    }

    return await customGQLQuery(`accounting`, query);
}

export const updateClaimStatus = async (claimID, falStatusID) => {
    const query = {
        query: 'mutation{updateClaimStatus(claimID:"' + claimID + '",falStatusID:' + falStatusID+')}',
        variables: null
    }

    return await customGQLQuery(`claim-master`, query);
}


export const saveWorkFlowTask = async (workFlowTask) => {
    const query = {
        "query": "mutation($workFlowTask:WorkFlowTaskInputType!) {saveWorkFlowTask(workFlowTask:$workFlowTask){workflowTaskID}}",
        "variables": { "workFlowTask": workFlowTask }
    }

    return await customGQLQuery(`accounting`, query);
}

export const saveReimbursementPaymentActivity = async (wcReimbursementPaymentActivity) => {
    const query = {
        "query": "mutation($wcReimbursementPaymentActivity:WCReimbursementPaymentActivityInputType!) {saveReimbursementPaymentActivity(wcReimbursementPaymentActivity:$wcReimbursementPaymentActivity){reimbursementPaymentActivityID}}",
        "variables": { "wcReimbursementPaymentActivity": wcReimbursementPaymentActivity }
    }
    return await customGQLQuery("reimbursement-payment-activity", query);
}