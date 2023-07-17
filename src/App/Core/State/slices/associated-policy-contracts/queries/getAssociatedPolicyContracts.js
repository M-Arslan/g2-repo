import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers';

export class getAssociatedPolicyContracts extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.ASSOCIATED_POLICY_CONTRACT, 'list');

        this.defineVariable('claimMasterID', 'String', true)
            .defineVariable('onlyLoadPrimary', 'Boolean', true)
            .defineFields(
                'associatedPolicyID',
                'claimMasterID',
                'g2CompanyNameID',
                'policyID',
                'associatedPolicyID',  
                'insuredName',  
                'underwriterID',  
                'effectiveDate',  
                'expirationDate',  
                'cancelledDate',
                'comment',
                'isPrimary',
                'coverage',
                'underwriter',
                'pastUnderwriter'
            );
    }
}