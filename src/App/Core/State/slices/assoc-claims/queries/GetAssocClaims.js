import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class GetAssocClaims extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.ASSOC_CLAIM, 'forClaim');

        this.defineVariable('claimMasterId', 'String', true)
        this.defineVariable('g2LegalEntityID', 'Int', true)
        this.defineVariable('statSystem', 'String', false)
            .defineFields(
                'associatedClaimID',
                'claimID',
                'claimMasterID',
                'policyID',
                'statusCode',
                'statusText',
                'insuredName',
                'examinerID',
                'examinerFirstName',
                'examinerLastName',
            );
    }
}
