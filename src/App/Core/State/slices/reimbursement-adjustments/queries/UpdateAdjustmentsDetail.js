import {
    GQL_MUTATION,
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class UpdateAdjustmentsDetail extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.WC_REIMBURSEMENT_ADJUSTMENTS, 'save', GQL_MUTATION.IS_MUTATION);
        this.defineVariable('reimbursementAdjustmentID', 'ReimbursementAdjustmentsInputType', true)
            .defineFields(
                'reimbursementAdjustmentID',
                'wCReimbursementID',
                'claimStatusTypeID',
                'adjustmentTypeID',
                'amountAdjusted',
                'adjustmentExplanation',
                'billingDate',
                'createdDate',
                'createdBy',
                'modifiedDate',
                'modifiedBy',
            )
    }
}