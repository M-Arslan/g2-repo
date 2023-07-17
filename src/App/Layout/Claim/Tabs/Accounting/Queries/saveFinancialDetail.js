import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const saveFinancialDetail = async (financial) => {
    const query = {
        "query": "mutation($financial:FinancialsInputType!) {saveFinancial(financial:$financial){financialID claimMasterID}}",
        "variables": { "financial": financial }
    }

    return await customGQLQuery(`accounting`, query);
}
