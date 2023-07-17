import {
    GQL_MUTATION,
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class SaveFlagAsRejected extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CLAIM_CLAIMANT, 'flagAsRejected', GQL_MUTATION.IS_MUTATION);

        this.defineVariable('claimantMedicareID', 'String', true)
            .defineVariable('rejectionReason', 'String', true)
            .defineFields(
                'claimantMedicareID',
                'cMSRejectLogID',
                'rejectDate',
                'rejectReason',
                'rejectedBy',
                'errorCorrectedBy',
                'correctedDate',
                'correctedComment',
                'createdDate',
                'createdBy',
                'modifiedDate',
                'modifiedBy'
            );
    }

}
