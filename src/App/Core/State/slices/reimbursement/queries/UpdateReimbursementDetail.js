import {
    GQL_MUTATION,
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class UpdateReimbursementDetail extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.WC_REIMBURSEMENT, 'save', GQL_MUTATION.IS_MUTATION);
        this.defineVariable('wcReimbursement', 'WCReimbursementInputType', true)
            .defineFields(
                'wCReimbursementID',
                'claimMasterID',
                'payeeName',
                'claimStatusTypeID',
                'vendorNumber',
                'mailingStreetAddress',
                'mailingStreetCity',
                'mailingStreetState',
                'mailingStreetZip',
                'email',
                'comments',
                'paymentThrough',
                'createdDate',
                'createdBy',
                'modifiedDate',
                'modifiedBy'
            );
    }
}