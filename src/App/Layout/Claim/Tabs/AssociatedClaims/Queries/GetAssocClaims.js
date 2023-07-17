import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers/GraphQL';

export class GetAssocClaims extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.ASSOC_CLAIM, 'forClaim');

        this.defineVariable('claimMasterId', 'String', true)
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
