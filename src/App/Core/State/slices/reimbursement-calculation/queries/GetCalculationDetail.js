import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers';
export class GetCalculationDetail extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.WC_REIMBURSEMENT, 'calculationDetail');
        this.defineVariable('wCReimbursementID', 'String', true)
            .defineFields(
                'wCReimbursementID',
                'kindOfBusinessID',
                'bobRetention',
                'alaeTreatementID',
                'grcParticipation',
                'totalAdjustedPaidIndemnity',
                'totalAdjustedMedical',
                'totalOutstandingAdjustedMedicalReserves',
                'totalOutstandingAdjustedLossReserves',
                'totalAdjustedLossPaid',
                'totalOutstandingReconciledLossReserves',
                'totalAdjustedPaidExpense',
                'totalOutstandingExpenseReserves',
                'totalRecovery',
        )
    }
}