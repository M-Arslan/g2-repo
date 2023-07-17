import { createActionLogForFinacialActivityType } from '../../../../ActionLog/Queries';
import { saveActivity } from '../Queries';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { ACTION_TYPES } from '../../../../../Core/Enumerations/app/action-type';


function ParseGQErrors(errors, error, enqueueSnackbar) {
    if (error || errors) {
        console.log("An error occured: ", errors);
        console.log("An error occured: ", error);
        enqueueSnackbar("An error occured.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    }
}

export const onStatusAlreadyPaid = async (request, claim, enqueueSnackbar, dispatch, loadActivityView) => {
    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
    request.currentClaimActivity.claimMasterID = claim.claimMasterID;
    request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.ALREADY_PAID;
    let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
    delete activity.workflowTask;
    const result = await saveActivity(activity);
    ParseGQErrors(result.errors, result.error);
    if ((result.data || {}).saveActivity) {
        await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Set_Status_to_Already_Paid, (result.data || {}).saveActivity.activityID);
        let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
        enqueueSnackbar("Activity status has been set to already paid successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    } else {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
    }
}
