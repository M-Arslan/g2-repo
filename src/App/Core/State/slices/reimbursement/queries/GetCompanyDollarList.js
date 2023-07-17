import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers';
export class GetCompanyDollarList extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.WC_REIMBURSEMENT_COMPANY_DOLLAR, 'companyDollars');

        this.defineVariable('wCReimbursementID', 'String', true)
            .defineFields(
                'reimbursementCompanyDollarID',
                'wCReimbursementID',
                'wCClaimantID',
                'paidToDateIndemnity',
                'outstandingIndemnityReserves',
                'subrogation',
                'paidToDateMedical',
                'outstandingMedicalReserves',
                'secondInjuryFund',
                'totalLossPaid',
                'totalOutstandingLossReserves',
                'paidToDateExpense',
                'outstandingExpenseReserves',
                'comments',
                'createdDate',
                'createdBy',
                'modifiedDate',
                'modifiedBy',
                'wCClaimant{wCClaimantID claimMasterID claimantName dateOfBirth gender deceased tabular escalating tableType comments tabularEndReason dateOfDeath tabularStartDate tabularEndDate createdDate createdBy modifiedDate modifiedBy}'
            )
    }
}