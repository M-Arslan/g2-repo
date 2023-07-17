import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetCurrencies extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.ACCOUNTING, 'currencyTypeList');

        this.defineFields(
            'iSO',
            'name',
            'active');
        this.shouldCache(`${GQL_SCHEMAS.ACCOUNTING}|currencies`);
    }
}