import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetCauseOfLossCodes extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.ACCOUNTING, 'causeOfLossCodesList');

        this.defineFields(
            'code',
            'description',
            'active',
            'createdDate',
            'createdBy');
        this.shouldCache(`${GQL_SCHEMAS.ACCOUNTING}|causeOfLossCodess`);
    }
}