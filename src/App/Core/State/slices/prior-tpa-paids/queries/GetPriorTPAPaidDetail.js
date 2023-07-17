import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers';
export class GetPriorTPAPaidDetail extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.WC_REIMBURSEMENT_PRIOR_TPA_PAID, 'detail');

        this.defineVariable('reimbursementPriorTPAID', 'String', true)
            .defineFields(
                'reimbursementPriorTPAID',
                'wCReimbursementID',
                'paidToDateIndemnity',
                'outstandingLossReserves',
                'paidToDateMedical',
                'outstandingMedicalReserves',
                'paidToDateExpense',
                'outstandingExpenseReserves',
                'totalLossPaid',
                'totalOutstandingLossReserves',
                'createdDate',
                'createdBy',
                'modifiedDate',
                'modifiedBy',
            )
    }
}