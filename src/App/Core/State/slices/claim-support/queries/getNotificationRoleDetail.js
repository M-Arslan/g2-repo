import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers';

export class getNotificationRoleDetail extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.Claim_SUPPORT_TYPES, 'notificationStatus');
        this.defineVariable('notificationID', 'String', true)
            .defineFields(
                'notificationRoleID',
                'notificationID',
                'roleID',
                'claimStatusTypeID',
                'modifiedDate',
                'modifiedBy',
                'createdDate',
                'createdBy'
            )
    }
}