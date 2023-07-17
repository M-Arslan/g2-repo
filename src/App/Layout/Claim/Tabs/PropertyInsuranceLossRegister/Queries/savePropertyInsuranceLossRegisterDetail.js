import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const savePropertyInsuranceLossRegisterDetail = async (propertyInsuranceLossRegister) => {

    propertyInsuranceLossRegister.amountOfPolicyBuilding = parseFloat(propertyInsuranceLossRegister.amountOfPolicyBuilding);
    propertyInsuranceLossRegister.amountOfPolicyContents = parseFloat(propertyInsuranceLossRegister.amountOfPolicyContents);
    propertyInsuranceLossRegister.amountOfPolicyStock = parseFloat(propertyInsuranceLossRegister.amountOfPolicyStock);
    propertyInsuranceLossRegister.amountOfPolicyUseAndOccupancy = parseFloat(propertyInsuranceLossRegister.amountOfPolicyUseAndOccupancy);
    propertyInsuranceLossRegister.amountOfPolicyOtherScehduled = parseFloat(propertyInsuranceLossRegister.amountOfPolicyOtherScehduled);

    propertyInsuranceLossRegister.estimatedLossUseAndOccupancy = parseFloat(propertyInsuranceLossRegister.estimatedLossUseAndOccupancy);
    propertyInsuranceLossRegister.estimatedLossStock = parseFloat(propertyInsuranceLossRegister.estimatedLossStock);
    propertyInsuranceLossRegister.estimatedLossOtherScehduled = parseFloat(propertyInsuranceLossRegister.estimatedLossOtherScehduled);
    propertyInsuranceLossRegister.estimatedLossContents = parseFloat(propertyInsuranceLossRegister.estimatedLossContents);
    propertyInsuranceLossRegister.estimatedLossBuilding = parseFloat(propertyInsuranceLossRegister.estimatedLossBuilding);


    const query = {
        "query": `mutation($propertyInsuranceLossRegister:PropertyInsuranceLossRegisterInputType!) 
                    {
                        save(propertyInsuranceLossRegister:$propertyInsuranceLossRegister)
                            {
                                propertyInsuranceLossRegisterID
                            }
                    }`,
        "variables": { "propertyInsuranceLossRegister": propertyInsuranceLossRegister }
    }

    return await customGQLQuery(`property-insurance-loss-register`, query);
}
