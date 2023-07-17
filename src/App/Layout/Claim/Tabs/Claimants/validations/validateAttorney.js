export const validateAttorney = async (triggerValidation) => {
    let isAttorneyValid = true, result = true;
    result = await triggerValidation("attorneyPhone");
    if (!result)
        isAttorneyValid = result;
    return isAttorneyValid;
}