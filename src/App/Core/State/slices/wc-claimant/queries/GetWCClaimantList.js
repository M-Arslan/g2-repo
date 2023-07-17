import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers'

export class GetWCClaimantList extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.WC_CLAIM_CLAIMANT, 'wcClaimants');

        this.defineVariable('claimMasterID', 'String', true)
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