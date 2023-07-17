import { createActionLogForFinacialActivityType } from '../../../../ActionLog/Queries';
import { createNotification } from '../../../../Notifications/Query/saveNotifications';
import { saveActivity } from '../Queries';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { CLAIM_TYPES } from '../../../../../Core/Enumerations/app/claim-type';
import { ACTION_TYPES } from '../../../../../Core/Enumerations/app/action-type';
import { ROLES } from '../../../../../Core/Enumerations/security/roles';


function ParseGQErrors(errors, error, enqueueSnackbar) {
    if (error || errors) {
        console.log("An error occured: ", errors);
        console.log("An error occured: ", error);
        enqueueSnackbar("An error occured.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    }
}

export const onVendorSetupComplete = async (request, claim, users, formValidator, enqueueSnackbar, dispatch, loadActivityView) => {

    let expenseAdmin = users.filter(userR => userR.userRoles.some((ur) => [ROLES.Expense_Admin].includes(ur.roleID)));
    if (expenseAdmin.length === 0) {
        enqueueSnackbar("No expense admin found.Please first assign Expense Admin role to user.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        return;
    }

    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
    request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.VENDOR_SETUP_COMPLETE;
    request.currentClaimActivity.taskOwner = (expenseAdmin || [{}])[0].userID;


    let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
    delete activity.workflowTask;
    const result = await saveActivity(activity);
    ParseGQErrors(result.errors, result.error);

    if ((result.data || {}).saveActivity) {

        const actionLogResult = await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Set_Status_to_Vendor_setup_completed, (result.data || {}).saveActivity.activityID)
        ParseGQErrors(actionLogResult.errors, actionLogResult.error);

        //const notificationUsers = {
        //    firstName: "",
        //    lastName: "",
        //    emailAddress: "",
        //    networkID: expenseAdmin,
        //    statusCode: 'N',
        //    isCopyOnly: false,
        //    reminderDate: null
        //}

        let notificationUsers = [];
        expenseAdmin.filter(e => {
            notificationUsers.push({ 'networkID': e.userID, "emailAddress": e.emailAddress, "firstName": e.firstName, "lastName": e.lastName, "reminderDate": null, "isCopyOnly": false, "statusCode": 'N' });
        });

        var claimOrLegal = '/Claim/';
        if (claim.claimType === CLAIM_TYPES.LEGAL) {
            claimOrLegal = '/Legal/'
        }
        const notificationRequest = {
            claimMasterID: claim.claimMasterID,
            typeCode: 'T',
            title: request.currentClaimActivity.accountingTransTypeText + " Vendor Setup has been Completed",
            body: request.currentClaimActivity.accountingTransTypeText + " Vendor Setup has been Completed",
            isHighPriority: false,
            roleID: null,
            notificationUsers: notificationUsers,
            relatedURL: claimOrLegal + claim.claimMasterID + '/financials#Activity/' + (result.data || {}).saveActivity.activityID
        }

        const notificationResult = await createNotification(notificationRequest);
        ParseGQErrors(notificationResult.errors, notificationResult.error);

        let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
        enqueueSnackbar("Vendor Setup has been successfully completed.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    } else {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        enqueueSnackbar("Unable to complete vendor setup.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    }
}
