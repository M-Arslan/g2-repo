import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers';

export class getTaskTypes extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.TASK_TYPE, 'list');
        this.defineFields(
            'taskTypeID',
            'taskTypeText',
            'sequenceNumber',
            'active',
            'createdBy',
            'createdDate',
        );

    }
}