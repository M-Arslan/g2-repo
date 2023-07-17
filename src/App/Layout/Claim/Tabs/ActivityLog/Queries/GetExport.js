import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers/GraphQL';

export class GetExport extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CLAIM_NARRATIVE, 'export');

        this.defineVariable('claimMasterID', 'String', true)
            .defineVariable('claimID', 'String', true)
            .defineFields(
                'claimMasterID',
                'document',
            );
    }
}
