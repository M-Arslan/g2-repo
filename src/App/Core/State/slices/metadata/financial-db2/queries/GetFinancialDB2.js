import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetFinancialDB2 extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.ACCOUNTING, 'financialsDB2');
        this.defineVariable('claimID', 'String', true)
            .defineVariable('g2LegalEntityID', 'Int', true)
            .defineFields('claimID',
            'deductableRecoverable',
            'deductableRecovered',
            'expenseReserves',
            'lossReserves',
            'paidExpense',
            'paidLoss',
            'reinsuranceRecoverable',
            'reinsuranceRecovered',
            'reinsuranceReserves',
            'statusCode',
            'statusText'
        );
        this.shouldCache(`${GQL_SCHEMAS.REFERENCE}|financialsDB2`);
    }
}