import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetBranches extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.CLAIM_BRANCH, 'list');

        this.defineFields('claimBranchID', 'branchCode', 'branchName');
        this.shouldCache(`${GQL_SCHEMAS.REFERENCE}|branches`);
    }
}