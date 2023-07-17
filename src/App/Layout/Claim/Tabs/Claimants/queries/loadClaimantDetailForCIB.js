import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadClaimantDetailForCIB = async (claimantID) => {
    let query = {
        "query": `
            query {
               detail(claimantID:"${claimantID}"){ 
                    claimantID
                    claimMasterID
                    firstName
                    lastName
                    dateOfBirth
                    addressStreet1
                    addressCity
                    addressState
                    addressZIP
                    gender
                    bIClaimant
                    injuries
                    cIB
                    {
                        claimCoverageTypeCode
                        cIBLossTypeID
                        companyCodeRef
                        insuredStreet
                        insuredCity
                        insuredState
                        insuredZip
                    }
                } 
            }
            `
    }

    return await customGQLQuery(`claim-claimant`, query);
};
