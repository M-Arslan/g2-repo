import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const checkStatClaimID = async (claimMasterID, statClaimId) => {
    let query = {
        query: `query { 
                    statClaim(claimMasterID:"${claimMasterID}",statClaimId:"${statClaimId}") {
                        claimMasterID
                        statutoryClaimID
                        fALClaimStatusTypeID
                    } 
                }
            `
    };

    return await customGQLQuery('claim-master', query);
};
