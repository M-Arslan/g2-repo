import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadWCClaimantDetail = async (wCClaimantID) => {
    let query = {
        "query": `
            query {
               detail(wCClaimantID:"${wCClaimantID}"){
                        wCClaimantID
                        claimMasterID
                        dateOfBirth
                        dateOfDeath
                        tabularStartDate
                        tabularEndDate
                        tabularEndReason
                        gender
                        deceased
                        tabular
                        escalating
                        tableType
                        comments
                } 
            }
            `
    }

    return await customGQLQuery(`wc-claim-claimant`, query);
};
