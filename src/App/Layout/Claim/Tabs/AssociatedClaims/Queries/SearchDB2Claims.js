import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers/GraphQL';

export class SearchDB2Claims extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.DB2CLAIMS, 'db2Search');

        this.defineVariable('searchTerm', 'String', true)
            .defineVariable('searchType', 'String', true)
            .defineVariable('statSystem', 'String', false)
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
    }
}
