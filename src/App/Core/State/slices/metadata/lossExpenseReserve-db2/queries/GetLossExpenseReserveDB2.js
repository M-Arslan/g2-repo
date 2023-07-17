import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetLossExpenseReserveDB2 extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.CLAIMS_COMMON, 'getLossExpenseReserve');
        this.defineVariable('claimID', 'String', true)
            .defineVariable('g2LegalEntityID', 'Int', true)
            .defineFields('expenseReserves',
            'lossReserves',
            'medPayExpenseReserves',
            'medPayLossReserves'
        );
        this.shouldCache(`${GQL_SCHEMAS.CLAIMS_COMMON}|lossExpenseReserveDB2`);
    }
}