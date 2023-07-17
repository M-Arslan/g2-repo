import {
    GQL_SCHEMAS,
    GQL_MUTATION,
    GraphOperation
} from '../../../../../Core/Providers/GraphQL';

export class AddAssocClaims extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.ASSOC_CLAIM, 'add', GQL_MUTATION.IS_MUTATION);
        this.defineVariable('data', 'AddClaimsInputType', true);
        this.notifyOnSuccess('New Claims have been associated with this Claim Master');
    }
}