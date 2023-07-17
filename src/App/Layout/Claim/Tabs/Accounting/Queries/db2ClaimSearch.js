import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers/GraphQL';

export class DB2ClaimsSearch extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.DB2CLAIMS, 'search');

        this.defineVariable('filterValue', 'String', true)
            .defineVariable('filterType', 'String', true)
            .defineFields(
                'claimID',
                'statusCode',
                'statusText',
                'insuredName',
                'insuredNameContinuation',
                'policyID',
                'examinerID',
                'examinerFirstName',
                'examinerLastName',
            );
    }
}
