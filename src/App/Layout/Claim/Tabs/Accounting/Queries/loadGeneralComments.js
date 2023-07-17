import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadGeneralComments = async (activityID) => {
    let query = {
        "query": `
            query {
               commentsList(activityID:"${activityID}"){
                    generalCommentID
                    activityID
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

