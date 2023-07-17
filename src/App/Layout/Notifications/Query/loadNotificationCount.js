import {
    customGQLQuery
} from '../../../Core/Services/EntityGateway';

export const loadNotificationCount = async (networkID) => {
    let query = {
        "query": `
            query {
               notificationCount(networkID:"`+ networkID + `"){
                  count
                }
            }
            `
    }

    let fetchNotifications = await customGQLQuery(`notifications`, query);
    return fetchNotifications;
};