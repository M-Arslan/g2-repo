import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadClaimRiskCodingDetail = async (claimMasterID) => {
    let query = {
        "query": `
            query {
               detail(claimMasterID:"${claimMasterID}"){ 
                    claimRiskCodingID
                    claimMasterID
                    causeOfLossCode
                    lineOfBusinessCodingTypeID
                    professionalClaimCategoryID
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
            }
            `
    }

    return await customGQLQuery(`claim-risk-coding`, query);
};

export const loadClaimDetail = async (id) => {
    let query = {
        query: `query { 
                    detail(id:"${id}") { 
                        claimMasterID
                        claimType
                        claimID
                        claimPolicyID
                        lossDesc
                        ichronicleID
                        batchID
                        genReCompanyName
                        dateReceived
                        lossLocation
                        dOL
                        claimExaminerID
                        deptCD
                    } 
                }
            `
    };

    return await customGQLQuery('claim-master', query);
};