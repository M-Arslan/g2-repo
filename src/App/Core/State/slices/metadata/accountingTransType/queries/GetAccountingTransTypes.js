import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetAccountingTransTypes extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.ACCOUNTING, 'accountingTranstypeList');
        this.defineFields(
            'accountingTransTypeID',
            'accountingTransTypeText',
            'newActivityVisible',
            'groupName',
            'active',
            'createdDate',
            'createdBy');
        this.shouldCache(`${GQL_SCHEMAS.ACCOUNTING}|accountingTranstypes`);
    }
}