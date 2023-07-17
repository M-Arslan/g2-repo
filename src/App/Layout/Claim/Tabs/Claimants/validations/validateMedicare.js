export const validateMedicare = async (triggerValidation) => {
    let isMedicareValid = true, result = true;
    result = await triggerValidation("hICNumber");
    console.log(result);
    if (!result)
        isMedicareValid = result;

    result = await triggerValidation("policyHolderFirstName");
    console.log(result);
    if (!result)
        isMedicareValid = result;

    result = await triggerValidation("policyHolderLastName");
    console.log(result);
    if (!result)
        isMedicareValid = result;

    result = await triggerValidation("dBAName");
    console.log(result);
    if (!result)
        isMedicareValid = result;

    result = await triggerValidation("legalName");
    console.log(result);
    if (!result)
        isMedicareValid = result;

    result = await triggerValidation("productBrandName");
    console.log(result);
    if (!result)
        isMedicareValid = result;

    result = await triggerValidation("productGenericName");
    console.log(result);
    if (!result)
        isMedicareValid = result;

    result = await triggerValidation("productManufacturer");
    console.log(result);
    if (!result)
        isMedicareValid = result;

    result = await triggerValidation("productAllegedHarm");
    console.log(result);
    if (!result)
        isMedicareValid = result;

    result = await triggerValidation("descriptionOfInjury");
    console.log(result);
    if (!result)
        isMedicareValid = result;

    return isMedicareValid;
}