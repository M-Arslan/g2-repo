import {
    customGQLQuery
} from '../../../Core/Services/EntityGateway';
let newDate = new Date();
export const loadNotifications = async (userID, statusCode, claimMasterID = null, allNotification = false) => {
    let query = {
        "query": `
        query {
          notifications(claimMasterID:"${claimMasterID}",userID:"${userID}",statusCode:"${statusCode}")
          {
            notificationID
            claimMasterID
            claimID
            typeCode
            supportTypeID
            taskTypeID
            title
            body
            isHighPriority
            roleID
            relatedURL
            createdBy
            createdDate
            notificationUsers{
      		      notificationUserID                  
                  notificationID
                  networkID
                  emailAddress
                  reminderDate
                  firstName
                  lastName
                  isCopyOnly
                  statusCode
                  createdBy
                  createdDate
                  modifiedDate
                  modifiedBy
            }
          }
        }
        `
    };
    let fetchNotifications = await customGQLQuery(`notifications`, query);
    let uid = userID.replace("%5C", "\\");
    if (fetchNotifications.data !== undefined && fetchNotifications.data.notifications !== undefined && fetchNotifications.data.notifications?.length > 0) {
        let notifications = fetchNotifications.data.notifications;

        if (statusCode === 'N') {
            notifications = fetchNotifications.data.notifications.filter(notification => notification.notificationUsers.find((item) => {
                if (item.networkID?.toLowerCase() === uid.toLowerCase()) {
                    return new Date(item.reminderDate) <= newDate
                }
            }));
        }
        else {
            notifications = fetchNotifications.data.notifications.filter(notification => notification.notificationUsers.find((item) => {
                if (item.networkID?.toLowerCase() === uid.toLowerCase()) {
                    return true;
                }
            }));
        }

        if (claimMasterID !== null && !allNotification) {
            notifications = notifications.filter(notification => notification.notificationUsers.find((item) => {
                if (item.statusCode === 'N' && item.networkID?.toLowerCase() === uid.toLowerCase()) {
                    return item;
                }
            }));
        }
        notifications.forEach(notification => {
            notification['isHighPriorityNC'] = notification['isHighPriority'] === true ? 'High' : 'Low';
            notification.notificationUsers.filter(function (item) {
                if (item.networkID?.toLowerCase() === uid.toLowerCase()) {
                    notification['statusCode'] = item.statusCode === 'N' ? 'New' : 'Read';
                }
            });
        });
        notifications.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        if (allNotification) {
            fetchNotifications.data.notifications.forEach(notification => {
                notification['isHighPriorityNC'] = notification['isHighPriority'] === true ? 'High' : 'Low';
                notification.notificationUsers.filter(function (item) {
                    if (item.networkID?.toLowerCase() === uid.toLowerCase()) {
                        notification['statusCode'] = item.statusCode === 'N' ? 'New' : 'Read';
                    }
                });
            });
            fetchNotifications.data.notifications.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            return fetchNotifications.data.notifications;
        }
        else {
            return notifications;
        }
    }
    else {
        return [];
    }

};
