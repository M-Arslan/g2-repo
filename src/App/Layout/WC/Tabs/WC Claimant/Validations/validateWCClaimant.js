export const validateWCClaimant = async (triggerValidation) => {
    let isClaimantValid = true, result = true;

    result = await triggerValidation("claimantName");
    if (!result)
        isClaimantValid = result;

    result = await triggerValidation("gender");
    if (!result)
        isClaimantValid = result;

    result = await triggerValidation("tabular");
    if (!result)
        isClaimantValid = result;

    return isClaimantValid;
}

