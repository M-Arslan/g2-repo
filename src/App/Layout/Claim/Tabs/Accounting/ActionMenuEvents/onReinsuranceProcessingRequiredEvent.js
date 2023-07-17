import { createActionLogForFinacialActivityType } from '../../../../ActionLog/Queries';
import { saveActivity } from '../Queries';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { ACTION_TYPES } from '../../../../../Core/Enumerations/app/action-type';


export const onReinsuranceProcessingRequired = async (request, claim, enqueueSnackbar, dispatch, loadActivityView) => {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.REINSURANCE_PROCESSING_REQUIRED;
        let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
        delete activity.workflowTask;
        const result = await saveActivity(activity);
        if ((result.data || {}).saveActivity) {
            await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Reinsurance_Processing_Required, (result.data || {}).saveActivity.activityID);
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
            enqueueSnackbar("Activity has been set to Reinsurance Processing Required successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }
