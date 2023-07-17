import {
    GQL_MUTATION,
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class UpdatePriorTPAPaidDetail extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.WC_REIMBURSEMENT_PRIOR_TPA_PAID, 'save', GQL_MUTATION.IS_MUTATION);
        this.defineVariable('reimbursementPriorTPAID', 'ReimbursementPriorTPAPaidInputType', true)
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