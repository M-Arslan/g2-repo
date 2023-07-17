import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const saveClaimRiskCodingDetail = async (claimRiskCoding) => {
    const query = {
        "query": `mutation($claimRiskCoding:ClaimRiskCodingInputType!) 
                    {
                        save(claimRiskCoding:$claimRiskCoding)
                            {
                                claimRiskCodingID
                                claimMasterID
                                causeOfLossCode
                                lineOfBusinessCodingTypeID
                                active
                                createdBy
                                createdDate
                                modifiedBy
                                modifiedDate
                                claimCAT
                                {
                                    claimCATID
                                    claimRiskCodingID
                                    cATNumber
                                    cATDeductible
                                    cATLimit
                                    cATTotalLossIndicator
                                    active
                                    createdDate
                                    createdBy
                                    modifiedDate
                                    modifiedBy
                                }
                                claimCoinsurance
                                {
                                    claimCoinsuranceID
                                    claimRiskCodingID
                                    calcBasis

                                    bLDGValue
                                    bLDGReqdLimit
                                    bLDGLimit
                                    bLDGPenalty
                                    bLDGPenaltyAmt

                                    bPPValue
                                    bPPReqdLimit
                                    bPPLimit
                                    bPPPenalty
                                    bPPPenaltyAmt

                                    bIValue
                                    bIReqdLimit
                                    bILimit
                                    bIPenalty
                                    bIPenaltyAmt

                                    active
                                    createdDate
                                    createdBy
                                    modifiedDate
                                    modifiedBy
                                }

                            }
                    }`,
        "variables": { "claimRiskCoding": claimRiskCoding }
    }

    return await customGQLQuery(`claim-risk-coding`, query);
}
