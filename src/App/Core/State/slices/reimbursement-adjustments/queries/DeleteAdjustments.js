import {
    GQL_SCHEMAS,
    GQL_MUTATION,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class DeleteAdjustments extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.WC_REIMBURSEMENT_ADJUSTMENTS, 'del', GQL_MUTATION.IS_MUTATION);
        this.defineVariable('reimbursementAdjustmentID', 'String', true);
        this.notifyOnSuccess('Adjustment Data deleted successfully');
    }
}
