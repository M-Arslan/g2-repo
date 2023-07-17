import { createActionLogForFinacialActivityType } from '../../../../ActionLog/Queries';
import { createNotification } from '../../../../Notifications/Query/saveNotifications';
import { saveActivity } from '../Queries';
import { validatePaymentClaimActivity, validateWirePayment } from '../Validations/validateFinancial';
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { CLAIM_TYPES } from '../../../../../Core/Enumerations/app/claim-type';
import { ACTION_TYPES } from '../../../../../Core/Enumerations/app/action-type';
import { PAYMENT_TYPE_CODE } from '../../../../../Core/Enumerations/app/payment-type-code';


function ParseGQErrors(errors, error, enqueueSnackbar) {
    if (error || errors) {
        console.log("An error occured: ", errors);
        console.log("An error occured: ", error);
        enqueueSnackbar("An error occured.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    }
}
export const onSubmitToCE = async (request, claim, users, formValidator, enqueueSnackbar, dispatch, loadActivityView, legalClaim) => {

    if (request.isLegalClaim && !legalClaim.claimCounselUserID) {
        enqueueSnackbar("Please assign claim counsel first.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        return;
    }
    else if (!request.isLegalClaim && !claim.claimExaminerID) {
        enqueueSnackbar("Please assign claim examiner first.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        return;
    }
    
    const currentClaimActivity = request.currentClaimActivity || {};
    const currentPayment = currentClaimActivity.payments || {};
    if ((currentPayment.paymentVendors || []).length === 0) {
        if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT)
            enqueueSnackbar("A vendor must be selected.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        else
            enqueueSnackbar("All Payee details must be entered.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        return;
    }

    currentPayment.paymentWires = currentPayment.paymentWires || [{}];

    let currentWirePayment = (currentPayment.paymentWires || [{}])[0];
    currentWirePayment = !currentWirePayment ? {} : currentWirePayment;

    let currentVendor = {};
    if (currentPayment.paymentTypeCode !== PAYMENT_TYPE_CODE.WIRED) {
        currentVendor = currentPayment.paymentVendors[0];
    }
    else {
        currentVendor = currentWirePayment.paymentVendorID ? currentPayment.paymentVendors.filter(X => X.paymentVendorID === currentWirePayment.paymentVendorID)[0] : {};
    }


    let isValid = true;
    if (request.selectedMenu === "EXPENSEPAYMENTCLAIMACTIVITY") {
        isValid = await validatePaymentClaimActivity(formValidator.trigger);
    }

    if (request.selectedMenu === "WIREPAYMENTDETAILS") {
        isValid = await validateWirePayment(currentWirePayment, formValidator.trigger);
    }
    else {
        if (currentPayment.paymentTypeCode === PAYMENT_TYPE_CODE.WIRED) {
            if (!currentWirePayment.paymentVendorID || !currentVendor) {
                if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT)
                    enqueueSnackbar("Vendor is required in Wire Payment.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                else
                    enqueueSnackbar("Payee is required in Wire Payment.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid = false;
            }
            if (!currentWirePayment.wireCurrencyISO) {
                enqueueSnackbar("Wire Currency is required in Wire Payment.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid = false;
            }
            if (!currentWirePayment.wireAmount) {
                enqueueSnackbar("Wire Amount is required in Wire Payment.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid = false;
            }
            if (!currentWirePayment.bankName) {
                enqueueSnackbar("Bank Name is required in Wire Payment.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid = false;
            }
        }
    }

    if (isValid) {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimMasterID = claim.claimMasterID;
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMIT_TO_CE_FOR_APPROVAL;
        request.currentClaimActivity.taskOwner = request.isLegalClaim ? legalClaim.claimCounselUserID : claim.claimExaminerID;
        let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
        delete activity.workflowTask;
        if (currentPayment.paymentTypeCode !== PAYMENT_TYPE_CODE.WIRED || !currentWirePayment.paymentVendorID)
            delete activity.payments.paymentWires;

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
                networkID: (request.isLegalClaim ? legalClaim.claimCounselUserID : claim.claimExaminerID) ,
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
            enqueueSnackbar("Notification has sent to CE successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }

}
