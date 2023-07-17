import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetAuthorityAmount extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.CLAIMS_COMMON, 'getAuthorityAmountList');
        this.defineFields(
            'authorityAmountID',
            'userID',
            'genServeID',
            'g2LegalEntityID',
            'legalEntityManagerID',
            'reserveAmount',
            'paymentAmount'
        );
        this.shouldCache(`${GQL_SCHEMAS.CLAIMS_COMMON}|authorityAmount`);
    }
}