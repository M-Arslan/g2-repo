import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadQALogs = async (activityID) => {
    let query = {
        "query": `
            query {
               qALogList(activityID:"${activityID}"){ 
                    qALogID
                    activityID
                    grade
                    comment
                    createdDate
                    createdBy
                    modifiedDate
                } 
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};

