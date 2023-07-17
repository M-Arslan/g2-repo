import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetClaimStatusTypes extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CLAIMS_COMMON, 'claimStatusTypesByPID');

        this
            .defineFields(
                'claimStatusTypeID',
                'claimProcessIndicatorID',
                'statusText',
            )
            .shouldCache('claim-status-types', () => 'claim-status-types');
    }
}
