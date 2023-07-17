import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadPropertyPolicyDetail = async (claimMasterID) => {
    let query = {
        "query": `
            query {
               detail(claimMasterID:"${claimMasterID}"){ 
                    propertyPolicyID
                    claimMasterID
                    policyForms
                    limits
                    coinsurance
                    deductible
                    generalStarSharedPercent
                    calcBasis
                    lossAddressStreet1
                    lossAddressStreet2
                    lossAddressCity
                    lossAddressState
                    lossAddressZIP
                    lossAddressCounty
                    salvage
                    restitution
                    subrogation
                    subroDemand,
                    subroRecovered
                    subrogationOpenDate
                    subrogationClosingDate
                    subrogationDiaryDate
                    mortgageHolder
                    lienHolder
                    debtor
                    comment
                    createdDate
                    createdBy
                    modifiedDate
                    modifiedBy
                    coinsurancePenaltyFlag
                } 
            }
            `
    }

    return await customGQLQuery(`property-policy`, query);
};
