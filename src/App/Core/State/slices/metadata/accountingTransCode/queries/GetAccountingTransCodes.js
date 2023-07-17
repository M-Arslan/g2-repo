import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetAccountingTransCodes extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.ACCOUNTING, 'accountingTransCodeList');

        this.defineFields(
            'transCode',
            'transCodeDesc',
            'reserveChange',
            'category',
            'active',
        );
        this.shouldCache(`${GQL_SCHEMAS.REFERENCE}|accountingTransCodes`);
    }
}