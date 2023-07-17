import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const saveReportToISO = async (claimantID) => {
    const query = {
        "query": 'mutation { saveReportToISO(claimantID:"' + claimantID + '")}'
    }
    return await customGQLQuery(`claim-claimant`, query);
}
