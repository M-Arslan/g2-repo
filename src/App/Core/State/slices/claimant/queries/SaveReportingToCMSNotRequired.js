import {
    GQL_MUTATION,
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class SaveReportingToCMSNotRequired extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CLAIM_CLAIMANT, 'saveReportingToCMSNotRequired', GQL_MUTATION.IS_MUTATION);

        this.defineVariable('claimant', 'ClaimClaimantInputType', true)
            .defineFields(
                'claimantID',
                'medicareReportedDate'
            );
    }

}
