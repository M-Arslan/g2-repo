import {
    GraphOperation,
    GQL_SCHEMAS,
    GQL_MUTATION
} from '../../../../Providers';

export class saveAssociatedPolicyContract extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.ASSOCIATED_POLICY_CONTRACT, 'save', GQL_MUTATION.IS_MUTATION);

        this.defineVariable('associatedPolicy', 'AssociatedPolicyContractsInputType', true)
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
                'coverage',
                'underwriter',
                'pastUnderwriter'
            );
    }
}

