import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class GetFacilitiesPgm extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.POLICY_CODINGS, 'facilitiesPGMPolicyCodings');

        this.defineVariable('policyID', 'String', true)
            .defineFields(
                'aggregateLimit',
                'attachmentTypeCode',
                'classCode',
                'className',
                'coverageCode',
                'formOfCoverageCode',
                'perOccuranceLimit',
            );
    }
}
