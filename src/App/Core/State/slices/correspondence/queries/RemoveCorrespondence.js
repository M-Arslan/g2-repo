import {
    GQL_SCHEMAS,
    GQL_MUTATION,
    GraphOperation
} from '../../../../../Core/Providers/GraphQL';

export class RemoveCorrespondence extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CORRESPONDENCE, 'del', GQL_MUTATION.IS_MUTATION);
        this.defineVariable('id', 'String', true);
        this.notifyOnSuccess('Correspondence has been deleted.');
    }
}
