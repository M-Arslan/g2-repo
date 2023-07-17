import { createActionLogForDeductibleRequested, createActionLogForFinacialActivityType } from '../../../../ActionLog/Queries';
import { findAcitivityTypeUIByAcitivityType, findMenusToDisplay, saveActivity } from '../Queries';
import { validateCollectDeductible } from '../Validations/validateFinancial';
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { ACTION_TYPES } from '../../../../../Core/Enumerations/app/action-type';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../../Core/Enumerations/app/fal_claim-status-types';


function ParseGQErrors(errors, error, enqueueSnackbar) {
    if (error || errors) {
        enqueueSnackbar("An error occured.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    }
}
export const onCollectDeductibleSubmit1 = async (confirmation, rq, setOpenCollectDeductibleDrawer, onFinancialSave, request, claim, currentUser, formValidator, enqueueSnackbar, dispatch) => {
    if (claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.CLOSED || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.ERROR)
    {
        enqueueSnackbar("Claim status must be assigned.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        return;
    }
    let isValid = await validateCollectDeductible(formValidator.trigger);
    if (isValid) {
        setOpenCollectDeductibleDrawer(false);
        if (confirmation === true) {
            request.currentFinancial.deductibleCollectionAmount = rq.amount;
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
            await onFinancialSave();
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
            let result = null;
            if (request.currentClaimActivity) {
                request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
                delete request.currentClaimActivity.workflowTask;
                result = await saveActivity(request.currentClaimActivity);
                ParseGQErrors(result.errors, result.error, enqueueSnackbar);
            } else
            {
                request.currentClaimActivity = {};
                request.currentClaimActivity.claimMasterID = claim.claimMasterID;
                request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
                request.currentClaimActivity.taskOwner = currentUser.id;
                request.currentClaimActivity.accountingTransTypeID = ACCOUNTING_TRANS_TYPES.DEDUCTIBLE_COLLECTION;
                request.currentClaimActivity.urgent = false;
                request.currentClaimActivity.sendNoticeToReinsurance = false;
                result = await saveActivity(request.currentClaimActivity);
                ParseGQErrors(result.errors, result.error);
            }
            
            if ((result.data || {}).saveActivity) {
                await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (result.data || {}).saveActivity.activityID);
                const actionLog = await createActionLogForDeductibleRequested(claim.claimMasterID);
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, lastDeductibleCollectionActionLog: actionLog.data.create, currentClaimActivity: null, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(-1), isSaving: false, isProcessing: false } });
                enqueueSnackbar("Request Deductible Collection activity has been created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        }
    }
}
