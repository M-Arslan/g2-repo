import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const savePropertyPolicyDetail = async (propertyPolicy) => {
    const query = {
        "query": `mutation($propertyPolicy:PropertyPolicyInputType!) 
                    {
                        save(propertyPolicy:$propertyPolicy)
                            {
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
                    }`,
        "variables": { "propertyPolicy": propertyPolicy }
    }

    return await customGQLQuery(`property-policy`, query);
}
