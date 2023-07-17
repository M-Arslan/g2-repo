import {
    GQL_MUTATION,
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class UpdateCompanyDollarDetail extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.WC_REIMBURSEMENT_COMPANY_DOLLAR, 'save', GQL_MUTATION.IS_MUTATION);
        
        this.defineVariable('reimbursementCompanyDollars', 'ReimbursementCompanyDollarInputType', true)
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
