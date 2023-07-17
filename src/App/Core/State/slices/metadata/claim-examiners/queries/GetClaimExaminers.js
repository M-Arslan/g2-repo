import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetClaimExaminers extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CLAIM_EXAMINER, 'list');

        this
            .defineFields(
                'userID',
                'firstName',
                'lastName',
                'branchID',
                'active',
                'managerFirstName',
                'managerLastName'
            )
            .shouldCache('claim-examiners');
    }
}

export class GetClaimExaminersAll extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CLAIM_EXAMINER, 'listAll');

        this
            .defineFields(
                'userID',
                'firstName',
                'lastName',
                'branchID',
                'managerFirstName',
                'managerLastName',

            )
            .shouldCache('claim-examiners');
    }
}
