import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers';

export class getSupportTypes extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.SUPPORT_TYPE, 'detail');

        this.defineVariable('taskTypeID', 'String', true)
            .defineFields(
                'supportTypeID',
                'supportTypeText',
                'sequenceNumber',
                'active',
                'createdBy',
                'createdDate',
            );
    }
}