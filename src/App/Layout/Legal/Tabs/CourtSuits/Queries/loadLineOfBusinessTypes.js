import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadLineOfBusinessTypes = async () => {
    let query = {
        "query": `
            query {
               lineOfBusinessTypes{ 
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
