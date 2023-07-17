import {
    GQL_MUTATION,
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class SaveCalculationDetail extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.WC_REIMBURSEMENT, 'saveCalculation', GQL_MUTATION.IS_MUTATION);
        this.defineVariable('reimbursementCalculationID', 'ReimbursementCalculationInputType', true)
            .defineFields(
                'kindOfBusinessID',
                'alaeTreatementID',
                'grcParticipation',
                'totalAdjustedPaidIndemnity',
                'totalOutstandingAdjustedLossReserves',
                'totalAdjustedMedical',
                'totalOutstandingAdjustedMedicalReserves',
                'totalAdjustedLossPaid',
                'totalOutstandingReconciledLossReserves',
                'totalAdjustedPaidExpense',
                'totalOutstandingExpenseReserves',
                'totalRecovery',
            )
    }
}