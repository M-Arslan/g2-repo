import { createActionLogForFinacialActivityType } from '../../../../ActionLog/Queries';
import { createNotification } from '../../../../Notifications/Query/saveNotifications';
import { saveActivity } from '../Queries';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { CLAIM_TYPES } from '../../../../../Core/Enumerations/app/claim-type';
import { ACTION_TYPES } from '../../../../../Core/Enumerations/app/action-type';
//import { validatePaymentClaimActivity, validateWirePayment } from '../Validations/ValidateFinancial';

function ParseGQErrors(errors, error, enqueueSnackbar) {
    if (error || errors) {
        console.log("An error occured: ", error || errors);
        enqueueSnackbar("An error occured.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    }
}
export const onSubmitMLAForApproval = async (request, claim, users, formValidator, enqueueSnackbar, dispatch, loadActivityView, legalClaim) => {

    let isValid = true;

    if (isValid) {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimMasterID = claim.claimMasterID;
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PENDING_APPROVAL;
        request.currentClaimActivity.taskOwner = claim.claimExaminerID;
        let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
        delete activity.workflowTask;

        const result = await saveActivity(activity);
        ParseGQErrors(result.errors, result.error);
        if ((result.data || {}).saveActivity) {
            await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submit_to_CE_for_Approval, (result.data || {}).saveActivity.activityID)
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
            enqueueSnackbar("Payment Activity has been submitted to CE successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

            let notifyUser = (users.filter(x => x.userID.toLowerCase() === ((request.isLegalClaim ? legalClaim.claimCounselUserID : claim.claimExaminerID) || "").toLowerCase())[0] || {});
            const notificationUsers = {
                firstName: notifyUser.firstName,
                lastName: notifyUser.lastName,
                emailAddress: notifyUser.emailAddress,
                networkID: (request.isLegalClaim ? legalClaim.claimCounselUserID : claim.claimExaminerID),
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
                title: request.currentClaimActivity.accountingTransTypeText + " has been submitted for approval",
                body: request.currentClaimActivity.accountingTransTypeText + " has been submitted for approval",
                isHighPriority: false,
                roleID: null,
                notificationUsers: [notificationUsers],
                relatedURL: claimOrLegal + claim.claimMasterID + '/financials#Activity/' + (result.data || {}).saveActivity.activityID
            }

            const notificationResult = await createNotification(notificationRequest);
            ParseGQErrors(notificationResult.errors, notificationResult.error);
            enqueueSnackbar("Notification has sent successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }

}
