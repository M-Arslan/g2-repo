import {
    GQL_MUTATION,
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class SaveFileCIB extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CLAIM_CLAIMANT, 'fileCIB', GQL_MUTATION.IS_MUTATION);

        this.defineVariable('claimantID', 'String', true)
            .defineFields(
                'cIB{ claimantCIBID }',
                'claimantID',
                'cIBRequested',
                'cIBRequestedDate'
            );
    }

}
