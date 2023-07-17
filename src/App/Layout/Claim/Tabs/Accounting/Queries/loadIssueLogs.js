import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadIssueLogs = async (activityID) => {
    let query = {
        "query": `
            query {
               issueLogList(activityID:"${activityID}"){ 
                    issueLogID
                    activityID
                    claimStatusTypeID
                    issueTypeID
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

