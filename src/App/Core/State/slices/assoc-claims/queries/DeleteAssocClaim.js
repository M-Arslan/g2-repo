import {
    GQL_SCHEMAS,
    GQL_MUTATION,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class DeleteAssocClaim extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.ASSOC_CLAIM, 'del', GQL_MUTATION.IS_MUTATION);
        this.defineVariable('id', 'String', true);
        this.notifyOnSuccess('Claim association deleted successfully');
    }
}
