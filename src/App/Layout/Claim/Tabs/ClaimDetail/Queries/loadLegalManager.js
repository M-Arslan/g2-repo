import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadLegalManager = async (id) => {
    let query = {
        query: `query { 
                    detail(id:"${id}") { 
                        g2LegalEntityID
                        legalEntityManagerName
                    } 
                }
            `
    };

    return await customGQLQuery('claim-master', query);
};
