import {
    GQL_MUTATION, GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers/GraphQL';

export class AddNarrative extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CLAIM_NARRATIVE, 'createClaimNarrative', GQL_MUTATION.IS_MUTATION);
        this.defineVariable('claimNarrative', 'ClaimNarrativeInputType', true);
        this.defineFields('claimNarrativeID');
        this.notifyOnSuccess('New Activity Log Entry has been saved.');
    }
}