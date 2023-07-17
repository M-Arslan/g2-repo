import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
export const ShowCreateMenu = (request) => {
    return !request.editMode;
}
export const ShowProcessingInProgressMenu = (request) => {
    return request.currentClaimActivity
        && request.currentClaimActivity.activityID
        && (
            parseInt(request.currentClaimActivity.claimStatusTypeID) === CLAIM_STATUS_TYPE.ERROR_PI_2
            || parseInt(request.currentClaimActivity.claimStatusTypeID) === CLAIM_STATUS_TYPE.SUBMITTED
        )
        && request.isClaimAccountant;
}
export const ShowProcessingCompleteMenu = (request) => {
    return request.currentClaimActivity
        && request.currentClaimActivity.activityID
        && (
            parseInt(request.currentClaimActivity.claimStatusTypeID) === CLAIM_STATUS_TYPE.ERROR_PI_2
            || parseInt(request.currentClaimActivity.claimStatusTypeID) === CLAIM_STATUS_TYPE.SUBMITTED
            || parseInt(request.currentClaimActivity.claimStatusTypeID) === CLAIM_STATUS_TYPE.PROCESSING_IN_PROGRESS
        )
        && request.isClaimAccountant;
}
export const ShowReinsuranceProcessingRequiredMenu = (request) => {
    return request.currentClaimActivity
        && request.currentClaimActivity.activityID
        && (parseInt(request.currentClaimActivity.claimStatusTypeID) === CLAIM_STATUS_TYPE.SUBMITTED || parseInt(request.currentClaimActivity.claimStatusTypeID) === CLAIM_STATUS_TYPE.PENDING_BOT_PROCESSING || parseInt(request.currentClaimActivity.claimStatusTypeID) === CLAIM_STATUS_TYPE.PROCESSING_IN_PROGRESS)
        && request.isClaimAccountant;
}
export const ShowFlagAsIssueMenu = (request) => {
    return request.currentClaimActivity
        && request.currentClaimActivity.activityID
        &&
        (
            parseInt(request.currentClaimActivity.claimStatusTypeID) === CLAIM_STATUS_TYPE.SUBMITTED
            || parseInt(request.currentClaimActivity.claimStatusTypeID) === CLAIM_STATUS_TYPE.PROCESSING_IN_PROGRESS
        )
        && request.isClaimAccountant;
}
export const ShowRejectedMenu = (request) => {
    return request.currentClaimActivity
        && request.currentClaimActivity.activityID
        &&
        (
            parseInt(request.currentClaimActivity.claimStatusTypeID) === CLAIM_STATUS_TYPE.SUBMITTED
            || parseInt(request.currentClaimActivity.claimStatusTypeID) === CLAIM_STATUS_TYPE.PROCESSING_IN_PROGRESS
        )
        && request.isClaimAccountant;
}
export const ShowSubmitMenu = (request) => {
    return request.editMode
        && (
            !request.currentPropertyInsuranceLossRegister.propertyInsuranceLossRegisterID
            || parseInt(request.currentClaimActivity.claimStatusTypeID) === CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE
        );
}
export const ShowVoidMenu = (request) => {
    return request.currentClaimActivity
        && parseInt(request.currentClaimActivity.claimStatusTypeID) === CLAIM_STATUS_TYPE.SUBMITTED;
}
export const ShowActionMenu = (request, currentUser) => {
    return ShowCreateMenu(request)
        || ShowProcessingInProgressMenu(request)
        || ShowProcessingCompleteMenu(request)
        || ShowReinsuranceProcessingRequiredMenu(request)
        || ShowFlagAsIssueMenu(request)
        || ShowRejectedMenu(request)
        || ShowSubmitMenu(request)
        || ShowVoidMenu(request);
}