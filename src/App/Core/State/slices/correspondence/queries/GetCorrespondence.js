import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers/GraphQL';

export class GetCorrespondence extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CORRESPONDENCE, 'forClaim');

        this.defineVariable('claimMasterId', 'String', true)
            .defineFields(
                'correspondenceID',
                'claimMasterID',
                'from',
                'to',
                'cc',
                'bcc',
                'subject',
                'body',
                'rawData',
                'fileName',
                'templateName',
                'addToDocumentum',
                'status',
                'createdBy',
                'createdDate',
            );
    }
}
