import {
    GQL_SCHEMAS,
    GQL_MUTATION,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class DeleteCompanyDollar extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.WC_REIMBURSEMENT_COMPANY_DOLLAR, 'del', GQL_MUTATION.IS_MUTATION);
        this.defineVariable('reimbursementCompanyDollarID', 'String', true);
        this.notifyOnSuccess('Company Dollar Data deleted successfully');
    }
}
    