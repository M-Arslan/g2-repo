import { customGQLQuery } from "../../../../../Core/Services/EntityGateway";

export const LoadNotificationActionLogList = async (claimMasterID, subID) => {
    let query = {
        "query": `
            query {
               actionLogList(claimMasterID:"${claimMasterID}",subID:"${subID}"){
                actionLogID
                actionTypeID
                claimMasterID
                createdBy
                createdDate
                subID
                } 
            }
            `
    }

    return await customGQLQuery(`actionlog`, query);
};