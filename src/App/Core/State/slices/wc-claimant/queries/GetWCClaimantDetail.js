import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers'
export class GetWCClaimantDetail extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.WC_CLAIM_CLAIMANT, 'detail');

        this.defineVariable('wCClaimantID', 'String', true)
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