import {
    customGQLQuery
} from '../../../Core/Services/EntityGateway';

export const notificationActionLog = async (notificationID) => {
    let query = {
        "query": `
            query {
               notificationActionLog(notificationID:"${notificationID}"){
                notificationUserID
                notificationID
                networkID
                emailAddress
                firstName
                lastName
                isCopyOnly
                statusCode
                reminderDate
                createdBy
                createdDate
                } 
            }
            `
    }

    return await customGQLQuery(`notificationUser`, query);
};