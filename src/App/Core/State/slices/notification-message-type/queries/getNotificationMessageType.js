import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers';

export class getNotificationMessageType extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.NOTIFICATION_MESSAGE_TYPE, 'list');
        this.defineFields(
            'notificationMessageTypeID',
            'notificationMessageTypeText',
            'active',
            'createdBy',
            'createdDate',
        );

    }
}