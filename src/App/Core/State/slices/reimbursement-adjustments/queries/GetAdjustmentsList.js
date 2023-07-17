import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers';
export class GetAdjustmentsList extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.WC_REIMBURSEMENT_ADJUSTMENTS, 'currentAdjustmentsList');

        this.defineVariable('wCReimbursementID', 'String', true)
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