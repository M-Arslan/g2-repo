import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers';
export class GetAdjustmentsDetail extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.WC_REIMBURSEMENT_ADJUSTMENTS, 'detail');

        this.defineVariable('reimbursementAdjustmentID', 'String', true)
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