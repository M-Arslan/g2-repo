import {
    GraphOperation,
    GQL_SCHEMAS,
    GQL_MUTATION
} from '../../../Providers';

export class deleteAssociatedPolicy extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.ASSOCIATED_POLICY_CONTRACT, 'delete', GQL_MUTATION.IS_MUTATION);
        this.defineVariable('associatedPolicyID', 'String', true)
            .defineFields('associatedPolicyID');
    }
}

