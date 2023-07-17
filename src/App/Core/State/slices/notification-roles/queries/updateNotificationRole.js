import {
    GraphOperation,
    GQL_SCHEMAS,
    GQL_MUTATION
} from '../../../../Providers';

export class updateNotificationRole extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.Notification_Roles, 'updateNotificationRoleStatus', GQL_MUTATION.IS_MUTATION);

        this.defineVariable('notificationRole', 'NotificationRoleInputType', true)
            .defineFields(
                "claimStatusTypeID",
                "roleID",
                "notificationID",
                "notificationRoleID"
            );
    }
}