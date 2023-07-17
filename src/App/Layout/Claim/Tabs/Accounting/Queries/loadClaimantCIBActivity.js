import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadClaimantCIBActivity = async (activityID) => {
    let query = {
        "query": `
            query {
               cIBActivityDetails(activityID:"${activityID}"){ 
                    claimantCIBActivityID
                    claimantCIBID
                    activityID             
                } 
            }
            `
    }

    return await customGQLQuery(`claim-claimant`, query);
};