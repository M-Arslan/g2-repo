import {
    customGQLQuery
} from '../../../Core/Services/EntityGateway';

export const loadNotificationGridData = async (searchDataObj, IncludeClaim = false) => {
    let IncludeClaimQuery = IncludeClaim === true ? 'claimID' : '';
    let query = {
        "query": `query($notificationSearch:NotificationSearchInputType!)
            {
            notificationSearch(notificationSearch: $notificationSearch)
            {
                notificationSearchResult{
                    notificationID
                    claimMasterID
                    typeCode
                    title
                    body
                    ` + IncludeClaimQuery + `
                    isHighPriority
                    roleID
                    relatedURL
      		        notificationUserID
                    emailAddress
                    claimID
                    firstName
                    networkID
                    lastName
                    statusCode
                    isCopyOnly
                    reminderDate
                    createdBy
                    createdDate
                    modifiedDate
                    modifiedBy
                    taskTypeID
                    claimType
                }
            }
        }`,
        "variables": { "notificationSearch": searchDataObj }
    }

    let fetchNotifications = await customGQLQuery(`notifications`, query);
    return fetchNotifications.data?.notificationSearch?.notificationSearchResult;
}


export const loadAllNotificationGridData = async (searchDataObj) => {
    let query = {
        "query": `query($notificationSearchAll:NotificationSearchAllInputType!)
            {
            notificationSearchAll(notificationSearchAll: $notificationSearchAll)
            {
                notificationSearchAllResult{
                    notificationID
                    claimMasterID
                    typeCode
                    title
                    body
                    isHighPriority
                    roleID
                    relatedURL
                    createdBy
                    createdDate
                    modifiedDate
                    modifiedBy
                    claimType
                    taskTypeID
                }
            }
        }`,
        "variables": { "notificationSearchAll": searchDataObj }
    }

    let fetchNotifications = await customGQLQuery(`notifications`, query);
    return fetchNotifications.data?.notificationSearchAll?.notificationSearchAllResult;
}


export const loadClaimSupportDashboard = async (searchDataObj) => {
    let query = {
        "query": `query($claimSupportDashboard:ClaimSupportDashboardInputType!)
            {
            claimSupportDashboard(claimSupportDashboard: $claimSupportDashboard)
            {
                claimSupportDashboardResult{
                    notificationID
                    claimMasterID
                    typeCode
                    title
                    body
                    isHighPriority
                    roleID
                    relatedURL
      		        notificationUserID
                    emailAddress
                    firstName
                    networkID
                    lastName
                    statusCode
                    isCopyOnly
                    reminderDate
                    createdBy
                    createdDate
                    modifiedDate
                    modifiedBy
                    supportTypeID
                    claimType
                    claimStatusTypeID,
                    insuredName,
                    claimID,
                    policyID
                }
            }
        }`,
        "variables": { "claimSupportDashboard": searchDataObj }
    }

    let fetchNotifications = await customGQLQuery(`notifications`, query);
    return fetchNotifications.data?.claimSupportDashboard?.claimSupportDashboardResult;
}