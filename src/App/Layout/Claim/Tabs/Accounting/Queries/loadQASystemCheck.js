import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadQASystemCheck = async (activityID) => {
    let query = {
        "query": `
            query {
               qASystemCheckList(activityID:"${activityID}"){ 
                    qASystemCheckID
                    activityID
                    genServeChecked
                    conferChecked
                    frsiChecked
                    createdDate
                    createdBy
                    modifiedDate
                } 
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};