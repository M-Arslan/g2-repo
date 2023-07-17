export const validateAttorney = async (triggerValidation) => {
    let isAttorneyValid = true, result = true;

    result = await triggerValidation("attorneyName");
    if (!result)
        isAttorneyValid = result;

    result = await triggerValidation("attorneyFirmName");
    if (!result)
        isAttorneyValid = result;

    result = await triggerValidation("attorneyAddressStree1");
    if (!result)
        isAttorneyValid = result;

    result = await triggerValidation("attorneyAddressStree2");
    if (!result)
        isAttorneyValid = result;

    result = await triggerValidation("attorneyAddressCity");
    if (!result)
        isAttorneyValid = result;

    result = await triggerValidation("attorneyAddressState");
    if (!result)
        isAttorneyValid = result;

    result = await triggerValidation("attorneyTIN");
    if (!result)
        isAttorneyValid = result;

    result = await triggerValidation("attorneyPhone");
    if (!result)
        isAttorneyValid = result;
    return isAttorneyValid;
}