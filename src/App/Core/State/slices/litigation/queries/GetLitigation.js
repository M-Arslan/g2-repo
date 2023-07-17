import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers';

export class GetLitigation extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.LITIGATION, 'forClaim');

        this.defineVariable('claimMasterId', 'String', true)
            .defineFields(
                'litigationID',
                'claimMasterID',
                'litigationTypeCode',
                'litigationDate',
                'mediationDate',
                'arbitrationDate',
                'trialDate',
                'coveragePosition',
                'counselTypeCode',
                'claimResourceID',
                'claimResourceCompanyName',
                'budgetRequestedDate',
                'budgetReceivedDate',
                'budgetAmount',
                'createdDate',
                'createdBy',
                'comments',
                'caseCaption',
                'docketNumber',
                'courtVenue',
            );
    }
}
