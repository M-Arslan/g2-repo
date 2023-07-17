import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class GetPolicyAggregate extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CLAIM_MASTER, 'policyAggregate');

        this.defineVariable('policyId', 'String', true)
            .defineVariable('statSystem', 'String', false)
            .defineVariable('g2LegalEntityID', 'Int', true)
            .defineVariable('includeLegal', 'Boolean', true)
            .defineFields(
                'claimID',
                'policyID',
                'genServeStatusText',
                'fALClaimStatusText',
                'lossDate',
                'totalIncurred',
            );
    }
}
