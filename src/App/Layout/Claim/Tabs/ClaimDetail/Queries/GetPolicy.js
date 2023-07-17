import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers';

export class GetPolicy extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.POLICY, 'policy');

        this.defineVariable('id', 'String', true)
            .defineVariable('g2LegalEntityID', 'Int', true)
            .defineFields('cancelDate',
                'claimsMadeDate',
                'clientBusinessName',
                'mailingCity',
                'departmentCode',
                'departmentName',
                'effectiveDate',
                'expirationDate',
                'insuredCity',
                'insuredZip',
                'insuredStreetName',
                'insuredName',
                'insuredNameContinuation',
                'insuredState',
                'policyBranch',
                'underwriterID'
            )
            .makeSilent();
    }
}