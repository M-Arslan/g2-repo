import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers/GraphQL';

export class SearchDB2Policy extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.POLICY, 'policyList');

        this.defineVariable('searchTerm', 'String', true)
            .defineVariable('searchType', 'String', true)
            .defineVariable('company', 'String', true)
            .defineVariable("g2LegalEntityID", 'Int', true )
            .defineFields(
                'insuredName',
                'expirationDate',
                'cancelDate',
                'effectiveDate',
                'policyID',

            );
    }
}   