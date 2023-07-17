import {
    GQL_SCHEMAS,
    GQL_MUTATION,
    GraphOperation
} from '../../../../../Core/Providers/GraphQL';

export class SaveLitigation extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.LITIGATION, 'save', GQL_MUTATION.IS_MUTATION);
        this.defineVariable('data', 'LitigationInputType', true)
            .defineFields(
                'litigationID',
                'claimMasterID',
                'litigationTypeCode',
                'litigationDate',
                'arbitrationDate',
                'mediationDate',
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
