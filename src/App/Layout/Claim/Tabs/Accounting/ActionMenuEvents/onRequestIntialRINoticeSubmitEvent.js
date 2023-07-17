import { createActionLogForFinacialActivityType, createActionLogForInitialRiRequest } from '../../../../ActionLog/Queries';
import { findAcitivityTypeUIByAcitivityType, findMenusToDisplay, saveActivity } from '../Queries';
import { validateInitialRINoticeRequested } from '../Validations/validateFinancial';
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { ACTION_TYPES } from '../../../../../Core/Enumerations/app/action-type';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../../Core/Enumerations/app/fal_claim-status-types';


function ParseGQErrors(errors, error, enqueueSnackbar) {
    if (error || errors) {
        console.log("An error occured: ", errors);
        console.log("An error occured: ", error);
        enqueueSnackbar("An error occured.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    }
}
export const onRequestIntialRINoticeSubmit1 = async (confirmation, rq, setOpenRequestInitialRi, onFinancialSave, request, claim, currentUser, formValidator, enqueueSnackbar, dispatch) => {
    if (claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.CLOSED || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.ERROR) {
        enqueueSnackbar("Claim status must be assigned.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        return;
    }
    let isValid = await validateInitialRINoticeRequested(formValidator.trigger);
    if (isValid) {
        setOpenRequestInitialRi(false);
        if (confirmation === true) {
            request.currentFinancial.initialRINoticeComment = rq.comments;
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
            await onFinancialSave();
            let result = null;
            if (request.currentClaimActivity) {
                request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
                delete request.currentClaimActivity.workflowTask;
                result = await saveActivity(request.currentClaimActivity);
                ParseGQErrors(result.errors, result.error, enqueueSnackbar);
            }
            else {

                request.currentClaimActivity = {};
                request.currentClaimActivity.claimMasterID = claim.claimMasterID;
                request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
                request.currentClaimActivity.taskOwner = currentUser.id;
                request.currentClaimActivity.accountingTransTypeID = ACCOUNTING_TRANS_TYPES.INITIAL_RI_NOTICE;
                request.currentClaimActivity.urgent = false;
                request.currentClaimActivity.sendNoticeToReinsurance = false;
                delete request.currentClaimActivity.workflowTask;
                result = await saveActivity(request.currentClaimActivity);
                ParseGQErrors(result.errors, result.error, enqueueSnackbar);
            }
            if ((result.data || {}).saveActivity) {
                await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (result.data || {}).saveActivity.activityID)
                const actionLog = await createActionLogForInitialRiRequest(claim.claimMasterID);
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, lastInitialRINoticeActionLog: actionLog.data.create, currentClaimActivity: null, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(-1), isSaving: false, isProcessing: false } });
                enqueueSnackbar("Request Intial R/I Notice activity has been created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        }
    }
}
