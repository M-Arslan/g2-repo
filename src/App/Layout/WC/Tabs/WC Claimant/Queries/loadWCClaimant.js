import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway'

export const loadWCClaimant = async (claimMasterID) => {
    let query = {
        "query": `
                query {
                    wcClaimant(claimMasterID: "${claimMasterID}"){
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
                    }`

    }
    return await customGQLQuery(`wc-claim-claimant`, query);
};