import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers';

export class GetClaimActivity extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.ACCOUNTING, 'accountingList');

        this.defineVariable('claimMasterID', 'String', true)
            .defineFields(
                'activityID',
                'claimMasterID',
                'claimStatusTypeID',
            );
    }
}