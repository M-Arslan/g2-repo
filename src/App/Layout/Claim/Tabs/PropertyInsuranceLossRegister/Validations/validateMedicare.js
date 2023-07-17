export const validateMedicare = async (triggerValidation) => {
    let isMedicareValid = true, result = true;
    result = await triggerValidation("hICNumber");
    if (!result)
        isMedicareValid = result;

    result = await triggerValidation("policyHolderFirstName");
    if (!result)
        isMedicareValid = result;

    result = await triggerValidation("policyHolderLastName");
    if (!result)
        isMedicareValid = result;

    result = await triggerValidation("dBAName");
    if (!result)
        isMedicareValid = result;

    result = await triggerValidation("legalName");
    if (!result)
        isMedicareValid = result;

    result = await triggerValidation("productBrandName");
    if (!result)
        isMedicareValid = result;

    result = await triggerValidation("productGenericName");
    if (!result)
        isMedicareValid = result;

    result = await triggerValidation("productManufacturer");
    if (!result)
        isMedicareValid = result;

    result = await triggerValidation("productAllegedHarm");
    if (!result)
        isMedicareValid = result;

    result = await triggerValidation("descriptionOfInjury");
    if (!result)
        isMedicareValid = result;

    return isMedicareValid;
}