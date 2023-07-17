import {
    GQL_MUTATION,
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL'

export class UpdateWCClaimantDetail extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.WC_CLAIM_CLAIMANT, 'save', GQL_MUTATION.IS_MUTATION);
        this.defineVariable('wcClaimant', 'WCClaimantInputType', true)
            .defineFields(
                'wCClaimantID',
                'claimMasterID',
                'claimantName',
                'dateOfBirth',
                'dateOfDeath',
                'tabularStartDate',
                'tabularEndDate',
                'tabularEndReason',
                'gender',
                'deceased',
                'tabular',
                'escalating',
                'tableType',
                'comments',
                'createdDate',
                'createdBy',
                'modifiedDate',
                'modifiedBy'
            );
    }
}