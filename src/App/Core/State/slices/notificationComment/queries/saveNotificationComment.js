import {
    GraphOperation,
    GQL_SCHEMAS,
    GQL_MUTATION
} from '../../../../Providers';

export class saveNotificationComment extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.Notification_Types, 'create', GQL_MUTATION.IS_MUTATION);

        this.defineVariable('notificationComment', 'NotificationCommentInputType', true)
            .defineFields(
                "notificationID",
                "comment",
            );
    }
}

