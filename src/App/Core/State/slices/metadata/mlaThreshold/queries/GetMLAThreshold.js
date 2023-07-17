import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetMLAThreshold extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.ACCOUNTING, 'mlaThresholdList');
        this.defineFields(
            'mlaThresholdID',
            'g2LegalEntityID',
            'claimType',
            'thresholdAmount',
            'modifiedDate',
            'modifiedBy',
            'createdDate',
            'createdBy');
        this.shouldCache(`${GQL_SCHEMAS.ACCOUNTING}|mlaThreshold`);
    }
}