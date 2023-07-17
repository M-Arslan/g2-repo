import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadPropertyInsuranceLossRegisterDetail = async (activityID) => {
    let query = {
        "query": `
            query {
               detail(activityID:"${activityID}"){ 
                        propertyInsuranceLossRegisterID
                        claimMasterID
                        activityID
                        companyCodeRef
                        policyType
                        lossAddressStreet1
                        lossAddressStreet2
                        lossAddressCity
                        lossAddressState
                        lossAddressZIP
                        lossDesc
                        insuredRole
                        insuredBusiness
                        insuredAddressStreet1
                        insuredAddressStreet2
                        insuredAddressCity
                        insuredAddressState
                        insuredAddressZIP
                        akaBusiness
                        akaName
                        akaAddressStreet1
                        akaAddressStreet2
                        akaAddressCity
                        akaAddressState
                        akaAddressZIP
                        causeOfLossCode
                        propertyLost
                        vehicleID
                        amountOfPolicyBuilding
                        amountOfPolicyContents
                        amountOfPolicyStock
                        amountOfPolicyUseAndOccupancy
                        amountOfPolicyOtherScehduled
                        estimatedLossBuilding
                        estimatedLossContents
                        estimatedLossStock
                        estimatedLossUseAndOccupancy
                        estimatedLossOtherScehduled
                        createdDate
                        createdBy
                        modifiedDate
                        modifiedBy
                } 
            }
            `
    }

    return await customGQLQuery(`property-insurance-loss-register`, query);
};

export const loadPropertyInsuranceLossRegisterList = async (claimMasterID) => {
    let query = {
        "query": `
            query {
               list(claimMasterID:"${claimMasterID}")
                    { 
                        propertyInsuranceLossRegisterID
                        claimMasterID
                        activityID
                        companyCodeRef
                        policyType
                        lossAddressStreet1
                        lossAddressStreet2
                        lossAddressCity
                        lossAddressState
                        lossAddressZIP
                        lossDesc
                        insuredRole
                        insuredBusiness
                        insuredAddressStreet1
                        insuredAddressStreet2
                        insuredAddressCity
                        insuredAddressState
                        insuredAddressZIP
                        akaBusiness
                        akaName
                        akaAddressStreet1
                        akaAddressStreet2
                        akaAddressCity
                        akaAddressState
                        akaAddressZIP
                        causeOfLossCode
                        propertyLost
                        vehicleID
                        amountOfPolicyBuilding
                        amountOfPolicyContents
                        amountOfPolicyStock
                        amountOfPolicyUseAndOccupancy
                        amountOfPolicyOtherScehduled
                        estimatedLossBuilding
                        estimatedLossContents
                        estimatedLossStock
                        estimatedLossUseAndOccupancy
                        estimatedLossOtherScehduled
                        createdDate
                        createdBy
                        modifiedDate
                        modifiedBy
                } 
            }
            `
    }

    return await customGQLQuery(`property-insurance-loss-register`, query);
};

