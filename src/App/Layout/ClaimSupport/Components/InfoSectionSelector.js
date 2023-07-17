import React from 'react';
import { ClaimSupportInfoSection } from './ClaimSupportInfoSection';
import { NotificationComments } from './NotificationComment';
import { PriorActivityNotifications } from './NotificationActionLog/PriorActivityNotifications';

export const InfoSectionSelector = ({users, claimMasterID, policy, request, dispatch, NotificationID }) => {
    
    switch (request.selectedMenu) {
        case "CLAIMSUPPORT":
            return <ClaimSupportInfoSection policy={policy} request={request} dispatch={dispatch} NotificationID={NotificationID}/>
            break;
        case "NOTIFICATIONCOMMENT":
            return <NotificationComments NotificationID={NotificationID}/>;
            break;
        case "PRIORNOTIFICATIONS":
            return <PriorActivityNotifications request={request} users={users} claimMasterID={claimMasterID} NotificationID={NotificationID}/>;
            break;
        default:
            return null;
    }
}




