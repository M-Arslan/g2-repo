import { createActionLogForFinacialActivityType } from '../../../../ActionLog/Queries';
import { findAcitivityTypeUIByAcitivityType, loadCloseActivity, saveActivity } from '../Queries';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { ACTION_TYPES } from '../../../../../Core/Enumerations/app/action-type';
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type'
import { validateGenesisMLAActivity} from '../Validations/validateFinancial'

function ParseGQErrors(errors, error, enqueueSnackbar) {
    if (error || errors) {
        console.log("An error occured: ", errors);
        console.log("An error occured: ", error);
        enqueueSnackbar("An error occured.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    }
}
export const onVoid = async (request, claim, enqueueSnackbar, dispatch, loadActivityView, formValidator) => {
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.GENESIS_MLA) {
        let isValid = true;
        isValid = await validateGenesisMLAActivity(formValidator.trigger);
        if (!isValid) {
            return;
        }
    }
    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
    request.currentClaimActivity.claimMasterID = claim.claimMasterID;
    request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.VOID_PI_2;

    let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));

    if (findAcitivityTypeUIByAcitivityType(activity.accountingTransTypeID) === "INITIALRINOTICE" || findAcitivityTypeUIByAcitivityType(activity.accountingTransTypeID) === "DEDUCTIBLECOLLECTION") {
        activity = await loadCloseActivity(activity.activityID);
        activity = JSON.parse(JSON.stringify(activity.data.activity));
        activity.claimMasterID = claim.claimMasterID;
        activity.claimStatusTypeID = CLAIM_STATUS_TYPE.VOID_PI_2;
    }

    delete activity.workflowTask;

    const result = await saveActivity(activity);
    ParseGQErrors(result.errors, result.error);
    if ((result.data || {}).saveActivity) {
        await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Void, (result.data || {}).saveActivity.activityID);
        let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
        enqueueSnackbar("Claim Activity has been updated successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    } else {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
    }

}
