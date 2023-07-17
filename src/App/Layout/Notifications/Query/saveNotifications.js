import {
    customGQLQuery
} from '../../../Core/Services/EntityGateway';

export const markNotificationRead = async (Notification) => {
    const NotificationUser = {
        "notificationUserID": Notification.notificationUserID,
        "notificationID": Notification.notificationID,
        "networkID": Notification.networkID,
        "emailAddress": Notification.emailAddress,
        "firstName": Notification.firstName,
        "lastName": Notification.lastName,
        "isCopyOnly": Notification.isCopyOnly,
        "statusCode": Notification.statusCode,
        "reminderDate": Notification.reminderDate,
        "createdBy": Notification.createdBy,
        "createdDate": Notification.createdDate,
        "modifiedBy": Notification.modifiedBy,
    }
    const query = {
        "query": 'mutation ($NotificationUser:NotificationUsersInputType!){markAsRead(notificationUser: $NotificationUser) {notificationUserID} }',
        "variables": { NotificationUser }
    }
    return await customGQLQuery(`notificationUser`, query);
}

export const updateReminderDate = async (Notification) => {

    let prevRDate = new Date(Notification.reminderDate);
    Notification.reminderDate = prevRDate.toISOString();

    const NotificationUser = {
        "notificationUserID": Notification.notificationUserID,
        "notificationID": Notification.notificationID,
        "networkID": Notification.networkID,
        "emailAddress": Notification.emailAddress,
        "firstName": Notification.firstName,
        "lastName": Notification.lastName,
        "isCopyOnly": Notification.isCopyOnly,
        "statusCode": Notification.statusCode,
        "reminderDate": Notification.reminderDate,
        "createdBy": Notification.createdBy,
        "createdDate": Notification.createdDate,
        "modifiedBy": Notification.modifiedBy,
    }
    const query = {
        "query": 'mutation ($NotificationUser:NotificationUsersInputType!){updateReminderDate(notificationUser: $NotificationUser) {notificationUserID} }',
        "variables": { NotificationUser }
    }
    return await customGQLQuery(`notificationUser`, query);
}


export const createNotification = async (Notifications) => {
    const query = {
        "query": 'mutation ($Notifications:NotificationsInputType!){create(notifications: $Notifications) {notificationID notificationUsers{notificationUserID}} }',
        "variables": { Notifications }
    }
    return await customGQLQuery(`notifications`, query);
}
