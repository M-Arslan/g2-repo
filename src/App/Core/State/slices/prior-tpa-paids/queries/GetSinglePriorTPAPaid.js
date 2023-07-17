import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers';
export class GetSinglePriorTPAPaid extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.WC_REIMBURSEMENT_PRIOR_TPA_PAID, 'singlePriorTPAPaid');

        this.defineVariable('wCReimbursementID', 'String', true)
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