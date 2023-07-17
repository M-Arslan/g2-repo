import {
    GQL_MUTATION,
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class SaveReportedToCMS extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CLAIM_CLAIMANT, 'saveReportedToCMS', GQL_MUTATION.IS_MUTATION);

        this.defineVariable('claimant', 'ClaimClaimantInputType', true)
            .defineFields(
                'claimantID',
                'medicareEligible',
                'medicareReportedDate',
            );
    }

}
