export const validatePayment = async (triggerValidation) => {
    let isPaymentValid = true, result = true;
    result = await triggerValidation("tPOCComment");
    if (!result)
        isPaymentValid = result;
    return isPaymentValid;
}