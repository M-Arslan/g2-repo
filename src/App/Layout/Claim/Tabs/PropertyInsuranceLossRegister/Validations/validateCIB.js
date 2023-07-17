export const validateCIB = async (triggerValidation) => {
    let isValid = true, result = true;
    result = await triggerValidation("cIBLossTypeID");
    if (!result)
        isValid = result;
    result = await triggerValidation("claimCoverageTypeCode");
    if (!result)
        isValid = result;

    result = await triggerValidation("claimantFormerZip");
    if (!result)
        isValid = result;
    result = await triggerValidation("claimantFormerCity");
    if (!result)
        isValid = result;

    result = await triggerValidation("claimantDoctorZip");
    if (!result)
        isValid = result;
    result = await triggerValidation("claimantDoctorCity");
    if (!result)
        isValid = result;

    result = await triggerValidation("claimantAttorneyZip");
    if (!result)
        isValid = result;
    result = await triggerValidation("claimantAttorneyCity");
    if (!result)
        isValid = result;

    result = await triggerValidation("insuredZip");
    if (!result)
        isValid = result;
    result = await triggerValidation("insuredCity");
    if (!result)
        isValid = result;
    return isValid;
}