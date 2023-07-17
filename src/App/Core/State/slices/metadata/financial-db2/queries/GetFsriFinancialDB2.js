import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetFsriFinancialDB2 extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.ACCOUNTING, 'fsriDB2Financials');
        this.defineVariable('statutoryClaimID', 'String', true)
            .defineVariable('statutorySystem', 'String', true)
            .defineVariable('g2LegalEntityID', 'Int', true)
            .defineFields('statutoryClaimID',
            'lossStatus',
            'paidLoss',
            'paidExpense',
            'lossReserve',
            'expenseReserve',
            'additionalLossRes',
            'additionalExpenseRes',
            'subrogation',
            'salvage',
            'totalGrossIncurred'
        );
        this.shouldCache(`${GQL_SCHEMAS.REFERENCE}|fsriDB2Financials`);
    }
}