import {
    GQL_SCHEMAS,
    GQL_MUTATION,
    GraphOperation
} from '../../../../../Core/Providers/GraphQL';

export class SaveCorrespondence extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CORRESPONDENCE, 'save', GQL_MUTATION.IS_MUTATION);
        this.defineVariable('data', 'CorrespondenceInputType', true);
        this.notifyOnSuccess('Correspondence changes have been submitted.');
    }
}
