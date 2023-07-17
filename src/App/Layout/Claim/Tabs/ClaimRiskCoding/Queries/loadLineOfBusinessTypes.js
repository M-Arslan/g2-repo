import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadLineOfBusinessTypes = async (g2LegalEntityID) => {
    let query = {
        "query": `
            query {
               lineOfBusinessTypesByID(g2LegalEntityID:"${g2LegalEntityID}"){
                    lineOfBusinessCodingTypeID
                    lineOfBusinessCodingText
                    active
                    sequence
                    createdBy
                    createdDate
                    modifiedBy
                    modifiedDate
                } 
            }
            `
    }

    return await customGQLQuery(`claim-risk-coding`, query);
};

export const loadSpecialFlagTypes = async () => {
    let query = {
        "query": `
            query {
               riskCodingSpecialFlagTypes{ 
                    riskCodingSpecialFlagTypeID
                    specialFlagText
                    active
                    sequence
                    createdBy
                    createdDate
                    modifiedBy
                    modifiedDate
                } 
            }
            `
    }

    return await customGQLQuery(`claim-risk-coding`, query);
};
