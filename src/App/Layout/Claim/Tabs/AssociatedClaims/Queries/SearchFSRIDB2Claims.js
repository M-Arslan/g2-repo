import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers/GraphQL';


export class SearchFSRIDB2Claims extends GraphOperation {

    constructor() {
        super(GQL_SCHEMAS.DB2CLAIMS, 'fsriAssociatedClaimSearch');
        this.defineVariable('filterType', 'String', true)
            .defineVariable('filterValue', 'String', true)
            .defineFields(
                'claimID',
                'policyID',
                'insuredName',
                'statusCode'
            );
    }
}