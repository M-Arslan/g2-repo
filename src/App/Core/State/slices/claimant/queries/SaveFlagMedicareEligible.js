import {
    GQL_MUTATION,
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class SaveFlagMedicareEligible extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CLAIM_CLAIMANT, 'flagMedicareEligible', GQL_MUTATION.IS_MUTATION);

        this.defineVariable('claimantID', 'String', true)
            .defineFields(
                'claimantID',
                'medicareEligible',
                'medicareReportedDate',
            );
    }

}
