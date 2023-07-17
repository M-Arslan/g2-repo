import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const saveClaimantCIBActivity = async (claimantCIBActivity) => {
    const query = {
        "query": "mutation($claimantCIBActivity:ClaimantCIBActivityInputType!) {saveClaimantCIBActivity(claimantCIBActivity:$claimantCIBActivity){claimantCIBActivityID}}",
        "variables": { "claimantCIBActivity": claimantCIBActivity }
    }
    return await customGQLQuery(`claim-claimant`, query);
}
