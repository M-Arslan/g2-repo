import {
    GQL_MUTATION,
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class SaveReportToISO extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CLAIM_CLAIMANT, 'saveReportToISO', GQL_MUTATION.IS_MUTATION);

        this.defineVariable('claimantID', 'String', true);
    }

}
