import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const saveFlagMedicareEligible = async (claimantID) => {
    const query = {
        "query": 'mutation { flagMedicareEligible(claimantID:"' + claimantID + '"){claimantID medicareEligible medicareReportedDate}}'
    }
    return await customGQLQuery(`claim-claimant`, query);
}
