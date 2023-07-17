import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers/GraphQL';

export class GetNarratives extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CLAIM_NARRATIVE, 'narratives');

        this.defineVariable('claimMasterID', 'String', true)
            .defineVariable('isSupervisor', 'Boolean', false)
            .defineFields(
                'claimNarrativeID',
                'claimMasterID',
                'isSupervisor',
                'narrative',
                'raw',
                'createdBy',
                'createdByDisplayName',
                'createdDate',
                'userCreatedDate',
            );
    }
}
