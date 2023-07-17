import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class GetExcess extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.POLICY_CODINGS, 'excessPolicyCodings');

        this.defineVariable('policyID', 'String', true)
            .defineFields(
                'aggregateLimit',
                'attachmentTypeCode',
                'classCode',
                'className',
                'coverageCode',
                'formOfCoverageCode',
                'perOccuranceLimit',
                'uLLimit',
            );
    }
}
