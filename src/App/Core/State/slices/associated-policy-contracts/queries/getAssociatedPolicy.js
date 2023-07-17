import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers';

export class getAssociatedPolicy extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.ASSOCIATED_POLICY_CONTRACT, 'detail');

        this.defineVariable('associatedPolicyID', 'String', true)
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
                'isPrimary',
                'createdDate',
                'createdBy',
                'coverage',
                'comment',
                'underwriter',
                'pastUnderwriter'
            );
    }
}