import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers';
export class GetReimbursementList extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.WC_REIMBURSEMENT, 'reimbursmentActivities');

        this.defineVariable('claimMasterID', 'String', true)
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
        )
    }
}