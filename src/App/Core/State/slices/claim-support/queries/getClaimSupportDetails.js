import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers';

export class getClaimSupportDetails extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.Claim_SUPPORT_TYPES, 'detail');

        this.defineVariable('notificationID', 'String', true)
            .defineFields(
                'notificationID',
                'claimMasterID  ',
                'typeCode',
                'title',
                'body',
                'relatedURL',
                'isHighPriority',
                'roleID',
                'taskTypeID',
                'supportTypeID',
                'createdDate',
                'createdBy',
                'claimType',
        )
        .defineFieldObject('notificationRoles', 
                'notificationRoleID',
                'notificationID',
                'roleID',
                'claimStatusTypeID',
        )
            .defineFieldObject('notificationUsers',
                "notificationUserID",
                "notificationID",
                "networkID",
                "emailAddress",
                "firstName",
                "lastName",
                "isCopyOnly",
                "statusCode",
                "reminderDate",
                "createdBy",
                "createdDate",
                "modifiedBy",
            )
    }
}