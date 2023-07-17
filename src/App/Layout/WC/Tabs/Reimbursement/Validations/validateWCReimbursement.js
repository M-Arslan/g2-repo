export const validateWCReimbursement = async (triggerValidation) => {
    let isReimbursementValid = true, result = true;

    result = await triggerValidation("payeeName");
    if (!result)
        isReimbursementValid = result;

    result = await triggerValidation("vendorNumber");
    if (!result)
        isReimbursementValid = result;

    result = await triggerValidation("mailingStreetAddress");
    if (!result)
        isReimbursementValid = result;

    result = await triggerValidation("mailingStreetCity");
    if (!result)
        isReimbursementValid = result;

    result = await triggerValidation("mailingStreetState");
    if (!result)
        isReimbursementValid = result;

    result = await triggerValidation("mailingStreetZip");
    if (!result)
        isReimbursementValid = result;

    result = await triggerValidation("email");
    if (!result)
        isReimbursementValid = result;

    return isReimbursementValid;
}

