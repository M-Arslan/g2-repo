import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const saveClaimantDetail = async (claimant) => {

    claimant.lostIncome = parseInt(claimant.lostIncome);
    claimant.annualIncome = parseInt(claimant.annualIncome);
    claimant.medicalExpenses = parseInt(claimant.medicalExpenses);
    
    const query = {
        "query": "mutation($claimClaimant:ClaimClaimantInputType!) {save(claimClaimant:$claimClaimant){claimantID}}",
        "variables": { "claimClaimant": claimant }
    }

    return await customGQLQuery(`claim-claimant`, query);
}
