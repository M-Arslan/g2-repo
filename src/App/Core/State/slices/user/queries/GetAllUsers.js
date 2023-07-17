import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';
import {
    safeJsonParse
} from '../../../../Utility/safeObject';
import {
    TOKEN_KEY
} from '../AuthContext';

export class GetAllUsers extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.USER, 'users');

        this.defineFields(
            'userID',
            'firstName',
            'lastName',
            'fullName',
            'managerID',
            'emailAddress',
            'branchID',
            'userRoles { roleID }'
        );
    }
}
