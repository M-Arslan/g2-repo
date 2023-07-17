import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetConferFinancialDB2 extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.ACCOUNTING, 'conferDB2Financials');
        this.defineVariable('statutoryClaimID', 'String', true)
            .defineVariable('statutorySystem', 'String', true)
            .defineVariable('g2LegalEntityID', 'Int', true)
            .defineFields('totalIncurred',
                'totalPaidLoss',
                'totalLossReserve',
                'totalPaidExpense',
                'totalExpenseReserve',
                'totalSubrogation',
                'totalSalvage',
                'totalACR',
                'totalAER'
        ).defineFieldObject('genReStatutoryDB2FinancialsCollection',
            'statutoryClaimID',
            'statusCode',
            'transNatureCode',
            'transTypeCode',
            'transQualifierCode',
            'sumOfGRNCurrency'
        )
;
        this.shouldCache(`${GQL_SCHEMAS.REFERENCE}|conferDB2Financials`);
    }
}