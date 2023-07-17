import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers';
export class GetReimbursementDetail extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.WC_REIMBURSEMENT, 'detail');

        this.defineVariable('wCReimbursementID', 'String', true)
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