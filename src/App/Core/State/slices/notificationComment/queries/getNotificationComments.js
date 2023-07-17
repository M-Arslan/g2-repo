import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers';

export class getNotificationComments extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.Notification_Types, 'commentsList');

        this.defineVariable('notificationID', 'String', true)
            .defineFields(
                "notificationCommentID",
                "notificationID",
                "comment",
                "createdBy",
                "createdDate"
            );
    }
}