import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class GetPrimary extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.POLICY_CODINGS, 'primaryPolicyCodings');

        this.defineVariable('policyID', 'String', true)
            .defineFields(
                'aggregateLimit',
                'attachmentTypeCode',
                'classCode',
                'className',
                'coverageCode',
                'formOfCoverageCode',
                'perOccuranceLimit',
                'casualtyDeductible',
            );
    }
}
