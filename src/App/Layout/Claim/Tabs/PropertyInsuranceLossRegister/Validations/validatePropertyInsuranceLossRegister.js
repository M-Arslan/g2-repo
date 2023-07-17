export const validatePropertyInsuranceLossRegister = async (triggerValidation) => {
    let isValid = true, result = true;
    result = await triggerValidation("companyCodeRef");
    if (!result)
        isValid = result;

    result = await triggerValidation("policyType");
    if (!result)
        isValid = result;

    result = await triggerValidation("lossAddressStreet1");
    if (!result)
        isValid = result;

    result = await triggerValidation("lossAddressCity");
    if (!result)
        isValid = result;

    result = await triggerValidation("lossAddressState");
    if (!result)
        isValid = result;

    result = await triggerValidation("lossAddressZIP");
    if (!result)
        isValid = result;

    result = await triggerValidation("lossDesc");
    if (!result)
        isValid = result;

    result = await triggerValidation("insuredRole");
    if (!result)
        isValid = result;

    result = await triggerValidation("insuredBusiness");
    if (!result)
       isValid = result;

    result = await triggerValidation("insuredAddressStreet1");
    if (!result)
       isValid = result;

    result = await triggerValidation("insuredAddressCity");
    if (!result)
       isValid = result;

    result = await triggerValidation("insuredAddressState");
    if (!result)
       isValid = result;

    result = await triggerValidation("insuredAddressZIP");
    if (!result)
       isValid = result;

    result = await triggerValidation("causeOfLossCode");
    if (!result)
       isValid = result;

    result = await triggerValidation("propertyLost");
    if (!result)
       isValid = result;


    return isValid;
}

