import {
    GQL_MUTATION,
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class SaveClaimantCIBActivity extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CLAIM_CLAIMANT, 'saveClaimantCIBActivity', GQL_MUTATION.IS_MUTATION);

        this.defineVariable('claimantCIBActivity', 'ClaimantCIBActivityInputType', true)
            .defineFields(
                'claimantCIBActivityID',
            );
    }

}
