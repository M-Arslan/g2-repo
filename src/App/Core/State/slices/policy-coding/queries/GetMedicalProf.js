import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class GetMedicalProf extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.POLICY_CODINGS, 'medicalProfPolicyCodings');

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
