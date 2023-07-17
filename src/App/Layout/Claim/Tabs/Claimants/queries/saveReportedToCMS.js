import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const saveReportedToCMS = async (claimant) => {
    const query = {
        "query": "mutation($claimant:ClaimClaimantInputType!) {saveReportedToCMS(claimant:$claimant){claimantID medicareEligible medicareReportedDate }}",
        "variables": { "claimant": claimant }
    }
    return await customGQLQuery(`claim-claimant`, query);
}
