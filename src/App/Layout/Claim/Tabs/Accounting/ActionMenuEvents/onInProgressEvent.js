import { createActionLogForFinacialActivityType } from '../../../../ActionLog/Queries';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { ACTION_TYPES } from '../../../../../Core/Enumerations/app/action-type';

import { saveActivity } from '../Queries';

export const onInProgress = async (request, claim, currentUser, users, formValidator, enqueueSnackbar, dispatch, loadActivityView) => {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.IN_PROGRESS_PI_2;
        request.currentClaimActivity.taskOwner = currentUser.id;
        let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
        delete activity.workflowTask;
        const result = await saveActivity(activity);
        if ((result.data || {}).saveActivity) {
            await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Set_Status_to_Inprogress, (result.data || {}).saveActivity.activityID);
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
            enqueueSnackbar("Activity has been set to in progress successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }
