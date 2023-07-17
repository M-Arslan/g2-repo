import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class GetProperty extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.POLICY_CODINGS, 'propertyPolicyCodings');

        this.defineVariable('policyID', 'String', true)
            .defineFields(
                'aggregateLimit',
                'attachmentTypeCode',
                'classCode',
                'className',
                'coverageCode',
                'formOfCoverageCode',
                'perOccuranceLimit',
                'propertyDeductible',
            );
    }
}
