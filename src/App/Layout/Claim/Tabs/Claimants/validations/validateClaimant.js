export const validateClaimant = async (triggerValidation) => {
    let isClaimantValid = true, result = true;

    result = await triggerValidation("lastName");
    if (!result)
        isClaimantValid = result;

    result = await triggerValidation("sSN");
    if (!result)
        isClaimantValid = result;

    result = await triggerValidation("medicareNumber");
    if (!result)
        isClaimantValid = result;

    result = await triggerValidation("addressCity");
    if (!result)
        isClaimantValid = result;

    result = await triggerValidation("addressZIP");
    if (!result)
        isClaimantValid = result;

    result = await triggerValidation("injuries");
    if (!result)
       isClaimantValid = result;

    result = await triggerValidation("occupation");
    if (!result)
       isClaimantValid = result;
    return isClaimantValid;
}

