import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetClaimDB2 extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.DB2CLAIMS, 'search');
        this.defineVariable('filterType', 'String', true)
            .defineVariable('filterValue', 'String', true)
            .defineVariable('g2LegalEntityID', 'Int', true)
            .defineVariable('includeLegal', 'Boolean', true)
            .defineFields(
            'claimID',
            'statusCode',
            'statusText',
            'insuredName',
            'insuredNameContinuation',
            'policyID'
        );
        this.shouldCache(`${GQL_SCHEMAS.REFERENCE}|claimDB2`);
    }
}