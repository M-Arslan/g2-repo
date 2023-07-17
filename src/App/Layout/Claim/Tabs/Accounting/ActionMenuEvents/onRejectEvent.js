import { createActionLogForFinacialActivityType } from '../../../../ActionLog/Queries';
import { createNotification } from '../../../../Notifications/Query/saveNotifications';
import { findAcitivityTypeUIByAcitivityType, findMenusToDisplay, saveActivity, saveWorkFlowTask } from '../Queries';
import { validateApproverSection } from '../Validations/validateFinancial';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { CLAIM_TYPES } from '../../../../../Core/Enumerations/app/claim-type';
import { ACTION_TYPES } from '../../../../../Core/Enumerations/app/action-type';


function ParseGQErrors(errors, error, enqueueSnackbar) {
    if (error || errors) {
        console.log("An error occured: ", errors);
        console.log("An error occured: ", error);
        enqueueSnackbar("An error occured.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    }
}
export const onReject = async (request, claim, users, formValidator, enqueueSnackbar, dispatch, loadActivityView) => {
        let isValid = await validateApproverSection(formValidator.trigger);
        if (((request.currentClaimActivity || {}).workflowTask || {}).comment)
            isValid = true;
        else
            enqueueSnackbar("Please provide comments.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

        if (isValid) {

            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
            request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.REJECTED;

            let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
            delete activity.workflowTask;
            const result = await saveActivity(activity);
            ParseGQErrors(result.errors, result.error);

            if ((result.data || {}).saveActivity) {

                const actionLogResult = await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Reject, (result.data || {}).saveActivity.activityID)
                ParseGQErrors(actionLogResult.errors, actionLogResult.error);

                request.currentClaimActivity.workflowTask.claimStatusTypeID = CLAIM_STATUS_TYPE.REJECTED;
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
                    title: request.currentClaimActivity.accountingTransTypeText + " has been rejected",
                    body: request.currentClaimActivity.accountingTransTypeText + " has been rejected",
                    isHighPriority: false,
                    roleID: null,
                    notificationUsers: [notificationUsers],
                    relatedURL: claimOrLegal + claim.claimMasterID + '/financials#Activity/' + (result.data || {}).saveActivity.activityID
                }

                const notificationResult = await createNotification(notificationRequest);
                ParseGQErrors(notificationResult.errors, notificationResult.error);
             


                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: null, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(-1), isSaving: false, isProcessing: false } });
                enqueueSnackbar("Activity has been rejected successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
                enqueueSnackbar("Unable to reject activity.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }
        }
    }
